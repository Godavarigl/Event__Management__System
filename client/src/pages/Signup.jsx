import { useState } from 'react'
import './Signup.css'

function Signup({ onSignupSuccess, onNavigateToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    // Validation
    if (!name.trim()) {
      setError('Full name is required')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!confirmPassword.trim()) {
      setError('Please confirm your password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!selectedRole) {
      setError('Please select your role')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role: selectedRole
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully! Please login.')

        // Clear form
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setSelectedRole('')
      } else {
        setError(
          data.message || 'Registration failed. Please try again.'
        )
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(
        'Unable to connect to the server. Please make sure the backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">

      {/* LEFT SIDE - Branding */}
      <div className="signup-left">
        <div className="signup-branding">
          <h1 className="signup-branding-title">
            Join Our Community
          </h1>
          <p className="signup-branding-description">
            Create your account and start managing events today. 
            Whether you're hosting events or attending them, our platform 
            makes it easy to connect with your community.
          </p>

          <div className="signup-features">
            <div className="signup-feature">
              <span className="signup-feature-icon">🎉</span>
              <h3>Easy Setup</h3>
              <p>Create your account in minutes</p>
            </div>
            <div className="signup-feature">
              <span className="signup-feature-icon">🔒</span>
              <h3>Secure</h3>
              <p>Your data is protected</p>
            </div>
            <div className="signup-feature">
              <span className="signup-feature-icon">🌐</span>
              <h3>Connect</h3>
              <p>Join a growing community</p>
            </div>
            <div className="signup-feature">
              <span className="signup-feature-icon">⚡</span>
              <h3>Fast</h3>
              <p>Quick event registration</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Signup Form */}
      <div className="signup-right">
        <div className="signup-card">

          <h1 className="signup-title">
            Create Your Account
          </h1>
          <p className="signup-subtitle">
            Join the Event Management System
          </p>

          {/* Error message */}
          {error && (
            <div className="signup-message signup-error">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="signup-message signup-success">
              {success}
              <button
                className="signup-login-link"
                onClick={onNavigateToLogin}
              >
                Go to Login
              </button>
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit}
              className="signup-form"
            >

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

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
                  placeholder="Create a password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>

              {/* Role Selection */}
              <div className="role-selection">
                <label className="role-label">Register as:</label>
                <div className="role-cards">
                  <div 
                    className={`role-card ${selectedRole === 'Attendee' ? 'role-card-selected' : ''}`}
                    onClick={() => setSelectedRole('Attendee')}
                  >
                    <span className="role-icon">👤</span>
                    <h3>Attendee</h3>
                    <p>Register for events and manage registrations</p>
                  </div>
                  <div 
                    className={`role-card ${selectedRole === 'Event Manager' ? 'role-card-selected' : ''}`}
                    onClick={() => setSelectedRole('Event Manager')}
                  >
                    <span className="role-icon">📅</span>
                    <h3>Event Manager</h3>
                    <p>Create and manage events</p>
                  </div>
                  <div 
                    className={`role-card ${selectedRole === 'Business Management' ? 'role-card-selected' : ''}`}
                    onClick={() => setSelectedRole('Business Management')}
                  >
                    <span className="role-icon">📊</span>
                    <h3>Business Management</h3>
                    <p>View business reports and analytics</p>
                  </div>
                </div>
              </div>

              {/* Signup button */}
              <button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

            </form>
          )}

          {/* Login link */}
          <div className="signup-footer">
            <p className="signup-footer-text">
              Already have an account?
            </p>
            <button
              className="signup-footer-link"
              onClick={onNavigateToLogin}
            >
              Login
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Signup
