const express = require('express');
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getUpcomingEvents } = require('../controllers/eventController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Create event - Event Manager only
router.post('/', authenticateToken, authorizeRoles('Event Manager'), createEvent);

// Get all events
router.get('/', getAllEvents);

// Get upcoming events
router.get('/upcoming', getUpcomingEvents);

// Get event by ID
router.get('/:id', getEventById);

// Update event - Event Manager only
router.put('/:id', authenticateToken, authorizeRoles('Event Manager'), updateEvent);

// Delete event - Event Manager only
router.delete('/:id', authenticateToken, authorizeRoles('Event Manager'), deleteEvent);

module.exports = router;
