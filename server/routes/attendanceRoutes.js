const express = require('express');
const { getEventAttendees, markAttendance } = require('../controllers/attendanceController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Get attendees for an event - Event Manager only
router.get('/event/:eventId', authenticateToken, authorizeRoles('Event Manager'), getEventAttendees);

// Mark attendance for a registration - Event Manager only
router.post('/registration/:registrationId', authenticateToken, authorizeRoles('Event Manager'), markAttendance);

module.exports = router;
