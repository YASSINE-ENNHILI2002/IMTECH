import React, { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import './Layout.css'
import Logo from '../components/Logo'

const navItems = [
  { path: '/',           icon: 'fa-solid fa-chart-line',        label: 'Tableau de bord' },
  { path: '/produits',   icon: 'fa-solid fa-box-open',          label: 'Produits' },
  { path: '/clients',    icon: 'fa-solid fa-users',             label: 'Clients' },
  { path: '/reparations',icon: 'fa-solid fa-screwdriver-wrench',label: 'Réparations' },
  { path: '/caisse',     icon: 'fa-solid fa-cash-register',     label: 'Caisse' },
  { path: '/rachat',     icon: 'fa-solid fa-rotate-left',       label: 'Rachat Occasion' },
  { path: '/vitrine',    icon: 'fa-solid fa-store',             label: 'Vitrine Publique' },
]

function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/admin'
  }

  return (
    <div className="app-layout">
      {/* ===== MOBILE HEADER ===== */}
      <header className="mobile-header">
        <button 
          className="mobile-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation"
        >
          <i className={sidebarOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
        </button>
        <div className="mobile-brand">
          <Logo width={110} height={36} />
        </div>
        <button className="mobile-logout" onClick={handleLogout} title="Déconnexion">
          <i className="fa-solid fa-power-off"></i>
        </button>
      </header>

      {/* ===== SIDEBAR OVERLAY ===== */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" style={{ justifyContent: 'center', padding: '20px 10px' }}>
          <Logo width={160} height={52} />
        </div>

        <div className="sidebar-section-label">Menu principal</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${item.icon} nav-icon`}></i>
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="nav-indicator"></div>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-wrapper">
            <div className="sidebar-user">
              <div className="user-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="user-info">
                <div className="user-name">Administrateur</div>
                <div className="user-role">Gérant</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Déconnexion">
              <i className="fa-solid fa-power-off"></i>
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
