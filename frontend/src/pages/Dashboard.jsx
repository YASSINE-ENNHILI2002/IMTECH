import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

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
      const todayTrans = transactions.filter(t => t.date_transaction.startsWith(today))

      setStats({
        totalProducts: products.length,
        lowStockProducts: products.filter(p => p.est_stock_faible).length,
        activeReparations: reparations.filter(r => r.statut !== 'LIVRE' && r.statut !== 'NON_REPARABLE').length,
        todayTransactions: todayTrans.length,
        todayRevenue: todayTrans.reduce((sum, t) => sum + parseFloat(t.montant_total), 0),
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Produits en stock</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.lowStockProducts}</h3>
            <p>Stock faible</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🔧</div>
          <div className="stat-info">
            <h3>{stats.activeReparations}</h3>
            <p>Réparations en cours</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats.todayRevenue.toFixed(2)}€</h3>
            <p>CA du jour ({stats.todayTransactions} ventes)</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Actions rapides</h3>
          <div className="quick-actions">
            <button className="btn btn-primary">📱 Nouvelle réparation</button>
            <button className="btn btn-primary">🔄 Nouveau rachat</button>
            <button className="btn btn-primary">📦 Réception stock</button>
            <button className="btn btn-success">💰 Nouvelle vente</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
