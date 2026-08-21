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
  const [weeklyRevenue, setWeeklyRevenue] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('chart') // 'chart' or 'kpis'
  const [chartHovered, setChartHovered] = useState(null)
  
  // Custom Live Theme Color chooser state
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('imtech-accent') || '#105a81'
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-purple', accentColor)
    document.documentElement.style.setProperty('--accent-purple-light', accentColor + 'ee')
    localStorage.setItem('imtech-accent', accentColor)
  }, [accentColor])

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

      // Group last 7 days transactions for SVG Chart
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        last7Days.push(d.toISOString().split('T')[0])
      }

      const revData = last7Days.map(day => {
        const dailyT = transactions.filter(t => t.date_transaction?.startsWith(day))
        const total = dailyT.reduce((sum, t) => sum + parseFloat(t.montant_total || 0), 0)
        return {
          date: day,
          label: new Date(day).toLocaleDateString('fr-MA', { weekday: 'short', day: 'numeric' }),
          revenue: total,
          count: dailyT.length
        }
      })
      setWeeklyRevenue(revData)
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

  // Render SVG Chart calculations
  const maxVal = Math.max(...weeklyRevenue.map(d => d.revenue), 1000)
  const chartHeight = 160
  const chartWidth = 500
  const points = weeklyRevenue.map((d, index) => {
    const x = (index / (weeklyRevenue.length - 1)) * (chartWidth - 40) + 20
    const y = chartHeight - (d.revenue / maxVal) * (chartHeight - 40) - 20
    return { x, y, label: d.label, val: d.revenue, count: d.count }
  })

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, '')

  const fillD = points.length ? `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z` : ''

  // KPI Calculations
  const repairGoal = stats.activeReparations > 0 ? Math.min(100, Math.round(((stats.totalProducts - stats.lowStockProducts) / stats.totalProducts) * 100)) : 80
  const stockGoal = stats.totalProducts > 0 ? Math.round(((stats.totalProducts - stats.lowStockProducts) / stats.totalProducts) * 100) : 100
  const revenueGoal = Math.min(100, Math.round((stats.todayRevenue / 5000) * 100)) // 5000 DH target

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
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <div className="page-title">
            <i className="fa-solid fa-chart-line"></i>
            Tableau de bord
          </div>
          <div className="page-subtitle">Aperçu analytique et opérationnel de votre magasin</div>
        </div>

        {/* Live Accent customizer */}
        <div className="dashboard-actions">
          <div className="accent-chooser" title="Personnaliser la couleur de marque">
            <span className="accent-chooser-label"><i className="fa-solid fa-palette"></i> Style</span>
            {[
              { color: '#105a81', name: 'Bleu Acier (Logo)' },
              { color: '#73be43', name: 'Vert Pomme (Logo)' },
              { color: '#8b5cf6', name: 'Violet Royal' },
              { color: '#ec4899', name: 'Rose Cyber' },
            ].map(item => (
              <button
                key={item.color}
                onClick={() => setAccentColor(item.color)}
                className={`accent-dot ${accentColor === item.color ? 'active' : ''}`}
                style={{ background: item.color }}
                title={item.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
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

      {/* ===== ANALYTICS SECTION (SVG Line Chart) ===== */}
      <div className="card dashboard-main-card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <i className="fa-solid fa-chart-simple" style={{ color: 'var(--accent-purple-light)' }}></i> Performance Commerciale
            </div>
            <div className="card-subtitle">Évolution des ventes sur les 7 derniers jours</div>
          </div>
          <div className="chip-tabs">
            <button className={`chip-tab ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>
              <i className="fa-solid fa-chart-line"></i> Graphique
            </button>
            <button className={`chip-tab ${activeTab === 'kpis' ? 'active' : ''}`} onClick={() => setActiveTab('kpis')}>
              <i className="fa-solid fa-bullseye"></i> Objectifs journaliers
            </button>
          </div>
        </div>

        {activeTab === 'chart' ? (
          <div className="chart-container">
            <div className="chart-canvas-wrap">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
                {/* Grid Lines */}
                <line x1="20" y1="20" x2={chartWidth - 20} y2="20" className="chart-grid-line" />
                <line x1="20" y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} className="chart-grid-line" />
                <line x1="20" y1={chartHeight - 20} x2={chartWidth - 20} y2={chartHeight - 20} className="chart-grid-line" />

                {/* Fill Area */}
                {fillD && <path d={fillD} className="chart-area" />}

                {/* Line Path */}
                {pathD && <path d={pathD} className="chart-line" />}

                {/* Interactive Dots */}
                {points.map((p, i) => (
                  <g key={i} className="chart-dot-group" onMouseEnter={() => setChartHovered(p)} onMouseLeave={() => setChartHovered(null)}>
                    <circle cx={p.x} cy={p.y} r="5" className="chart-dot" />
                    <circle cx={p.x} cy={p.y} r="10" className="chart-dot-pulse" />
                  </g>
                ))}
              </svg>

              {/* Chart Tooltip */}
              {chartHovered && (
                <div className="chart-tooltip" style={{ left: `${(chartHovered.x / chartWidth) * 100}%`, top: `${(chartHovered.y / chartHeight) * 100 - 25}%` }}>
                  <div className="tooltip-label">{chartHovered.label}</div>
                  <div className="tooltip-val">{chartHovered.val.toFixed(2)} DH</div>
                  <div className="tooltip-sub">{chartHovered.count} transaction(s)</div>
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="chart-legend">
              {weeklyRevenue.map((d, i) => (
                <span key={i} className="legend-label">{d.label.split(' ')[0]}</span>
              ))}
            </div>
          </div>
        ) : (
          /* Circular stats KPIS */
          <div className="kpis-grid">
            <div className="kpi-ring-card">
              <div className="kpi-ring-svg-wrap">
                <svg viewBox="0 0 36 36" className="kpi-ring">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ring-fill fill-purple" strokeDasharray={`${stockGoal}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="ring-text">{stockGoal}%</div>
              </div>
              <div className="kpi-label">Santé des stocks</div>
              <div className="kpi-sub">Produits hors alerte critique</div>
            </div>

            <div className="kpi-ring-card">
              <div className="kpi-ring-svg-wrap">
                <svg viewBox="0 0 36 36" className="kpi-ring">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ring-fill fill-green" strokeDasharray={`${revenueGoal}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="ring-text">{revenueGoal}%</div>
              </div>
              <div className="kpi-label">Objectif Ventes</div>
              <div className="kpi-sub">Cible journalière de 5 000 DH</div>
            </div>

            <div className="kpi-ring-card">
              <div className="kpi-ring-svg-wrap">
                <svg viewBox="0 0 36 36" className="kpi-ring">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ring-fill fill-orange" strokeDasharray={`${repairGoal}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="ring-text">{repairGoal}%</div>
              </div>
              <div className="kpi-label">Efficacité Réparations</div>
              <div className="kpi-sub">Tickets livrés ou résolus</div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        {/* RECENT REPAIRS */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <i className="fa-solid fa-screwdriver-wrench" style={{ color: 'var(--accent-purple-light)' }}></i> Réparations en attente
              </div>
              <div className="card-subtitle">Tickets actifs à traiter</div>
            </div>
            <Link to="/reparations" className="btn btn-secondary btn-sm">
              <i className="fa-solid fa-arrow-right"></i> Voir tout
            </Link>
          </div>
          {recentReparations.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-screwdriver-wrench"></i>
              <h4>Aucune réparation</h4>
              <p>Tous les appareils sont livrés !</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
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
                        <td style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{r.code_ticket}</td>
                        <td style={{ fontWeight: 500 }}>{r.nom_client || `Client #${r.client}`}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{r.appareil}</td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS & NOTIFICATIONS */}
        <div className="dashboard-right-panel">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title"><i className="fa-solid fa-bolt" style={{ color: 'var(--accent-orange)' }}></i> Actions rapides</div>
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

          {/* Smart Advisor alerts */}
          <div className="card advisor-card">
            <div className="card-header">
              <div>
                <div className="card-title"><i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b' }}></i> I'm Tech Smart Advisor</div>
                <div className="card-subtitle">Conseils opérationnels automatiques</div>
              </div>
            </div>
            <div className="advisor-alerts">
              {stats.lowStockProducts > 0 && (
                <div className="advisor-alert warning">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <div>
                    <div className="adv-title">Alerte Stocks</div>
                    <div className="adv-desc">{stats.lowStockProducts} produit(s) ont atteint le niveau de stock minimum.</div>
                  </div>
                </div>
              )}
              {stats.activeReparations > 2 && (
                <div className="advisor-alert info">
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                  <div>
                    <div className="adv-title">Charge de réparation élevée</div>
                    <div className="adv-desc">{stats.activeReparations} tickets actifs à traiter en atelier aujourd'hui.</div>
                  </div>
                </div>
              )}
              {stats.todayRevenue === 0 ? (
                <div className="advisor-alert success">
                  <i className="fa-solid fa-cash-register"></i>
                  <div>
                    <div className="adv-title">Prêt pour les encaissements</div>
                    <div className="adv-desc">Lancez la caisse pour enregistrer vos premières transactions.</div>
                  </div>
                </div>
              ) : (
                <div className="advisor-alert success">
                  <i className="fa-solid fa-circle-check"></i>
                  <div>
                    <div className="adv-title">Bonne journée de vente</div>
                    <div className="adv-desc">{stats.todayRevenue.toFixed(0)} DH encaissés aujourd'hui !</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
