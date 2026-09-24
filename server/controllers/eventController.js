const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, capacity } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({
        message: 'All event fields are required'
      });
    }

    // Create new event
    const event = new Event({
      title: title.trim(),
      description: description.trim(),
      date,
      location: location.trim(),
      category: category.trim(),
      createdBy: req.user.id,
      capacity: capacity ? parseInt(capacity) : null
    });

    // Save event to database
    await event.save();

    // Return success response
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      message: 'Server error while creating event'
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    // Retrieve all events and populate createdBy field
    const events = await Event.find().populate('createdBy', 'name email role');

    // Return success response
    res.status(200).json({
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      message: 'Server error while fetching events'
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event by ID and populate createdBy field
    const event = await Event.findById(id).populate('createdBy', 'name email role');

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Return success response
    res.status(200).json({
      event
    });
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid event ID'
      });
    }

    console.error('Get event by ID error:', error);
    res.status(500).json({
      message: 'Server error while fetching event'
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, category, status, capacity } = req.body;

    // Find event by ID
    const event = await Event.findById(id);

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Update fields if provided
    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (date) event.date = date;
    if (location) event.location = location.trim();
    if (category) event.category = category.trim();
    if (status) event.status = status;
    if (capacity !== undefined) event.capacity = capacity ? parseInt(capacity) : null;

    // Save updated event
    await event.save();

    // Return success response
    res.status(200).json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid event ID'
      });
    }

    console.error('Update event error:', error);
    res.status(500).json({
      message: 'Server error while updating event'
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event by ID
    const event = await Event.findById(id);

    // Check if event exists
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(id);

    // Return success response
    res.status(200).json({
      message: 'Event deleted successfully',
      event
    });
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid event ID'
      });
    }

    console.error('Delete event error:', error);
    res.status(500).json({
      message: 'Server error while deleting event'
    });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    // Find all upcoming events and sort by date ascending
    const events = await Event.find({ status: 'Upcoming' })
      .sort({ date: 1 })
      .populate('createdBy', 'name email role');

    // Return success response
    res.status(200).json({
      message: 'Upcoming events fetched successfully',
      events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      message: 'Server error while fetching upcoming events'
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
};
