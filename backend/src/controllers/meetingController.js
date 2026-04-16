const Meeting = require('../models/Meeting');
const Circle = require('../models/Circle');
const zoomService = require('../services/zoomService');

/**
 * @desc    Get meeting dashboard preview (hosted, upcoming, past)
 * @route   GET /api/meetings/dashboard
 * @access  Private
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const hosted = await Meeting.find({ host: userId, startTime: { $gte: now } })
      .sort({ startTime: 1 })
      .limit(3);

    const userCircles = await Circle.find({ 'members.user': userId }).select('_id');
    const circleIds = userCircles.map(c => c._id);

    const upcoming = await Meeting.find({ 
      startTime: { $gte: now },
      host: { $ne: userId }, // exclude those already in hosted
      $or: [
        { 'participants.user': userId },
        { circle: { $in: circleIds } }
      ]
    })
      .populate('host', 'username profile.displayName profile.profileImage')
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
      .populate('host', 'username profile.displayName profile.profileImage')
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

    res.status(200).json({
      success: true,
      data: {
        hosted,
        upcoming,
        past,
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
    const meetings = await Meeting.find({ host: req.user._id })
      .populate('circle', 'name slug coverImage')
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Error in getMyMeetings:', error);
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
    const now = new Date();
    
    // Get all circles the user is a member of
    const userCircles = await Circle.find({ 'members.user': req.user._id }).select('_id');
    const circleIds = userCircles.map(c => c._id);

    const meetings = await Meeting.find({
      startTime: { $gte: now },
      $or: [
        { 'participants.user': req.user._id },
        { circle: { $in: circleIds } }
      ]
    })
      .populate('host', 'username profile.displayName profile.profileImage')
      .populate('circle', 'name slug coverImage')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: meetings
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
    const now = new Date();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {
      $or: [{ host: req.user._id }, { 'participants.user': req.user._id }],
      endTime: { $lt: now }
    };

    const total = await Meeting.countDocuments(query);
    const meetings = await Meeting.find(query)
      .populate('host', 'username profile.displayName profile.profileImage')
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
      .populate('host', 'username profile.displayName profile.profileImage')
      .populate('circle', 'name slug coverImage')
      .populate('participants.user', 'username profile.displayName profile.profileImage');

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error in getMeetingById:', error);
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
    const now = new Date();

    const meetings = await Meeting.find({
      circle: circleId,
      startTime: { $gte: now }
    })
      .populate('host', 'username displayName profilePic')
      .sort({ startTime: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Error in getCircleMeetings:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
