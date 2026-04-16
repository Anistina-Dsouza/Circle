const Circle = require('../models/Circle');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// =========== CREATE CIRCLE ===========
exports.createCircle = async (req, res) => {
  try {
    const { name, description, type, coverImage, category } = req.body;
    
    // Validation
    if (!name || name.length < 3) {
      return res.status(400).json({ 
        error: 'Circle name must be at least 3 characters' 
      });
    }
    
    // Check if circle name exists
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingCircle = await Circle.findOne({ slug });
    
    if (existingCircle) {
      return res.status(400).json({ 
        error: 'Circle with this name already exists' 
      });
    }
    
    // Create circle
    const circle = new Circle({
      name,
      description,
      type: type || 'public',
      category: category || 'Technology',
      coverImage: coverImage || 'default_circle.png',
      creator: req.userId,
      members: [{
        user: req.userId,
        role: 'admin',
        joinedAt: new Date()
      }]
    });
    
    await circle.save();
    
    // Update user's circle count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.circleCount': 1 }
    });
    
    res.status(201).json({
      success: true,
      message: 'Circle created successfully',
      circle
    });
    
  } catch (error) {
    console.error('Create circle error:', error);
    res.status(500).json({ error: error.message });
  }
};

// =========== GET ALL PUBLIC CIRCLES ===========
exports.getPublicCircles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    
    // Force public visibility for this endpoint
    const query = { 
      isActive: true, 
      type: 'public' 
    };
    
    // Add Search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add Category if provided
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    
    // Get circles
    const circles = await Circle.find(query)
      .sort({ 'stats.memberCount': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name slug description coverImage category stats creator createdAt')
      .populate('creator', 'username profile.displayName profile.profileImage');
    
    const total = await Circle.countDocuments(query);
    
    res.json({
      success: true,
      circles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GET USER'S CIRCLES ===========
exports.getMyCircles = async (req, res) => {
  try {
    const circles = await Circle.find({
      'members.user': req.userId,
      isActive: true
    })
    .sort({ updatedAt: -1 })
    .select('name slug description coverImage stats.memberCount')
    .populate('creator', 'username profile.displayName');
    
    res.json({
      success: true,
      circles
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GET CIRCLE BY SLUG ===========
exports.getCircleBySlug = async (req, res) => {
  try {
    const circle = await Circle.findOne({ 
      slug: req.params.slug,
      isActive: true 
    })
    .populate('creator', 'username displayName profilePic')
    .populate('members.user', 'username displayName profilePic onlineStatus')
    .populate('moderators.user', 'username displayName profilePic');
    
    if (!circle) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check if requesting user is member (if authenticated)
    let isMember = false;
    let userRole = null;
    let isModerator = false;
    
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const member = circle.members.find(
          m => m.user._id.toString() === decoded.id
        );
        
        if (member) {
          isMember = true;
          userRole = member.role;
          isModerator = ['admin', 'moderator'].includes(member.role);
        }
      } catch (e) {
        // Token invalid, ignore
      }
    }
    
    res.json({
      success: true,
      circle: {
        ...circle.toObject(),
        isMember,
        userRole,
        isModerator
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== UPDATE CIRCLE ===========
exports.updateCircle = async (req, res) => {
  try {
      console.log("updateCircle - req.body - ",req.body);
    const { description, coverImage, profilePic, settings } = req.body;
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check permissions (only admin or creator)
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && ['admin'].includes(m.role)
    );
    
    if (!isAdmin && circle.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this circle' });
    }
    
    // Update fields
    // if (name) {
    //   // Check if new name is taken
    //   const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    //   const existing = await Circle.findOne({ 
    //     slug, 
    //     _id: { $ne: circle._id } 
    //   });
      
    //   if (existing) {
    //     return res.status(400).json({ error: 'Circle name already taken' });
    //   }
      
    //   circle.name = name;
    // }
    
    if (description !== undefined) circle.description = description;
    if (coverImage) circle.coverImage = coverImage;
    if (profilePic) circle.profilePic = profilePic;
    if (settings) circle.settings = { ...circle.settings, ...settings };
    
    await circle.save();
    
    res.json({
      success: true,
      message: 'Circle updated successfully',
      circle
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== DELETE CIRCLE (SOFT DELETE) ===========
exports.deleteCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Only creator can delete
    if (circle.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can delete circle' });
    }
    
    // Soft delete
    circle.isActive = false;
    await circle.save();
    
    // Update all members' circle count
    await User.updateMany(
      { _id: { $in: circle.members.map(m => m.user) } },
      { $inc: { 'stats.circleCount': -1 } }
    );
    
    res.json({
      success: true,
      message: 'Circle deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== JOIN CIRCLE ===========
exports.joinCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check if already member
    if (circle.isMember(req.userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }
    
    // Direct joining via this endpoint now strictly requires an invite code for BOTH public and private
    // Otherwise, users must use the request system (/request-join)
    const { inviteCode } = req.body;
    
    if (!inviteCode || inviteCode !== circle.inviteCode) {
      const errorMsg = circle.type === 'public' 
        ? 'This community requires a join request. Please use the request system.' 
        : 'Valid invite link required for this private community.';
        
      return res.status(403).json({ error: errorMsg });
    }
    
    // Add member
    await circle.addMember(req.userId, 'member');
    
    // Update user's circle count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.circleCount': 1 }
    });
    
    res.json({
      success: true,
      message: 'Joined circle successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== LEAVE CIRCLE ===========
exports.leaveCircle = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Creator cannot leave (must delete or transfer ownership)
    if (circle.creator.toString() === req.userId) {
      return res.status(400).json({ 
        error: 'Creator cannot leave. Delete circle or transfer ownership instead.' 
      });
    }
    
    // Check if member
    if (!circle.isMember(req.userId)) {
      return res.status(400).json({ error: 'Not a member' });
    }
    
    // Remove member
    await circle.removeMember(req.userId);
    
    // Update user's circle count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.circleCount': -1 }
    });
    
    res.json({
      success: true,
      message: 'Left circle successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GET CIRCLE MEMBERS ===========
exports.getCircleMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const circle = await Circle.findById(req.params.circleId)
      .select('members')
      .populate({
        path: 'members.user',
        select: 'username displayName profilePic stats.followerCount onlineStatus'
      });
    
    if (!circle) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Sort members: admins first, then moderators, then members
    const sortedMembers = [...circle.members].sort((a, b) => {
      const roleWeight = { admin: 3, moderator: 2, member: 1 };
      return roleWeight[b.role] - roleWeight[a.role];
    });
    
    const paginatedMembers = sortedMembers.slice(skip, skip + limit);
    
    res.json({
      success: true,
      members: paginatedMembers,
      total: circle.members.length,
      page,
      pages: Math.ceil(circle.members.length / limit)
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== ADD MODERATOR ===========
exports.addModerator = async (req, res) => {
  try {
    const { userId, role = 'moderator' } = req.body;
    
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check permissions (only admin can add moderators)
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && m.role === 'admin'
    );
    
    if (!isAdmin && circle.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Check if user is member
    if (!circle.isMember(userId)) {
      return res.status(400).json({ error: 'User is not a member' });
    }
    
    // Update member role
    const member = circle.members.find(m => m.user.toString() === userId);
    if (member) {
      member.role = role;
    }
    
    // Add to moderators list
    await circle.addModerator(userId, role === 'admin' ? 'admin' : 'moderator', req.userId);
    
    await circle.save();
    
    res.json({
      success: true,
      message: 'Moderator added successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== REMOVE MODERATOR ===========
exports.removeModerator = async (req, res) => {
  try {
    const { circleId, userId } = req.params;
    
    const circle = await Circle.findById(circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check permissions (only admin)
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && m.role === 'admin'
    );
    
    if (!isAdmin && circle.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Cannot remove creator
    if (circle.creator.toString() === userId) {
      return res.status(400).json({ error: 'Cannot remove creator' });
    }
    
    // Update member role back to member
    const member = circle.members.find(m => m.user.toString() === userId);
    if (member) {
      member.role = 'member';
    }
    
    // Remove from moderators list
    circle.moderators = circle.moderators.filter(m => m.user.toString() !== userId);
    
    await circle.save();
    
    res.json({
      success: true,
      message: 'Moderator removed successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== GENERATE INVITE CODE ===========
exports.generateInviteCode = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check permissions (admin or moderator)
    const isAdminOrMod = circle.members.some(
      m => m.user.toString() === req.userId && ['admin', 'moderator'].includes(m.role)
    );
    
    if (!isAdminOrMod && circle.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Generate new invite code
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    const nameHash = circle.name.substring(0, 3).toUpperCase();
    circle.inviteCode = `${nameHash}-${timestamp}-${random}`.toUpperCase();
    
    await circle.save();
    
    res.json({
      success: true,
      inviteCode: circle.inviteCode,
      inviteLink: `/join/${circle.inviteCode}`
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== JOIN WITH INVITE CODE ===========
exports.joinWithInvite = async (req, res) => {
  try {
    const circle = await Circle.findOne({ 
      inviteCode: req.params.inviteCode,
      isActive: true 
    });
    
    if (!circle) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }
    
    // Check if already member
    if (circle.isMember(req.userId)) {
      return res.status(400).json({ error: 'Already a member' });
    }
    
    // Add member
    await circle.addMember(req.userId, 'member');
    
    // Update user's circle count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.circleCount': 1 }
    });
    
    res.json({
      success: true,
      message: 'Joined circle successfully',
      circle: {
        _id: circle._id,
        name: circle.name,
        slug: circle.slug
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== TRANSFER OWNERSHIP ===========
exports.transferOwnership = async (req, res) => {
  try {
    const { newOwnerId } = req.body;
    const circle = await Circle.findById(req.params.circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Only creator can transfer
    if (circle.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can transfer ownership' });
    }
    
    // Check if new owner is a member
    if (!circle.isMember(newOwnerId)) {
      return res.status(400).json({ error: 'New owner must be a member' });
    }
    
    // Update roles
    const currentCreator = circle.members.find(m => m.user.toString() === req.userId);
    const newOwner = circle.members.find(m => m.user.toString() === newOwnerId);
    
    if (currentCreator) currentCreator.role = 'admin';
    if (newOwner) newOwner.role = 'admin';
    
    // Update creator
    circle.creator = newOwnerId;
    
    // Add to moderators
    await circle.addModerator(newOwnerId, 'admin', req.userId);
    
    await circle.save();
    
    res.json({
      success: true,
      message: 'Ownership transferred successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========== REQUEST TO JOIN PRIVATE CIRCLE ===========
exports.requestToJoin = async (req, res) => {
  try {
    const { introduction } = req.body;
    const { circleId } = req.params;
    
    // Validate introduction
    if (!introduction || introduction.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Please provide a brief introduction (minimum 10 characters)' 
      });
    }
    
    const circle = await Circle.findById(circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check type: Now Public circles REQUIRE requests, while Private bypass via link
    // However, we still allow requests for Private if they don't have a link?
    // User said: "for private circles bypass join request" 
    // This could mean they DON'T want a request system for private at all.
    // I'll allow requests for both if they reach here, but primary flow for private is link.
    // If it's a private circle and they are here, it's fine to let them request if they found it.
    
    // Check if already member
    if (circle.isMember(req.userId)) {
      return res.status(400).json({ error: 'You are already a member of this circle' });
    }
    
    // Check if already has pending request
    const existingRequest = circle.pendingRequests.find(
      r => r.user.toString() === req.userId && r.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({ 
        error: 'You already have a pending request for this circle' 
      });
    }
    
    // Check if previously rejected (optional: add cooldown)
    const rejectedRequest = circle.pendingRequests.find(
      r => r.user.toString() === req.userId && r.status === 'rejected'
    );
    
    if (rejectedRequest) {
      const rejectedAt = new Date(rejectedRequest.reviewedAt);
      const now = new Date();
      const daysSinceRejection = (now - rejectedAt) / (1000 * 60 * 60 * 24);
      
      if (daysSinceRejection < 7) {
        return res.status(400).json({ 
          error: `You were rejected ${Math.floor(daysSinceRejection)} days ago. Please wait ${7 - Math.floor(daysSinceRejection)} more days before requesting again.` 
        });
      }
    }
    
    // Add pending request
    circle.pendingRequests.push({
      user: req.userId,
      introduction: introduction.trim(),
      requestedAt: new Date(),
      status: 'pending'
    });
    
    await circle.save();
    
    // Get admin/creator info for notification (optional)
    const adminUser = await User.findById(circle.creator).select('username');
    
    res.json({
      success: true,
      message: `Join request sent to ${adminUser?.username || 'admin'} successfully. You will be notified once approved.`,
      requestId: circle.pendingRequests[circle.pendingRequests.length - 1]._id
    });
    
  } catch (error) {
    console.error('Request to join error:', error);
    res.status(500).json({ error: error.message });
  }
};

// =========== GET PENDING REQUESTS (ADMIN ONLY) ===========
exports.getPendingRequests = async (req, res) => {
  try {
    const { circleId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const circle = await Circle.findById(circleId)
      .populate({
        path: 'pendingRequests.user',
        select: 'username profile.displayName profile.profileImage stats.followerCount createdAt'
      })
      .populate('pendingRequests.reviewedBy', 'username');
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check if user is admin or creator
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && ['admin'].includes(m.role)
    );
    
    const isCreator = circle.creator.toString() === req.userId;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ error: 'Only admins can view pending requests' });
    }
    
    // Get only pending requests
    const pendingRequests = circle.pendingRequests.filter(
      r => r.status === 'pending'
    );
    
    // Calculate stats
    const total = pendingRequests.length;
    const paginatedRequests = pendingRequests.slice(skip, skip + limit);
    
    res.json({
      success: true,
      pendingRequests: paginatedRequests,
      stats: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: error.message });
  }
};

// =========== GET ALL REQUESTS (WITH FILTERS) ===========
exports.getAllRequests = async (req, res) => {
  try {
    const { circleId } = req.params;
    const status = req.query.status || 'all'; // pending, approved, rejected, all
    
    const circle = await Circle.findById(circleId)
      .populate({
        path: 'pendingRequests.user',
        select: 'username profile.displayName profile.profileImage'
      })
      .populate('pendingRequests.reviewedBy', 'username');
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check if user is admin or creator
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && ['admin'].includes(m.role)
    );
    
    const isCreator = circle.creator.toString() === req.userId;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ error: 'Only admins can view requests' });
    }
    
    // Filter by status
    let filteredRequests = circle.pendingRequests;
    if (status !== 'all') {
      filteredRequests = circle.pendingRequests.filter(r => r.status === status);
    }
    
    // Sort by requestedAt (newest first)
    filteredRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    
    res.json({
      success: true,
      requests: filteredRequests,
      counts: {
        pending: circle.pendingRequests.filter(r => r.status === 'pending').length,
        approved: circle.pendingRequests.filter(r => r.status === 'approved').length,
        rejected: circle.pendingRequests.filter(r => r.status === 'rejected').length,
        total: circle.pendingRequests.length
      }
    });
    
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ error: error.message });
  }
};

// =========== APPROVE JOIN REQUEST ===========
exports.approveJoinRequest = async (req, res) => {
  try {
    const { circleId, requestId } = req.params;
    
    const circle = await Circle.findById(circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check if user is admin or creator
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && ['admin'].includes(m.role)
    );
    
    const isCreator = circle.creator.toString() === req.userId;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ error: 'Only admins can approve requests' });
    }
    
    // Find the request
    const requestIndex = circle.pendingRequests.findIndex(
      r => r._id.toString() === requestId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const request = circle.pendingRequests[requestIndex];
    
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        error: `This request has already been ${request.status}` 
      });
    }
    
    // Update request status
    request.status = 'approved';
    request.reviewedAt = new Date();
    request.reviewedBy = req.userId;
    
    // Add user as member
    const userId = request.user;
    
    // Check if already member (safety check)
    const isAlreadyMember = circle.members.some(
      m => m.user.toString() === userId.toString()
    );
    
    if (!isAlreadyMember) {
      circle.members.push({
        user: userId,
        role: 'member',
        joinedAt: new Date(),
        invitedBy: req.userId
      });
      circle.stats.memberCount = circle.members.length;
      
      // Update user's circle count
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.circleCount': 1 }
      });
    }
    
    await circle.save();
    
    // Get user info for response
    const userInfo = await User.findById(userId).select('username profile.displayName');
    
    res.json({
      success: true,
      message: `Successfully approved ${userInfo?.username || 'user'}'s request to join ${circle.name}`,
      user: userInfo
    });
    
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// =========== REJECT JOIN REQUEST ===========
exports.rejectJoinRequest = async (req, res) => {
  try {
    const { circleId, requestId } = req.params;
    const { rejectionReason } = req.body;
    
    const circle = await Circle.findById(circleId);
    
    if (!circle || !circle.isActive) {
      return res.status(404).json({ error: 'Circle not found' });
    }
    
    // Check if user is admin or creator
    const isAdmin = circle.members.some(
      m => m.user.toString() === req.userId && ['admin'].includes(m.role)
    );
    
    const isCreator = circle.creator.toString() === req.userId;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ error: 'Only admins can reject requests' });
    }
    
    // Find the request
    const requestIndex = circle.pendingRequests.findIndex(
      r => r._id.toString() === requestId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const request = circle.pendingRequests[requestIndex];
    
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        error: `This request has already been ${request.status}` 
      });
    }
    
    // Update request status
    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.reviewedBy = req.userId;
    request.rejectionReason = rejectionReason || 'No reason provided';
    
    await circle.save();
    
    // Get user info for response
    const userInfo = await User.findById(request.user).select('username profile.displayName');
    
    res.json({
      success: true,
      message: `Rejected ${userInfo?.username || 'user'}'s request to join ${circle.name}`,
      rejectionReason: request.rejectionReason
    });
    
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ error: error.message });
  }
};