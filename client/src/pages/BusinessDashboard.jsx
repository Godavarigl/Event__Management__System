import { useState, useEffect } from 'react'
import './BusinessDashboard.css'

function BusinessDashboard() {
  // State for user info
  const [user, setUser] = useState(null)

  // State for reports data
  const [reports, setReports] = useState(null)
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch reports from backend API on component mount
  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (!token) {
        setError('Please login to access the dashboard.')
        setLoading(false)
        return
      }

      // Parse user info
      if (userStr) {
        try {
          setUser(JSON.parse(userStr))
        } catch (error) {
          console.error('Error parsing user:', error)
        }
      }
      
      try {
        const response = await fetch('https://event-management-system-fmy4.onrender.com/api/business/reports', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setReports(data)
        } else {
          setError(data.message || 'Failed to fetch reports')
        }
      } catch (err) {
        setError('An error occurred. Please try again later.')
        console.error('Fetch reports error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bm-dashboard-container">
      <div className="bm-dashboard-header">
        <div className="bm-dashboard-header-content">
          <div className="bm-dashboard-title-section">
            <h1 className="bm-dashboard-title">BUSINESS MANAGEMENT DASHBOARD</h1>
            {user && (
              <div className="bm-dashboard-user-info">
                <p className="bm-dashboard-welcome">
                  Welcome, {user.name}
                </p>
                <span className="bm-dashboard-role-badge">
                  {user.role}
                </span>
              </div>
            )}
          </div>
          <p className="bm-dashboard-subtitle">Analytics and reports for event management</p>
        </div>
      </div>

      {/* Loading message */}
      {loading && (
        <div className="bm-message bm-loading">
          Loading reports...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bm-message bm-error">
          {error}
        </div>
      )}

      {/* Reports Content */}
      {!loading && !error && reports && (
        <>
          {/* Overview Statistics */}
          <div className="bm-section">
            <h2 className="bm-section-title">Overview Statistics</h2>
            <div className="bm-stats-grid">
              <div className="bm-stat-card">
                <h3 className="bm-stat-number">{reports.statistics.totalEvents}</h3>
                <p className="bm-stat-label">Total Events</p>
              </div>
              <div className="bm-stat-card">
                <h3 className="bm-stat-number">{reports.statistics.totalRegistrations}</h3>
                <p className="bm-stat-label">Total Registrations</p>
              </div>
              <div className="bm-stat-card">
                <h3 className="bm-stat-number">{reports.statistics.totalAttendees}</h3>
                <p className="bm-stat-label">Unique Attendees</p>
              </div>
              <div className="bm-stat-card">
                <h3 className="bm-stat-number">{reports.statistics.totalAttendance}</h3>
                <p className="bm-stat-label">Attendance Marked</p>
              </div>
            </div>
          </div>

          {/* Event Status Breakdown */}
          <div className="bm-section">
            <h2 className="bm-section-title">Event Status Breakdown</h2>
            <div className="bm-stats-grid">
              <div className="bm-stat-card bm-stat-upcoming">
                <h3 className="bm-stat-number">{reports.statistics.upcomingEvents}</h3>
                <p className="bm-stat-label">Upcoming</p>
              </div>
              <div className="bm-stat-card bm-stat-ongoing">
                <h3 className="bm-stat-number">{reports.statistics.ongoingEvents}</h3>
                <p className="bm-stat-label">Ongoing</p>
              </div>
              <div className="bm-stat-card bm-stat-completed">
                <h3 className="bm-stat-number">{reports.statistics.completedEvents}</h3>
                <p className="bm-stat-label">Completed</p>
              </div>
              <div className="bm-stat-card bm-stat-cancelled">
                <h3 className="bm-stat-number">{reports.statistics.cancelledEvents}</h3>
                <p className="bm-stat-label">Cancelled</p>
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="bm-section">
            <h2 className="bm-section-title">Attendance Statistics</h2>
            <div className="bm-stats-grid">
              <div className="bm-stat-card bm-stat-present">
                <h3 className="bm-stat-number">{reports.statistics.presentAttendance}</h3>
                <p className="bm-stat-label">Present</p>
              </div>
              <div className="bm-stat-card bm-stat-absent">
                <h3 className="bm-stat-number">{reports.statistics.absentAttendance}</h3>
                <p className="bm-stat-label">Absent</p>
              </div>
            </div>
          </div>

          {/* Events with Registrations and Attendance */}
          <div className="bm-section">
            <h2 className="bm-section-title">Events Performance</h2>
            <div className="bm-table-container">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Registrations</th>
                    <th>Attendance</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.events && reports.events.length > 0 ? (
                    reports.events.map((event) => {
                      const attendanceRate = event.registrations > 0
                        ? Math.round((event.attendance / event.registrations) * 100)
                        : 0
                      return (
                        <tr key={event._id}>
                          <td>{event.title}</td>
                          <td>{event.registrations}</td>
                          <td>{event.attendance}</td>
                          <td>{attendanceRate}%</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="bm-table-empty">No events data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bm-section">
            <h2 className="bm-section-title">Recent Registrations</h2>
            <div className="bm-table-container">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Event</th>
                    <th>Event Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.recentRegistrations && reports.recentRegistrations.length > 0 ? (
                    reports.recentRegistrations.map((reg) => (
                      <tr key={reg._id}>
                        <td>{reg.user?.name || 'Unknown'}</td>
                        <td>{reg.user?.email || 'Unknown'}</td>
                        <td>{reg.event?.title || 'Unknown'}</td>
                        <td>{formatDate(reg.event?.date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="bm-table-empty">No recent registrations</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BusinessDashboard
