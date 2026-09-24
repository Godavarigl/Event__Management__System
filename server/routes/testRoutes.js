const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Protected test endpoint
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

// Event Manager only test endpoint
router.get('/event-manager', authenticateToken, authorizeRoles('Event Manager'), (req, res) => {
  res.status(200).json({
    message: 'Event Manager access granted',
    user: req.user
  });
});

module.exports = router;
