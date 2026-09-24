import { useState, useEffect } from 'react'
import './AdministratorDashboard.css'

function AdministratorDashboard() {
  // State for user info
  const [user, setUser] = useState(null)

  // State for system statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    systemActivity: 0
  })

  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch system data on component mount
  useEffect(() => {
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

    // Fetch events data for system overview
    const fetchSystemData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (response.ok) {
          setStats({
            totalEvents: data.events?.length || 0,
            totalUsers: 0, // Not available from current API
            totalRegistrations: 0, // Not available from current API
            systemActivity: data.events?.length || 0
          })
        }
      } catch (err) {
        console.error('Fetch system data error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSystemData()
  }, [])

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-header-content">
          <div className="admin-dashboard-title-section">
            <h1 className="admin-dashboard-title">ADMINISTRATOR DASHBOARD</h1>
            {user && (
              <div className="admin-dashboard-user-info">
                <p className="admin-dashboard-welcome">
                  Welcome, {user.name}
                </p>
                <span className="admin-dashboard-role-badge">
                  {user.role}
                </span>
              </div>
            )}
          </div>
          <p className="admin-dashboard-subtitle">System overview and administrative controls</p>
        </div>
      </div>

      {/* Loading message */}
      {loading && (
        <div className="admin-message admin-loading">
          Loading system data...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="admin-message admin-error">
          {error}
        </div>
      )}

      {/* System Overview Cards */}
      {!loading && !error && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card admin-stat-events">
              <span className="admin-stat-icon">📅</span>
              <h3 className="admin-stat-number">{stats.totalEvents}</h3>
              <p className="admin-stat-label">Total Events</p>
            </div>
            <div className="admin-stat-card admin-stat-users">
              <span className="admin-stat-icon">👥</span>
              <h3 className="admin-stat-number">N/A</h3>
              <p className="admin-stat-label">Total Users</p>
              <p className="admin-stat-note">API endpoint not available</p>
            </div>
            <div className="admin-stat-card admin-stat-registrations">
              <span className="admin-stat-icon">✅</span>
              <h3 className="admin-stat-number">N/A</h3>
              <p className="admin-stat-label">Total Registrations</p>
              <p className="admin-stat-note">Use Business Reports</p>
            </div>
            <div className="admin-stat-card admin-stat-activity">
              <span className="admin-stat-icon">📊</span>
              <h3 className="admin-stat-number">{stats.systemActivity}</h3>
              <p className="admin-stat-label">Active Events</p>
            </div>
          </div>

          {/* Administrative Notice */}
          <div className="admin-notice-section">
            <div className="admin-notice-card">
              <h2 className="admin-notice-title">Administrative Access</h2>
              <p className="admin-notice-description">
                As an Administrator, you have full system access. Event management features 
                are available through the Event Manager dashboard. User management and 
                advanced administrative features can be added as needed.
              </p>
              <div className="admin-notice-features">
                <div className="admin-notice-feature">
                  <span className="admin-notice-icon">🔐</span>
                  <h4>Full System Access</h4>
                  <p>Access all system features and controls</p>
                </div>
                <div className="admin-notice-feature">
                  <span className="admin-notice-icon">📅</span>
                  <h4>Event Management</h4>
                  <p>Create, edit, and delete all events</p>
                </div>
                <div className="admin-notice-feature">
                  <span className="admin-notice-icon">👥</span>
                  <h4>User Oversight</h4>
                  <p>Monitor user activity and registrations</p>
                </div>
                <div className="admin-notice-feature">
                  <span className="admin-notice-icon">🛡</span>
                  <h4>System Security</h4>
                  <p>Maintain system integrity and security</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdministratorDashboard
