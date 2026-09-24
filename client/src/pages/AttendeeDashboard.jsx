import { useState, useEffect } from 'react'
import './AttendeeDashboard.css'

function AttendeeDashboard({ onNavigateToEvents }) {
  // State for registrations data
  const [registrations, setRegistrations] = useState([])

  // State for user info
  const [user, setUser] = useState(null)


  // State for statistics
  const [stats, setStats] = useState({
    upcoming: 0,
    registered: 0,
    waitlisted: 0,
    cancelled: 0
  })

  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State for cancellation
  const [cancelling, setCancelling] = useState(null)
  const [cancelMessage, setCancelMessage] = useState('')

  // Fetch registrations from backend API
  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (!token) {
        setError('Please login to access your dashboard.')
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
        const response = await fetch(
          'http://localhost:5000/api/registrations/my',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (response.ok) {
          setRegistrations(data.registrations || [])
          calculateStats(data.registrations || [])
        } else {
          setError(
            data.message || 'Failed to fetch registrations'
          )
        }
      } catch (err) {
        setError(
          'An error occurred. Please try again later.'
        )
        console.error(
          'Fetch registrations error:',
          err
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  // Calculate statistics
  const calculateStats = (registrationsData) => {
    const stats = {
      upcoming: registrationsData.filter(r => 
        r.status === 'Registered' && 
        r.event?.date && 
        new Date(r.event.date) > new Date()
      ).length,
      registered: registrationsData.filter(r => r.status === 'Registered').length,
      waitlisted: registrationsData.filter(r => r.status === 'Waitlisted').length,
      cancelled: registrationsData.filter(r => r.status === 'Cancelled').length
    }
    setStats(stats)
  }

  // Handle registration cancellation
  const handleCancel = async (registrationId) => {
    setCancelMessage('')

    const token = localStorage.getItem('token')

    if (!token) {
      setCancelMessage(
        'Please login to cancel registrations.'
      )
      return
    }

    setCancelling(registrationId)

    try {
      const response = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setRegistrations(
          registrations.map((reg) =>
            reg._id === registrationId
              ? {
                  ...reg,
                  status: 'Cancelled'
                }
              : reg
          )
        )

        setCancelMessage(
          'Registration cancelled successfully'
        )
      } else {
        setCancelMessage(
          data.message || 'Cancellation failed'
        )
      }

    } catch (err) {
      setCancelMessage(
        'An error occurred during cancellation. Please try again.'
      )

      console.error(
        'Cancellation error:',
        err
      )

    } finally {
      setCancelling(null)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="dashboard-container">

      {/* Dashboard header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">
              ATTENDEE DASHBOARD
            </h1>
            {user && (
              <div className="dashboard-user-info">
                <p className="dashboard-welcome">
                  Welcome, {user.name}
                </p>
                <span className="dashboard-role-badge">
                  {user.role}
                </span>
              </div>
            )}
          </div>
          <p className="dashboard-subtitle">
            View and manage your event registrations
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {!loading && !error && (
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card dashboard-stat-upcoming">
            <span className="dashboard-stat-icon">📅</span>
            <h3 className="dashboard-stat-number">{stats.upcoming}</h3>
            <p className="dashboard-stat-label">Upcoming Events</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-registered">
            <span className="dashboard-stat-icon">✅</span>
            <h3 className="dashboard-stat-number">{stats.registered}</h3>
            <p className="dashboard-stat-label">Registered Events</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-waitlisted">
            <span className="dashboard-stat-icon">⏳</span>
            <h3 className="dashboard-stat-number">{stats.waitlisted}</h3>
            <p className="dashboard-stat-label">Waitlisted Events</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-cancelled">
            <span className="dashboard-stat-icon">❌</span>
            <h3 className="dashboard-stat-number">{stats.cancelled}</h3>
            <p className="dashboard-stat-label">Cancelled Events</p>
          </div>
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div className="dashboard-message dashboard-loading">
          Loading your registrations...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="dashboard-message dashboard-error">
          {error}
        </div>
      )}

      {/* Cancellation message */}
      {cancelMessage && (
        <div className="dashboard-message dashboard-info">
          {cancelMessage}
        </div>
      )}

      {/* Registrations */}
      {!loading && !error && (
        <div className="registrations-grid">

          {registrations.length === 0 ? (

            <div className="dashboard-message dashboard-empty">
              <p>No registrations yet. Start exploring events!</p>
              {onNavigateToEvents && (
                <button
                  className="browse-events-button"
                  onClick={onNavigateToEvents}
                >
                  Browse Events
                </button>
              )}
            </div>

          ) : (

            registrations.map((registration) => (

              <div
                key={registration._id}
                className="registration-card"
              >

                <div className="registration-header">

                  <span
                    className={`registration-status registration-status-${registration.status
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                  >
                    {registration.status}
                  </span>

                  <span className="registration-date">
                    Registered:{' '}
                    {formatDateTime(
                      registration.registeredAt
                    )}
                  </span>

                </div>

                <h2 className="registration-title">
                  {registration.event?.title ||
                    'Event not found'}
                </h2>

                <p className="registration-description">
                  {registration.event?.description ||
                    'No description available'}
                </p>

                <div className="registration-details">

                  <div className="registration-detail">
                    <span className="registration-detail-icon">
                      📅
                    </span>

                    <span>
                      {registration.event?.date
                        ? formatDate(
                            registration.event.date
                          )
                        : 'Date not available'}
                    </span>
                  </div>

                  <div className="registration-detail">
                    <span className="registration-detail-icon">
                      📍
                    </span>

                    <span>
                      {registration.event?.location ||
                        'Location not available'}
                    </span>
                  </div>

                  <div className="registration-detail">
                    <span className="registration-detail-icon">
                      🏷️
                    </span>

                    <span>
                      {registration.event?.category ||
                        'Category not available'}
                    </span>
                  </div>

                </div>

                {/* Cancel button */}
                {registration.status !== 'Cancelled' && (
                  <button
                    className="cancel-button"
                    onClick={() =>
                      handleCancel(
                        registration._id
                      )
                    }
                    disabled={
                      cancelling ===
                      registration._id
                    }
                  >
                    {cancelling ===
                    registration._id
                      ? 'Cancelling...'
                      : 'Cancel Registration'}
                  </button>
                )}

                {/* Cancelled status */}
                {registration.status === 'Cancelled' && (
                  <div className="cancelled-badge">
                    Registration Cancelled
                  </div>
                )}

              </div>

            ))

          )}

        </div>
      )}

      {/* Browse Events Button - always visible */}
      {!loading && !error && onNavigateToEvents && (
        <div className="browse-events-section">
          <button
            className="browse-events-button"
            onClick={onNavigateToEvents}
          >
            Browse Events
          </button>
        </div>
      )}

    </div>
  )
}

export default AttendeeDashboard