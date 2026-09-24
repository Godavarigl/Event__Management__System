const express = require('express');
const { getBusinessReports } = require('../controllers/businessController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Get business reports - Business Management only (read-only)
router.get('/reports', authenticateToken, authorizeRoles('Business Management'), getBusinessReports);

module.exports = router;
