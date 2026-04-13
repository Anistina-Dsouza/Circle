const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const meetingController = require('../controllers/meetingController');

// All meeting routes require authentication
router.use(protect);

// =========== DASHBOARD ===========
// GET /api/meetings/dashboard - Loads hosted + upcoming + past preview for MeetingsPage
router.get('/dashboard', meetingController.getDashboard);

// =========== SCHEDULE ===========
// POST /api/meetings/schedule - Creates a Zoom meeting and saves to DB (ScheduleMeetingPage)
router.post('/schedule', meetingController.scheduleMeeting);

// =========== HOST MANAGEMENT ===========
// GET /api/meetings/my - Host's own meetings list (ManageMeetingsPage)
router.get('/my', meetingController.getMyMeetings);

// DELETE /api/meetings/:id - Host deletes their meeting from DB + Zoom (ManageMeetingsPage)
router.delete('/:id', meetingController.deleteMeeting);

// =========== BROWSE ===========
// GET /api/meetings/upcoming - All upcoming meetings in user's circles (UpcomingMeetingsPage)
router.get('/upcoming', meetingController.getUpcomingMeetings);

// GET /api/meetings/history - Past meetings with search + pagination (MeetingHistoryPage)
router.get('/history', meetingController.getMeetingHistory);

// GET /api/meetings/:id - Single meeting detail (join redirect)
router.get('/:id', meetingController.getMeetingById);

module.exports = router;
