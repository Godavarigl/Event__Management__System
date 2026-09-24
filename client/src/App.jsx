import { useState, useEffect } from 'react'
import './App.css'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Events from './pages/Events'
import AttendeeDashboard from './pages/AttendeeDashboard'
import EventManagerDashboard from './pages/EventManagerDashboard'
import BusinessDashboard from './pages/BusinessDashboard'
import AdministratorDashboard from './pages/AdministratorDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState(null)

  // Check logged-in user
  const checkUser = () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserRole(user.role)
        setUserName(user.name)
        return user.role
      } catch (error) {
        console.error('Error reading user:', error)
        setUserRole(null)
        setUserName(null)
        return null
      }
    }

    setUserRole(null)
    setUserName(null)
    return null
  }

  // Check user when application starts
  useEffect(() => {
    checkUser()
  }, [])

  // Login success
  const handleLoginSuccess = () => {
    const role = checkUser()

    if (role) {
      setCurrentPage('dashboard')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUserRole(null)
    setUserName(null)
    setCurrentPage('landing')
  }

  // Navigate to signup
  const handleNavigateToSignup = () => {
    setCurrentPage('signup')
  }

  // Navigate to login
  const handleNavigateToLogin = () => {
    setCurrentPage('login')
  }

  // Dashboard according to role
  const renderDashboard = () => {
    if (!userRole) {
      return (
        <div className="app-message">
          <h2>Please login to access your dashboard.</h2>
          <button
            onClick={() => setCurrentPage('login')}
            className="nav-action-button"
          >
            Go to Login
          </button>
        </div>
      )
    }

    if (userRole === 'Attendee') {
      return <AttendeeDashboard onNavigateToEvents={() => setCurrentPage('events')} />
    }

    if (userRole === 'Event Manager') {
      return <EventManagerDashboard />
    }

    if (userRole === 'Business Management') {
      return <BusinessDashboard />
    }

    if (userRole === 'Administrator') {
      return <AdministratorDashboard />
    }

    return (
      <div className="app-message">
        <h2>Unknown user role</h2>
      </div>
    )
  }

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="navbar-container">

          <button
            className="navbar-logo-button"
            onClick={() => setCurrentPage('landing')}
          >
            Event Management System
          </button>

          {/* User Info - shown when logged in */}
          {userRole && userName && (
            <div className="navbar-user-info">
              <span className="navbar-user-name">{userName}</span>
              <span className="navbar-user-role">{userRole}</span>
            </div>
          )}

          <ul className="navbar-menu">

            {/* HOME */}
            <li>
              <button
                onClick={() => setCurrentPage('landing')}
                className="navbar-link navbar-button"
              >
                Home
              </button>
            </li>

            {/* EVENTS */}
            <li>
              <button
                onClick={() => setCurrentPage('events')}
                className="navbar-link navbar-button"
              >
                Events
              </button>
            </li>

            {/* DASHBOARD - only when logged in */}
            {userRole && (
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="navbar-link navbar-button"
                >
                  Dashboard
                </button>
              </li>
            )}

            {/* LOGIN / LOGOUT */}
            <li>
              {userRole ? (
                <button
                  onClick={handleLogout}
                  className="navbar-link navbar-button"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="navbar-link navbar-button"
                >
                  Login
                </button>
              )}
            </li>

          </ul>
        </div>
      </nav>

      {/* ================= PAGE CONTENT ================= */}

      {currentPage === 'landing' && (
        <>
          {/* HERO */}
          <section className="hero">
            <div className="hero-container">

              <h1 className="hero-title">
                Manage Events. Connect People.
              </h1>

              <p className="hero-description">
                Discover, manage, and register for events in one place.
                Whether you're an event manager or an attendee, our platform
                makes it easy to connect with your community.
              </p>

              <div className="hero-buttons">

                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentPage('events')}
                >
                  Explore Events
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage('login')}
                >
                  Login
                </button>

              </div>

            </div>
          </section>

          {/* FEATURES */}
          <section className="features">
            <div className="features-container">

              <h2 className="features-title">
                Why Choose Us?
              </h2>

              <div className="features-grid">

                <div className="feature-card">
                  <div className="feature-icon">📅</div>
                  <h3 className="feature-title">
                    Event Management
                  </h3>
                  <p className="feature-description">
                    Create and manage events with ease. Set dates,
                    locations, and categories to organize your events.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">✅</div>
                  <h3 className="feature-title">
                    Easy Registration
                  </h3>
                  <p className="feature-description">
                    Register for events with a single click and
                    manage your registrations easily.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🔐</div>
                  <h3 className="feature-title">
                    Role-Based Access
                  </h3>
                  <p className="feature-description">
                    Secure role-based access ensures that every user
                    has the correct permissions.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="footer">
            <div className="footer-container">
              <p>
                © 2026 Event Management System. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}

      {/* EVENTS */}
      {currentPage === 'events' && (
        <Events />
      )}

      {/* LOGIN */}
      {currentPage === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onNavigateToSignup={handleNavigateToSignup}
        />
      )}

      {/* SIGNUP */}
      {currentPage === 'signup' && (
        <Signup 
          onSignupSuccess={handleNavigateToLogin}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}

      {/* DASHBOARD */}
      {currentPage === 'dashboard' && (
        renderDashboard()
      )}

    </div>
  )
}

export default App