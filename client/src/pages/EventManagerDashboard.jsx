import { useState, useEffect } from 'react'
import './EventManagerDashboard.css'

function EventManagerDashboard() {
  // State for user info
  const [user, setUser] = useState(null)

  // State for events data
  const [events, setEvents] = useState([])
  
  // State for statistics
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0
  })
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State for create event form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    status: 'Upcoming',
    capacity: ''
  })
  
  // State for form submission
  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  
  // State for edit mode
  const [editingEvent, setEditingEvent] = useState(null)
  
  // State for delete confirmation
  const [deletingEvent, setDeletingEvent] = useState(null)

  // Fetch events from backend API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
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
        const response = await fetch('https://event-management-system-fmvu.onrender.com/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setEvents(data.events || [])
          calculateStats(data.events || [])
        } else {
          setError(data.message || 'Failed to fetch events')
        }
      } catch (err) {
        setError('An error occurred. Please try again later.')
        console.error('Fetch events error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Calculate statistics
  const calculateStats = (eventsData) => {
    const stats = {
      total: eventsData.length,
      upcoming: eventsData.filter(e => e.status === 'Upcoming').length,
      ongoing: eventsData.filter(e => e.status === 'Ongoing').length,
      completed: eventsData.filter(e => e.status === 'Completed').length,
      cancelled: eventsData.filter(e => e.status === 'Cancelled').length
    }
    setStats(stats)
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle create event
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setFormMessage('')
    
    const token = localStorage.getItem('token')
    if (!token) {
      setFormMessage('Please login to create events.')
      return
    }
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || 
        !formData.date || !formData.location.trim() || !formData.category.trim()) {
      setFormMessage('All fields except capacity are required.')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await fetch('https://event-management-system-fmvu.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: formData.date,
          location: formData.location.trim(),
          category: formData.category.trim(),
          status: formData.status,
          capacity: formData.capacity ? parseInt(formData.capacity) : null
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setFormMessage('Event created successfully!')
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: '',
          status: 'Upcoming',
          capacity: ''
        })
        setShowCreateForm(false)
        // Refresh events
        fetchEvents()
      } else {
        setFormMessage(data.message || 'Failed to create event')
      }
    } catch (err) {
      setFormMessage('An error occurred. Please try again.')
      console.error('Create event error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit event
  const handleEditEvent = async (e) => {
    e.preventDefault()
    setFormMessage('')
    
    const token = localStorage.getItem('token')
    if (!token) {
      setFormMessage('Please login to update events.')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await fetch(`https://event-management-system-fmvu.onrender.com/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: formData.date,
          location: formData.location.trim(),
          category: formData.category.trim(),
          status: formData.status,
          capacity: formData.capacity ? parseInt(formData.capacity) : null
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setFormMessage('Event updated successfully!')
        setEditingEvent(null)
        setShowCreateForm(false)
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: '',
          status: 'Upcoming',
          capacity: ''
        })
        fetchEvents()
      } else {
        setFormMessage(data.message || 'Failed to update event')
      }
    } catch (err) {
      setFormMessage('An error occurred. Please try again.')
      console.error('Update event error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setFormMessage('Please login to delete events.')
      return
    }
    
    try {
      const response = await fetch(`https://event-management-system-fmvu.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setFormMessage('Event deleted successfully!')
        setDeletingEvent(null)
        fetchEvents()
      } else {
        setFormMessage(data.message || 'Failed to delete event')
      }
    } catch (err) {
      setFormMessage('An error occurred. Please try again.')
      console.error('Delete event error:', err)
    }
  }

  // Open edit form
  const openEditForm = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split('T')[0] : '',
      location: event.location,
      category: event.category,
      status: event.status,
      capacity: event.capacity || ''
    })
    setShowCreateForm(true)
  }

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

  // Refresh events helper
  const fetchEvents = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    try {
      const response = await fetch('https://event-management-system-fmvu.onrender.com/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (response.ok) {
        setEvents(data.events || [])
        calculateStats(data.events || [])
      }
    } catch (err) {
      console.error('Fetch events error:', err)
    }
  }

  return (
    <div className="em-dashboard-container">
      <div className="em-dashboard-header">
        <div className="em-dashboard-header-content">
          <div className="em-dashboard-title-section">
            <h1 className="em-dashboard-title">EVENT MANAGER DASHBOARD</h1>
            {user && (
              <div className="em-dashboard-user-info">
                <p className="em-dashboard-welcome">
                  Welcome, {user.name}
                </p>
                <span className="em-dashboard-role-badge">
                  {user.role}
                </span>
              </div>
            )}
          </div>
          <p className="em-dashboard-subtitle">Manage your events and track registrations</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="em-stats-grid">
        <div className="em-stat-card em-stat-total">
          <h3 className="em-stat-number">{stats.total}</h3>
          <p className="em-stat-label">Total Events</p>
        </div>
        <div className="em-stat-card em-stat-upcoming">
          <h3 className="em-stat-number">{stats.upcoming}</h3>
          <p className="em-stat-label">Upcoming</p>
        </div>
        <div className="em-stat-card em-stat-ongoing">
          <h3 className="em-stat-number">{stats.ongoing}</h3>
          <p className="em-stat-label">Ongoing</p>
        </div>
        <div className="em-stat-card em-stat-completed">
          <h3 className="em-stat-number">{stats.completed}</h3>
          <p className="em-stat-label">Completed</p>
        </div>
        <div className="em-stat-card em-stat-cancelled">
          <h3 className="em-stat-number">{stats.cancelled}</h3>
          <p className="em-stat-label">Cancelled</p>
        </div>
      </div>

      {/* Loading message */}
      {loading && (
        <div className="em-message em-loading">
          Loading events...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="em-message em-error">
          {error}
        </div>
      )}

      {/* Form message */}
      {formMessage && (
        <div className="em-message em-info">
          {formMessage}
        </div>
      )}

      {/* Create Event Button */}
      {!loading && !error && (
        <button 
          className="em-create-button"
          onClick={() => {
            setEditingEvent(null)
            setFormData({
              title: '',
              description: '',
              date: '',
              location: '',
              category: '',
              status: 'Upcoming',
              capacity: ''
            })
            setShowCreateForm(!showCreateForm)
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create Event'}
        </button>
      )}

      {/* Create/Edit Event Form */}
      {showCreateForm && (
        <div className="em-form-container">
          <h2 className="em-form-title">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={editingEvent ? handleEditEvent : handleCreateEvent} className="em-form">
            <div className="em-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={submitting}
                required
              />
            </div>
            
            <div className="em-form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={submitting}
                required
                rows="4"
              />
            </div>
            
            <div className="em-form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                disabled={submitting}
                required
              />
            </div>
            
            <div className="em-form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={submitting}
                required
              />
            </div>
            
            <div className="em-form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={submitting}
                required
              />
            </div>
            
            <div className="em-form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={submitting}
                required
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="em-form-group">
              <label>Capacity (optional)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                disabled={submitting}
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </div>
            
            <button 
              type="submit" 
              className="em-submit-button"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
            </button>
          </form>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="em-events-grid">
          {events.length === 0 ? (
            <div className="em-message em-empty">
              No events yet. Create your first event!
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="em-event-card">
                <div className="em-event-header">
                  <span className={`em-event-status em-status-${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                  {event.capacity && (
                    <span className="em-event-capacity">
                      Capacity: {event.capacity}
                    </span>
                  )}
                </div>
                
                <h3 className="em-event-title">{event.title}</h3>
                
                <p className="em-event-description">
                  {event.description}
                </p>
                
                <div className="em-event-details">
                  <div className="em-event-detail">
                    <span>📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="em-event-detail">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="em-event-detail">
                    <span>🏷️</span>
                    <span>{event.category}</span>
                  </div>
                </div>
                
                <div className="em-event-actions">
                  <button 
                    className="em-action-button em-edit-button"
                    onClick={() => openEditForm(event)}
                  >
                    Edit
                  </button>
                  <button 
                    className="em-action-button em-delete-button"
                    onClick={() => setDeletingEvent(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="em-modal-overlay">
          <div className="em-modal">
            <h3 className="em-modal-title">Confirm Delete</h3>
            <p className="em-modal-message">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="em-modal-actions">
              <button 
                className="em-modal-button em-modal-cancel"
                onClick={() => setDeletingEvent(null)}
              >
                Cancel
              </button>
              <button 
                className="em-modal-button em-modal-confirm"
                onClick={() => handleDeleteEvent(deletingEvent)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventManagerDashboard
