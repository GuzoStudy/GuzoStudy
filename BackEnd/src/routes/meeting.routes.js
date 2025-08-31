const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const meetingCtrl = require('../controllers/meeting.controller');

router.post('/courses/:courseId/meetings', auth, role(['teacher','admin']), meetingCtrl.createMeeting);
router.get('/courses/:courseId/meetings', auth, meetingCtrl.getMeetings);


// Teacher/Admin
//router.post('/courses/:courseId/meetings', auth, role(['teacher','admin']), meetingCtrl.createMeeting);
//router.patch('/meetings/:meetingId', auth, role(['teacher','admin']), meetingCtrl.updateMeeting);
//router.post('/meetings/:meetingId/start', auth, role(['teacher','admin']), meetingCtrl.startMeeting);
//router.post('/meetings/:meetingId/end',   auth, role(['teacher','admin']), meetingCtrl.endMeeting);

// List meetings for a course (any authenticated user;
// non-enrolled students will still see schedule but won’t get join info)
//router.get('/courses/:courseId/meetings', auth, meetingCtrl.listMeetings);

// Get join payload for Jitsi (requires auth + enrolled OR allowGuests)
//router.get('/meetings/:meetingId/join', auth, meetingCtrl.joinInfo);

module.exports = router;
