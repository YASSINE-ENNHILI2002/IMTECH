import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI, reparationsAPI, transactionsAPI } from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    activeReparations: 0,
    todayTransactions: 0,
    todayRevenue: 0,
  })
  const [recentReparations, setRecentReparations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDashboardData() }, [])

  const loadDashboardData = async () => {
    try {
      const [productsRes, reparationsRes, transactionsRes] = await Promise.all([
        productsAPI.getAll(),
        reparationsAPI.getAll(),
        transactionsAPI.getAll(),
      ])
      const products = productsRes.data
      const reparations = reparationsRes.data
      const transactions = transactionsRes.data
      const today = new Date().toISOString().split('T')[0]
      const todayTrans = transactions.filter(t => t.date_transaction?.startsWith(today))
      setStats({
        totalProducts: products.length,
        lowStockProducts: products.filter(p => p.est_stock_faible).length,
        activeReparations: reparations.filter(r => r.statut !== 'LIVRE' && r.statut !== 'NON_REPARABLE').length,
        todayTransactions: todayTrans.length,
        todayRevenue: todayTrans.reduce((sum, t) => sum + parseFloat(t.montant_total || 0), 0),
      })
      setRecentReparations(reparations.slice(0, 5))
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: 'fa-solid fa-box-open', label: 'Produits en stock', value: stats.totalProducts, color: 'purple', link: '/produits' },
    { icon: 'fa-solid fa-triangle-exclamation', label: 'Stock faible', value: stats.lowStockProducts, color: 'orange', link: '/produits' },
    { icon: 'fa-solid fa-screwdriver-wrench', label: 'Réparations actives', value: stats.activeReparations, color: 'cyan', link: '/reparations' },
    { icon: 'fa-solid fa-coins', label: `CA du jour (${stats.todayTransactions} ventes)`, value: `${stats.todayRevenue.toFixed(2)} DH`, color: 'green', link: '/caisse' },
  ]

  const statusMap = {
    'RECU': { label: 'Reçu', cls: 'badge-orange' },
    'EN_DIAGNOSTIC': { label: 'Diagnostic', cls: 'badge-cyan' },
    'EN_REPARATION': { label: 'Réparation', cls: 'badge-purple' },
    'REPARE': { label: 'Réparé', cls: 'badge-green' },
    'LIVRE': { label: 'Livré', cls: 'badge-gray' },
    'NON_REPARABLE': { label: 'Non réparable', cls: 'badge-red' },
  }

  const quickActions = [
    { icon: 'fa-solid fa-screwdriver-wrench', label: 'Nouvelle réparation', link: '/reparations', color: 'purple' },
    { icon: 'fa-solid fa-rotate-left', label: 'Rachat téléphone', link: '/rachat', color: 'cyan' },
    { icon: 'fa-solid fa-cart-plus', label: 'Nouvelle vente', link: '/caisse', color: 'green' },
    { icon: 'fa-solid fa-user-plus', label: 'Ajouter client', link: '/clients', color: 'orange' },
  ]

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <span>Chargement du tableau de bord...</span>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <div className="page-title">
            <i className="fa-solid fa-chart-line"></i>
            Tableau de bord
          </div>
          <div className="page-subtitle">Bienvenue — voici un aperçu de votre magasin</div>
        </div>
        <div className="dashboard-date">
          <i className="fa-regular fa-calendar"></i>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <Link to={card.link} className={`stat-card stat-${card.color}`} key={i}>
            <div className="stat-icon-wrap">
              <i className={card.icon}></i>
            </div>
            <div className="stat-body">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
            <i className="fa-solid fa-arrow-right stat-arrow"></i>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* RECENT REPAIRS */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><i className="fa-solid fa-clock-rotate-left" style={{color:'var(--accent-purple-light)'}}></i> Réparations récentes</div>
              <div className="card-subtitle">5 derniers tickets</div>
            </div>
            <Link to="/reparations" className="btn btn-secondary btn-sm">
              <i className="fa-solid fa-arrow-right"></i> Voir tout
            </Link>
          </div>
          {recentReparations.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-screwdriver-wrench"></i>
              <h4>Aucune réparation</h4>
              <p>Les tickets s'afficheront ici</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Appareil</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReparations.map(r => {
                    const s = statusMap[r.statut] || { label: r.statut, cls: 'badge-gray' }
                    return (
                      <tr key={r.id}>
                        <td style={{fontWeight:500}}>{r.client_nom || `Client #${r.client}`}</td>
                        <td style={{color:'var(--text-secondary)'}}>{r.appareil}</td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><i className="fa-solid fa-bolt" style={{color:'var(--accent-orange)'}}></i> Actions rapides</div>
              <div className="card-subtitle">Raccourcis fréquents</div>
            </div>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, i) => (
              <Link to={action.link} key={i} className={`quick-action-card quick-action-${action.color}`}>
                <i className={action.icon}></i>
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
