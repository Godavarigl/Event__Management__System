import { useState } from 'react'
import './Login.css'

function Login({ onLoginSuccess, onNavigateToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    if (!selectedRole) {
      setError('Please select your role.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'https://event-management-system-fmy4.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim()
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        // Validate selected role matches actual role
        if (data.user.role !== selectedRole) {
          setError('The selected role does not match your account.')
          setLoading(false)
          return
        }

        // Save JWT token
        localStorage.setItem('token', data.token)

        // Save logged-in user and role
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )

        setSuccess('Login successful! You are now logged in.')

        // Tell App.jsx login was successful
        if (onLoginSuccess) {
          onLoginSuccess()
        }

        // Clear form
        setEmail('')
        setPassword('')
        setSelectedRole('')

      } else {
        setError(
          data.message ||
          'Login failed. Please check your credentials.'
        )
      }

    } catch (err) {
      console.error('Login error:', err)

      setError(
        'Unable to connect to the server. Please make sure the backend is running.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">

      {/* LEFT SIDE - Branding */}
      <div className="login-left">
        <div className="login-branding">
          <h1 className="login-branding-title">
            Manage. Connect. Experience.
          </h1>
          <p className="login-branding-description">
            Discover, manage, and register for events in one place. 
            Whether you're an event manager or an attendee, our platform 
            makes it easy to connect with your community.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <span className="login-feature-icon">📅</span>
              <h3>Event Management</h3>
              <p>Create and manage events with ease</p>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">✅</span>
              <h3>Easy Registration</h3>
              <p>Register for events with a single click</p>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">📊</span>
              <h3>Attendance Tracking</h3>
              <p>Track attendance and generate reports</p>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">📈</span>
              <h3>Business Reports</h3>
              <p>Analytics and insights for management</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="login-right">
        <div className="login-card">

          <h1 className="login-title">
            Welcome Back
          </h1>
          <p className="login-subtitle">
            Sign in to your Event Management account
          </p>

          {/* Error message */}
          {error && (
            <div className="login-message login-error">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="login-message login-success">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            {/* Role Selection */}
            <div className="role-selection">
              <label className="role-label">Login as:</label>
              <div className="role-cards">
                <div 
                  className={`role-card ${selectedRole === 'Attendee' ? 'role-card-selected' : ''}`}
                  onClick={() => setSelectedRole('Attendee')}
                >
                  <span className="role-icon">👤</span>
                  <h3>Attendee</h3>
                  <p>Manage event registrations and view upcoming events</p>
                </div>
                <div 
                  className={`role-card ${selectedRole === 'Event Manager' ? 'role-card-selected' : ''}`}
                  onClick={() => setSelectedRole('Event Manager')}
                >
                  <span className="role-icon">📅</span>
                  <h3>Event Manager</h3>
                  <p>Create, manage and track events</p>
                </div>
                <div 
                  className={`role-card ${selectedRole === 'Business Management' ? 'role-card-selected' : ''}`}
                  onClick={() => setSelectedRole('Business Management')}
                >
                  <span className="role-icon">📊</span>
                  <h3>Business Management</h3>
                  <p>View business reports and event statistics</p>
                </div>
                <div 
                  className={`role-card ${selectedRole === 'Administrator' ? 'role-card-selected' : ''}`}
                  onClick={() => setSelectedRole('Administrator')}
                >
                  <span className="role-icon">🛡</span>
                  <h3>Administrator</h3>
                  <p>Manage and control the overall system</p>
                </div>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          {/* Signup link */}
          <div className="login-footer">
            <p className="login-footer-text">
              New to Event Management System?
            </p>
            <button
              className="login-footer-link"
              onClick={onNavigateToSignup}
            >
              Create an account →
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login