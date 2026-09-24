const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

// Get business management statistics and reports
const getBusinessReports = async (req, res) => {
  try {
    // Get total events
    const totalEvents = await Event.countDocuments();
    
    // Get total registrations
    const totalRegistrations = await Registration.countDocuments({ status: 'Registered' });
    
    // Get total unique attendees (users with registrations)
    const uniqueAttendees = await Registration.distinct('user', { status: 'Registered' });
    const totalAttendees = uniqueAttendees.length;
    
    // Get event status breakdown
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'Ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'Completed' });
    const cancelledEvents = await Event.countDocuments({ status: 'Cancelled' });
    
    // Get attendance statistics
    const presentAttendance = await Attendance.countDocuments({ status: 'Present' });
    const absentAttendance = await Attendance.countDocuments({ status: 'Absent' });
    const totalAttendance = presentAttendance + absentAttendance;
    
    // Get registrations per event
    const events = await Event.find()
      .select('title _id')
      .sort({ createdAt: -1 })
      .limit(20);
    
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          event: event._id,
          status: 'Registered'
        });
        
        const attendanceCount = await Attendance.countDocuments({
          event: event._id,
          status: 'Present'
        });
        
        return {
          _id: event._id,
          title: event.title,
          registrations: registrationCount,
          attendance: attendanceCount
        };
      })
    );
    
    // Get recent registrations
    const recentRegistrations = await Registration.find({ status: 'Registered' })
      .populate('user', 'name email')
      .populate('event', 'title date')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      message: 'Business reports fetched successfully',
      statistics: {
        totalEvents,
        totalRegistrations,
        totalAttendees,
        upcomingEvents,
        ongoingEvents,
        completedEvents,
        cancelledEvents,
        presentAttendance,
        absentAttendance,
        totalAttendance
      },
      events: eventsWithStats,
      recentRegistrations
    });
  } catch (error) {
    console.error('Get business reports error:', error);
    res.status(500).json({
      message: 'Server error while fetching business reports'
    });
  }
};

module.exports = {
  getBusinessReports
};
