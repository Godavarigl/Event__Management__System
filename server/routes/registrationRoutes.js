const express = require('express');
const { registerForEvent, getMyRegistrations, cancelRegistration } = require('../controllers/registrationController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Register for an event - authenticated users only
router.post('/', authenticateToken, registerForEvent);

// Get my registrations - authenticated users only
router.get('/my', authenticateToken, getMyRegistrations);

// Cancel registration - authenticated users only
router.patch('/:id/cancel', authenticateToken, cancelRegistration);

module.exports = router;
