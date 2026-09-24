import { useState, useEffect } from 'react'
import './Events.css'

function Events() {
  // State for events data
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])

  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // State for registration
  const [registering, setRegistering] = useState(null)
  const [registerMessage, setRegisterMessage] = useState('')

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-asc')

  // Fetch events from backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          'https://event-management-system-fmy4.onrender.com/api/events'
        )

        const data = await response.json()

        if (response.ok) {
          setEvents(data.events || [])
          setFilteredEvents(data.events || [])
        } else {
          setError(
            data.message || 'Failed to fetch events'
          )
        }
      } catch (err) {
        setError(
          'An error occurred. Please try again later.'
        )
        console.error('Fetch events error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...events]

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    // Apply sort
    if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, categoryFilter, statusFilter, sortBy])

  // Get unique categories
  const categories = [...new Set(events.map(event => event.category))]

  // Get unique statuses
  const statuses = [...new Set(events.map(event => event.status))]

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setSortBy('date-asc')
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

  // Handle event registration
  const handleRegister = async (eventId) => {
    setRegisterMessage('')

    const token = localStorage.getItem('token')

    if (!token) {
      setRegisterMessage(
        'Please login to register for events.'
      )
      return
    }

    setRegistering(eventId)

    try {
      const response = await fetch(
        'https://event-management-system-fmy4.onrender.com/api/registrations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            event: eventId
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setRegisterMessage(
          'Event registration successful!'
        )
      } else {
        setRegisterMessage(
          data.message || 'Registration failed'
        )
      }

    } catch (err) {
      setRegisterMessage(
        'An error occurred during registration. Please try again.'
      )

      console.error(
        'Registration error:',
        err
      )

    } finally {
      setRegistering(null)
    }
  }

  return (
    <div className="events-container">


      {/* Page header */}
      <div className="events-header">

        <h1 className="events-title">
          Events
        </h1>

        <p className="events-subtitle">
          Discover and register for upcoming events
        </p>

      </div>

      {/* Filters and Search */}
      {!loading && !error && (
        <div className="events-filters">
          {/* Search */}
          <div className="events-filter-group">
            <label className="events-filter-label">Search</label>
            <input
              type="text"
              className="events-search-input"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="events-filter-group">
            <label className="events-filter-label">Category</label>
            <select
              className="events-filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="events-filter-group">
            <label className="events-filter-label">Status</label>
            <select
              className="events-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="events-filter-group">
            <label className="events-filter-label">Sort By</label>
            <select
              className="events-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-asc">Date (Earliest)</option>
              <option value="date-desc">Date (Latest)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            className="events-clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div className="events-message events-loading">
          Loading events...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="events-message events-error">
          {error}
        </div>
      )}

      {/* Registration message */}
      {registerMessage && (
        <div className="events-message events-info">
          {registerMessage}
        </div>
      )}

      {/* Events */}
      {!loading && !error && (
        <div className="events-grid">

          {filteredEvents.length === 0 ? (

            <div className="events-message events-empty">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No events match your filters.'
                : 'No events available at the moment.'}
            </div>

          ) : (

            filteredEvents.map((event) => (

              <div
                key={event._id}
                className="event-card"
              >

                {/* Event header */}
                <div className="event-header">

                  <span className="event-category">
                    {event.category}
                  </span>

                  <span
                    className={`event-status event-status-${event.status.toLowerCase()}`}
                  >
                    {event.status}
                  </span>

                </div>

                {/* Event title */}
                <h2 className="event-title">
                  {event.title}
                </h2>

                {/* Description */}
                <p className="event-description">
                  {event.description}
                </p>

                {/* Event details */}
                <div className="event-details">

                  <div className="event-detail">
                    <span className="event-detail-icon">
                      📅
                    </span>

                    <span>
                      {formatDate(event.date)}
                    </span>
                  </div>

                  <div className="event-detail">
                    <span className="event-detail-icon">
                      📍
                    </span>

                    <span>
                      {event.location}
                    </span>
                  </div>

                </div>

                {/* Register button */}
                {localStorage.getItem('token') ? (
                  <button
                    className="event-register-button"
                    onClick={() =>
                      handleRegister(event._id)
                    }
                    disabled={
                      registering === event._id
                    }
                  >
                    {registering === event._id
                      ? 'Registering...'
                      : 'Register Now'}
                  </button>
                ) : (
                  <button
                    className="event-register-button event-login-button"
                    disabled
                  >
                    Login to Register
                  </button>
                )}

              </div>

            ))

          )}

        </div>
      )}

    </div>
  )
}

export default Events