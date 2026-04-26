const Meeting = require('../models/Meeting');
const Circle = require('../models/Circle');
const User = require('../models/User');
const zoomService = require('../services/zoomService');

/**
 * @desc    Get meeting dashboard preview (hosted, upcoming, past)
 * @route   GET /api/meetings/dashboard
 * @access  Private
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date(Date.now() - 5 * 60 * 1000);

    const hosted = await Meeting.find({ host: userId, startTime: { $gte: now } })
      .sort({ startTime: 1 })
      .limit(3);

    const safeHosted = hosted.map(m => {
      const obj = m.toObject ? m.toObject() : { ...m };
      obj.startLink = obj.meetingLink;
      return obj;
    });

    const userCircles = await Circle.find({ 'members.user': userId }).select('_id');
    const circleIds = userCircles.map(c => c._id);

    const upcoming = await Meeting.find({ 
      startTime: { $gte: now },
      $or: [
        { 'participants.user': userId },
        { circle: { $in: circleIds } }
      ]
    })
      .populate('host', 'username displayName profilePic')
      .populate('circle', 'name slug coverImage')
      .sort({ startTime: 1 })
      .limit(5);

    const past = await Meeting.find({
      endTime: { $lt: now },
      $or: [
        { host: userId }, 
        { 'participants.user': userId },
        { circle: { $in: circleIds } }
      ]
    })
      .populate('host', 'username displayName profilePic')
      .populate('circle', 'name slug coverImage')
      .sort({ endTime: -1 })
      .limit(5);

    const isHost = await Circle.exists({
      'members': {
        $elemMatch: {
          user: userId,
          role: { $in: ['admin', 'moderator'] }
        }
      },
      isActive: true
    });

    const currentUserIdStr = userId.toString();

    const safeUpcoming = upcoming.map(m => {
      const obj = m.toObject ? m.toObject() : { ...m };
      const hostIdStr = obj.host?._id?.toString() || obj.host?.toString();
      // Even for hosts, we use the join link (meetingLink) to hide the admin identity
      obj.startLink = obj.meetingLink; 
      if (hostIdStr !== currentUserIdStr) {
        delete obj.startLink;
      }
      return obj;
    });

    const safePast = past.map(m => {
      const obj = m.toObject ? m.toObject() : { ...m };
      const hostIdStr = obj.host?._id?.toString() || obj.host?.toString();
      obj.startLink = obj.meetingLink;
      if (hostIdStr !== currentUserIdStr) {
        delete obj.startLink;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      data: {
        hosted: safeHosted,
        upcoming: safeUpcoming,
        past: safePast,
        canHost: !!isHost
      }
    });
  } catch (error) {
    console.error('Error in getDashboard:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get circles the user is allowed to schedule meetings in
 * @route   GET /api/meetings/eligible-circles
 * @access  Private
 */
