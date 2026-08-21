import React, { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import './Layout.css'
import Logo from '../components/Logo'

const navSections = [
  {
    label: 'Gestion',
    items: [
      { path: '/',            icon: 'fa-solid fa-chart-line',         label: 'Tableau de bord' },
      { path: '/produits',    icon: 'fa-solid fa-box-open',           label: 'Produits' },
      { path: '/categories',  icon: 'fa-solid fa-tags',               label: 'Catégories' },
      { path: '/clients',     icon: 'fa-solid fa-users',              label: 'Clients' },
    ],
  },
  {
    label: 'Opérations',
    items: [
      { path: '/caisse',      icon: 'fa-solid fa-cash-register',      label: 'Caisse' },
      { path: '/reparations', icon: 'fa-solid fa-screwdriver-wrench', label: 'Réparations' },
      { path: '/rachat',      icon: 'fa-solid fa-rotate-left',        label: 'Rachat Occasion' },
    ],
  },
  {
    label: 'Vitrine',
    items: [
      { path: '/vitrine',     icon: 'fa-solid fa-store',              label: 'Site Vitrine', external: true },
    ],
  },
]

function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true'

  // Dark / Light mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('imtech-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('imtech-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin'
  }

  const today = new Date().toLocaleDateString('fr-MA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="app-layout">
      {/* ===== MOBILE HEADER ===== */}
      <header className="mobile-header">
        <button
          className="mobile-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation"
        >
          <i className={sidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
        </button>
        <div className="mobile-brand">
          <Logo width={110} height={36} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="mobile-logout"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Mode Clair' : 'Mode Sombre'}
          >
            <i className={darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
          </button>
          <button className="mobile-logout" onClick={handleLogout} title="Déconnexion">
            <i className="fa-solid fa-power-off" />
          </button>
        </div>
      </header>

      {/* ===== SIDEBAR OVERLAY ===== */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-brand">
          <Logo width={150} height={50} />
        </div>

        {/* Date */}
        <div className="sidebar-date">{today}</div>

        {/* Nav sections */}
        <nav className="sidebar-nav">
          {navSections.map(section => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map(item => {
                const isActive = location.pathname === item.path
                return item.external ? (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-item"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`${item.icon} nav-icon`} />
                    <span className="nav-label">{item.label}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 'auto' }} />
                  </a>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item${isActive ? ' active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`${item.icon} nav-icon`} />
                    <span className="nav-label">{item.label}</span>
                    {isActive && <div className="nav-indicator" />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          {/* Dark mode toggle */}
          <button
            className="theme-toggle-btn"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            <div className="theme-toggle-track">
              <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }} />
              <div className={`theme-toggle-thumb ${darkMode ? 'dark' : ''}`} />
              <i className="fa-solid fa-moon" style={{ color: '#94a3b8' }} />
            </div>
            <span>{darkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
          </button>

          {/* Divider */}
          <div className="sidebar-footer-divider" />

          {/* User area */}
          <div className="sidebar-user-wrapper">
            <div className="sidebar-user">
              <div className="user-avatar">
                <i className="fa-solid fa-user" />
              </div>
              <div className="user-info">
                <div className="user-name">Administrateur</div>
                <div className="user-role">Gérant · I'm Tech</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Déconnexion">
              <i className="fa-solid fa-power-off" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-wrapper">
        <div className="main-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
