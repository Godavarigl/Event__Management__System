const Registration = require('../models/Registration');
const Event = require('../models/Event');

const registerForEvent = async (req, res) => {
  try {
    const { event: eventId } = req.body;

    // Validate event ID is provided
    if (!eventId) {
      return res.status(400).json({
        message: 'Event ID is required'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    // Check if user is already registered for this event
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(409).json({
        message: 'You are already registered for this event'
      });
    }

    // Check if event has capacity and is full
    if (event.capacity !== null && event.capacity > 0) {
      const registeredCount = await Registration.countDocuments({
        event: eventId,
        status: 'Registered'
      });

      if (registeredCount >= event.capacity) {
        // Event is full, add to waitlist
        const registration = new Registration({
          user: req.user.id,
          event: eventId,
          status: 'Waitlisted'
        });

        await registration.save();

        return res.status(201).json({
          message: 'Event is full. You have been added to the waitlist.',
          registration
        });
      }
    }

    // Create new registration
    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      status: 'Registered'
    });

    // Save registration to database
    await registration.save();

    // Return success response
    res.status(201).json({
      message: 'Event registration successful',
      registration
    });
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid event ID'
      });
    }

    console.error('Event registration error:', error);
    res.status(500).json({
      message: 'Server error during event registration'
    });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    // Find all registrations for the authenticated user
    const registrations = await Registration.find({ user: req.user.id })
      .populate('user', 'name email')
      .populate('event', 'title description date location category status');

    // Return success response
    res.status(200).json({
      message: 'My registrations fetched successfully',
      registrations
    });
  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({
      message: 'Server error while fetching registrations'
    });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Find registration by ID and user (ensure user can only cancel their own registration)
    const registration = await Registration.findOne({
      _id: id,
      user: req.user.id
    });

    // Check if registration exists
    if (!registration) {
      return res.status(404).json({
        message: 'Registration not found'
      });
    }

    // Check if registration is already cancelled
    if (registration.status === 'Cancelled') {
      return res.status(409).json({
        message: 'Registration is already cancelled'
      });
    }

    // Update registration status to Cancelled
    registration.status = 'Cancelled';
    await registration.save();

    // Return success response
    res.status(200).json({
      message: 'Event registration cancelled successfully',
      registration
    });
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid registration ID'
      });
    }

    console.error('Cancel registration error:', error);
    res.status(500).json({
      message: 'Server error while cancelling registration'
    });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
};