exports.getEligibleCircles = async (req, res) => {
  try {
    const circles = await Circle.find({
      'members': {
        $elemMatch: {
          user: req.user._id,
          role: { $in: ['admin', 'moderator'] }
        }
      },
      isActive: true
    }).select('name _id');

    res.status(200).json({
      success: true,
      data: circles
    });
  } catch (error) {
    console.error('Error in getEligibleCircles:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Schedule a new meeting
 * @route   POST /api/meetings/schedule
 * @access  Private
 */
exports.scheduleMeeting = async (req, res) => {
  try {
    const { title, description, circle, startTime, scheduledDuration, settings } = req.body;
    
    if (!title || !startTime) {
      return res.status(400).json({ success: false, message: 'Title and startTime are required' });
    }

    if (new Date(startTime) < new Date()) {
      return res.status(400).json({ success: false, message: 'Meeting date and time cannot be in the past.' });
    }

    if (circle) {
      const isCircleAdmin = await Circle.exists({
        _id: circle,
        'members': {
          $elemMatch: {
            user: req.user._id,
            role: { $in: ['admin', 'moderator'] }
          }
        },
        isActive: true
      });
      if (!isCircleAdmin) {
        return res.status(403).json({ success: false, message: 'You must be a community host (admin or moderator) of this circle to schedule a meeting.' });
      }
    } else {
      const isGeneralHost = await Circle.exists({
        'members': {
          $elemMatch: {
            user: req.user._id,
            role: { $in: ['admin', 'moderator'] }
          }
        },
        isActive: true
      });
      if (!isGeneralHost) {
        return res.status(403).json({ success: false, message: 'Only community hosts can create meetings.' });
      }
    }

    // Create Zoom Meeting via Server-to-Server OAuth
    const zoomMeeting = await zoomService.createMeeting({
      title,
      description,
      startTime,
      duration: scheduledDuration || 60,
      password: settings?.requirePassword ? settings.password : undefined
    });
    
    let endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + parseInt(scheduledDuration || 60, 10));

    const meetingData = {
      title,
      description,
      host: req.user._id,
      startTime,
      scheduledDuration: scheduledDuration || 60,
      endTime,
      roomId: zoomMeeting.id,
      meetingLink: zoomMeeting.joinUrl,
      startLink: zoomMeeting.joinUrl, // Use join link instead of start link to prevent host being identified as admin
      status: 'scheduled',
      settings: {
        ...settings,
        password: zoomMeeting.password || settings?.password
      }
    };

    if (circle) {
      meetingData.circle = circle;
    }

    const meeting = await Meeting.create(meetingData);
    
    // Increment meeting count for circle dashboard stats
    if (circle) {
      await Circle.findByIdAndUpdate(circle, { $inc: { 'stats.meetingCount': 1 } });
    }

    // Add host as accepted participant automatically
    await meeting.addParticipant(req.user._id, 'accepted');

    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error in scheduleMeeting:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get host's own meetings
 * @route   GET /api/meetings/my
 * @access  Private
 */
exports.getMyMeetings = async (req, res) => {
  try {
    const now = new Date(Date.now() - 5 * 60 * 1000);
    const meetings = await Meeting.find({ 
      host: req.user._id,
      endTime: { $gte: now }
    })
      .populate('circle', 'name slug coverImage')
      .sort({ startTime: 1 });

    const safeMeetings = meetings.map(m => {
      const obj = m.toObject();
      obj.startLink = obj.meetingLink;
      return obj;
    });

    res.status(200).json({
      success: true,
      data: safeMeetings
    });
  } catch (error) {
    console.error('Error in getMyMeetings:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Start a meeting dynamically
 * @route   PUT /api/meetings/:id/start
 * @access  Private
 */
exports.startMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, host: req.user._id });
    
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found or you are not authorized' });
    }
    
    meeting.status = 'live';
    meeting.startTime = new Date();
    await meeting.save();
    
    // Add host as an attended participant
    await meeting.updateParticipantStatus(req.user._id, 'attended');
    
    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error in startMeeting:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Delete a meeting
 * @route   DELETE /api/meetings/:id
 * @access  Private
 */
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, host: req.user._id });
    
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found or you are not authorized' });
    }
    
    if (meeting.roomId) {
      try {
        await zoomService.deleteMeeting(meeting.roomId);
      } catch (err) {
        console.warn('Failed to delete meeting on Zoom side, deleting from local DB anyway:', err);
      }
    }

    await meeting.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteMeeting:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get upcoming meetings for user's circles or where user is a participant
 * @route   GET /api/meetings/upcoming
 * @access  Private
 */
exports.getUpcomingMeetings = async (req, res) => {
  try {
    const now = new Date(Date.now() - 5 * 60 * 1000);
    const { circleId } = req.query;
    
    let query = { startTime: { $gte: now } };
    
    if (circleId) {
      query.circle = circleId;
    } else {
      // Get all circles the user is a member of
      const userCircles = await Circle.find({ 'members.user': req.user._id }).select('_id');
      const circleIds = userCircles.map(c => c._id);
      
      query.$or = [
        { 'participants.user': req.user._id },
        { circle: { $in: circleIds } }
      ];
    }

    const meetings = await Meeting.find(query)
      .populate('host', 'username displayName profilePic')
      .populate('circle', 'name slug coverImage')
      .sort({ startTime: 1 });

    const currentUserId = req.user._id.toString();

    // Strip startLink from response for non-hosts (security critical)
    const safeMeetings = meetings.map(m => {
      const obj = m.toObject ? m.toObject() : { ...m };
      const hostId = obj.host?._id?.toString() || obj.host?.toString();
      obj.startLink = obj.meetingLink;
      if (hostId !== currentUserId) {
        delete obj.startLink;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      data: safeMeetings
    });
  } catch (error) {
    console.error('Error in getUpcomingMeetings:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get user's meeting history
 * @route   GET /api/meetings/history
 * @access  Private
 */
exports.getMeetingHistory = async (req, res) => {
  try {
    const now = new Date(Date.now() - 5 * 60 * 1000);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {
      $or: [{ host: req.user._id }, { 'participants.user': req.user._id }],
      endTime: { $lt: now }
    };

    const total = await Meeting.countDocuments(query);
    const meetings = await Meeting.find(query)
      .populate('host', 'username displayName profilePic')
      .populate('circle', 'name slug coverImage')
      .sort({ endTime: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: meetings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getMeetingHistory:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get single meeting by ID
 * @route   GET /api/meetings/:id
 * @access  Private
 */
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'username displayName profilePic')
      .populate('circle', 'name slug coverImage')
      .populate('participants.user', 'username displayName profilePic');

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const meetingObj = meeting.toObject();
    const currentUserIdStr = req.user._id.toString();
    const hostIdStr = meetingObj.host?._id?.toString() || meetingObj.host?.toString();

    meetingObj.startLink = meetingObj.meetingLink;
    if (hostIdStr !== currentUserIdStr) {
      delete meetingObj.startLink;
    }

    res.status(200).json({
      success: true,
      data: meetingObj
    });
  } catch (error) {
    console.error('Error in getMeetingById:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Update RSVP status for a meeting
 * @route   PUT /api/meetings/:id/rsvp
 * @access  Private
 */
exports.updateRSVP = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Only support going/not going mapped to accepted/declined right now
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid RSVP status' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const userId = req.user._id;

    // Check if user is already a participant
    const isParticipant = meeting.participants.some(p => p.user.toString() === userId.toString());

    if (isParticipant) {
      await meeting.updateParticipantStatus(userId, status);
    } else {
      await meeting.addParticipant(userId, status);
    }

    // Return the updated meeting populated so UI can update smoothly
    const updatedMeeting = await Meeting.findById(req.params.id)
      .populate('host', 'username displayName profilePic')
      .populate('circle', 'name slug coverImage')
      .populate('participants.user', 'username displayName profilePic');

    res.status(200).json({
      success: true,
      data: updatedMeeting
    });
  } catch (error) {
    console.error('Error in updateRSVP:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get upcoming meetings for a specific circle
 * @route   GET /api/meetings/circle/:circleId
 * @access  Private
 */
exports.getCircleMeetings = async (req, res) => {
  try {
    const { circleId } = req.params;
    const now = new Date(Date.now() - 5 * 60 * 1000);
    const currentUserId = req.user._id.toString();

    const meetings = await Meeting.find({
      circle: circleId,
      startTime: { $gte: now }
    })
      .populate('host', 'username displayName profilePic')
      .populate('participants.user', 'username displayName profilePic')
      .sort({ startTime: 1 })
      .limit(10);

    // Strip startLink from response for non-hosts (security critical)
    const safeMeetings = meetings.map(m => {
      const obj = m.toObject();
      const isHost = obj.host?._id?.toString() === currentUserId || obj.host?.toString() === currentUserId;
      if (!isHost) {
        delete obj.startLink;
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      data: safeMeetings
    });
  } catch (error) {
    console.error('Error in getCircleMeetings:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
