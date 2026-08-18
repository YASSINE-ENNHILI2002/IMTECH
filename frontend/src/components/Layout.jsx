import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { path: '/',           icon: 'fa-solid fa-chart-line',        label: 'Tableau de bord' },
  { path: '/produits',   icon: 'fa-solid fa-box-open',          label: 'Produits' },
  { path: '/clients',    icon: 'fa-solid fa-users',             label: 'Clients' },
  { path: '/reparations',icon: 'fa-solid fa-screwdriver-wrench',label: 'Réparations' },
  { path: '/caisse',     icon: 'fa-solid fa-cash-register',     label: 'Caisse' },
  { path: '/rachat',     icon: 'fa-solid fa-rotate-left',       label: 'Rachat Occasion' },
  { path: '/vitrine',    icon: 'fa-solid fa-store',             label: 'Vitrine Publique' },
]

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="app-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="fa-solid fa-mobile-screen-button"></i>
          </div>
          <div>
            <div className="brand-name">IMTECH</div>
            <div className="brand-sub">Gestion Magasin</div>
          </div>
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
              >
                <i className={`${item.icon} nav-icon`}></i>
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="nav-indicator"></div>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="user-info">
              <div className="user-name">Administrateur</div>
              <div className="user-role">Gérant</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-wrapper">
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
