import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import './AdminLogin.css'

function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem('adminAuth') === 'true') {
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate network delay for premium feel
    setTimeout(() => {
      const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || '1346'
      if (password === correctPassword) {
        localStorage.setItem('adminAuth', 'true')
        // Dispatch storage event to alert Layout component if open
        window.dispatchEvent(new Event('storage'))
        navigate('/')
      } else {
        setError('Code d\'accès incorrect. Veuillez réessayer.')
        setLoading(false)
      }
    }, 600)
  }

  const handleKeyPress = (num) => {
    if (password.length < 8) {
      setPassword(prev => prev + num)
    }
  }

  const handleClear = () => {
    setPassword('')
  }

  return (
    <div className="login-container">
      <div className="login-backdrop-glow"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <Logo width={64} height={64} />
          </div>
          <h1 className="login-title">IMTECH</h1>
          <p className="login-subtitle">Système de Gestion de Magasin</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" style={{ textAlign: 'center', marginBottom: '8px' }}>
              Saisir le code d'accès administrateur
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control login-input"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={10}
                required
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger login-alert">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Premium Quick Numeric Keypad for fast tablet/mobile entry */}
          <div className="numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="numpad-btn"
                onClick={() => handleKeyPress(num.toString())}
              >
                {num}
              </button>
            ))}
            <button type="button" className="numpad-btn numpad-action" onClick={handleClear}>
              C
            </button>
            <button
              type="button"
              className="numpad-btn"
              onClick={() => handleKeyPress('0')}
            >
              0
            </button>
            <button
              type="submit"
              className="numpad-btn numpad-action submit-btn"
              disabled={loading}
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-chevron-right"></i>}
            </button>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                Connexion en cours...
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock-open"></i>
                Déverrouiller l'accès
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
