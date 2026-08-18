import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: '📊 Tableau de bord' },
    { path: '/produits', label: '📦 Produits' },
    { path: '/clients', label: '👥 Clients' },
    { path: '/reparations', label: '🔧 Réparations' },
    { path: '/caisse', label: '💰 Caisse' },
    { path: '/rachat', label: '🔄 Rachat Occasion' },
    { path: '/vitrine', label: '🛍️ Vitrine Publique' },
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>📱 Gestion Magasin</h1>
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
