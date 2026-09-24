const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');

// Get attendees for an event
const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find all registrations for this event
    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email')
      .populate('event', 'title date location');

    if (!registrations || registrations.length === 0) {
      return res.status(200).json({
        message: 'No registrations found for this event',
        attendees: []
      });
    }

    // Get attendance records for these registrations
    const registrationIds = registrations.map(reg => reg._id);
    const attendanceRecords = await Attendance.find({
      registration: { $in: registrationIds }
    }).populate('markedBy', 'name');

    // Merge registration data with attendance data
    const attendees = registrations.map(registration => {
      const attendance = attendanceRecords.find(
        att => att.registration.toString() === registration._id.toString()
      );
      
      return {
        registration: registration,
        attendance: attendance || null,
        attendanceStatus: attendance ? attendance.status : 'Not Marked'
      };
    });

    res.status(200).json({
      message: 'Attendees fetched successfully',
      attendees
    });
  } catch (error) {
    console.error('Get event attendees error:', error);
    res.status(500).json({
      message: 'Server error while fetching attendees'
    });
  }
};

// Mark attendance for a registration
const markAttendance = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Must be Present or Absent'
      });
    }

    // Find the registration
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        message: 'Registration not found'
      });
    }

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      registration: registrationId
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.markedBy = req.user.id;
      existingAttendance.markedAt = Date.now();
      await existingAttendance.save();

      return res.status(200).json({
        message: 'Attendance updated successfully',
        attendance: existingAttendance
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      user: registration.user,
      event: registration.event,
      registration: registrationId,
      status: status,
      markedBy: req.user.id
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      message: 'Server error while marking attendance'
    });
  }
};

module.exports = {
  getEventAttendees,
  markAttendance
};
