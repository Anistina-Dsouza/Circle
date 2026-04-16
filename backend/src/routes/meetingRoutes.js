const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const meetingController = require('../controllers/meetingController');

// All meeting routes require authentication
router.use(auth);

// =========== DASHBOARD ===========
// GET /api/meetings/dashboard - Loads hosted + upcoming + past preview for MeetingsPage
router.get('/dashboard', meetingController.getDashboard);

// =========== SCHEDULE ===========
// GET /api/meetings/eligible-circles - Circles user is admin/mod of
router.get('/eligible-circles', meetingController.getEligibleCircles);

// POST /api/meetings/schedule - Creates a Zoom meeting and saves to DB (ScheduleMeetingPage)
router.post('/schedule', meetingController.scheduleMeeting);

// =========== HOST MANAGEMENT ===========
// GET /api/meetings/my - Host's own meetings list (ManageMeetingsPage)
router.get('/my', meetingController.getMyMeetings);

// DELETE /api/meetings/:id - Host deletes their meeting from DB + Zoom (ManageMeetingsPage)
router.delete('/:id', meetingController.deleteMeeting);

// PUT /api/meetings/:id/start - Host sets meeting to live dynamically (ManageMeetingsPage)
router.put('/:id/start', meetingController.startMeeting);

// =========== BROWSE ===========
// GET /api/meetings/upcoming - All upcoming meetings in user's circles (UpcomingMeetingsPage)
router.get('/upcoming', meetingController.getUpcomingMeetings);

// GET /api/meetings/circle/:circleId - Meetings for a specific circle
router.get('/circle/:circleId', meetingController.getCircleMeetings);

// GET /api/meetings/history - Past meetings with search + pagination (MeetingHistoryPage)
router.get('/history', meetingController.getMeetingHistory);

// GET /api/meetings/:id - Single meeting detail (join redirect)
router.get('/:id', meetingController.getMeetingById);

// PUT /api/meetings/:id/rsvp - Update RSVP status
router.put('/:id/rsvp', meetingController.updateRSVP);

module.exports = router;
