import { useState, useEffect } from 'react'
import { reparationsAPI, clientsAPI } from '../services/api'
import './Reparations.css'

function Reparations() {
  const [tickets, setTickets] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formData, setFormData] = useState({
    client: '',
    nom_client: '',
    telephone_client: '',
    marque_appareil: '',
    modele_appareil: '',
    imei_ou_serie: '',
    code_deverrouillage: '',
    panne_declaree: '',
    constat_entree: '',
    etat_esthetique: '',
    estimation_prix: '',
    acompte: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ticketsRes, clientsRes] = await Promise.all([
        reparationsAPI.getAll(),
        clientsAPI.getAll(),
      ])
      setTickets(ticketsRes.data)
      setClients(clientsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.code_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.telephone_client.includes(searchTerm) ||
                         ticket.imei_ou_serie?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || ticket.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await reparationsAPI.create(formData)
      setShowModal(false)
      loadData()
      setFormData({
        client: '',
        nom_client: '',
        telephone_client: '',
        marque_appareil: '',
        modele_appareil: '',
        imei_ou_serie: '',
        code_deverrouillage: '',
        panne_declaree: '',
        constat_entree: '',
        etat_esthetique: '',
        estimation_prix: '',
        acompte: 0,
      })
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await reparationsAPI.changeStatus(ticketId, newStatus)
      loadData()
    } catch (error) {
      console.error('Error changing status:', error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'RECU': '#ffc107',
      'DIAGNOSTIC': '#17a2b8',
      'ATTENTE_PIECE': '#fd7e14',
      'EN_REPARATION': '#6610f2',
      'PRET': '#28a745',
      'LIVRE': '#6c757d',
      'NON_REPARABLE': '#dc3545',
    }
    return colors[status] || '#6c757d'
  }

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Chargement des tickets...</span></div>

  return (
    <div className="reparations-page">
      <div className="page-header">
        <div>
          <div className="page-title"><i className="fa-solid fa-screwdriver-wrench"></i> Gestion des Réparations</div>
          <div className="page-subtitle">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} enregistré{tickets.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Nouveau Ticket
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper" style={{ flex: 1, minWidth: 280 }}>
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par ticket, client, téléphone, IMEI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', minWidth: 180 }}
        >
          <option value="">Tous les statuts</option>
          <option value="RECU">Reçu</option>
          <option value="DIAGNOSTIC">En diagnostic</option>
          <option value="ATTENTE_PIECE">Attente pièce</option>
          <option value="EN_REPARATION">En réparation</option>
          <option value="PRET">Prêt</option>
          <option value="LIVRE">Livré</option>
          <option value="NON_REPARABLE">Non réparable</option>
        </select>
      </div>

      <div className="tickets-list">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-header">
              <div className="ticket-info">
                <h3>{ticket.code_ticket}</h3>
                <p>{ticket.marque_appareil} {ticket.modele_appareil}</p>
              </div>
              <div className="ticket-status">
                <span 
                  className="badge" 
                  style={{ backgroundColor: getStatusColor(ticket.statut), color: '#fff' }}
                >
                  {ticket.statut.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="ticket-details">
              <p><i className="fa-solid fa-user"></i> <strong>Client:</strong> {ticket.nom_client} - {ticket.telephone_client}</p>
              <p><i className="fa-solid fa-mobile-screen-button"></i> <strong>Appareil:</strong> {ticket.marque_appareil} {ticket.modele_appareil}</p>
              {ticket.imei_ou_serie && <p><i className="fa-solid fa-fingerprint"></i> <strong>IMEI/Série:</strong> {ticket.imei_ou_serie}</p>}
              <p><i className="fa-solid fa-triangle-exclamation"></i> <strong>Panne:</strong> {ticket.panne_declaree}</p>
              <p><i className="fa-solid fa-coins"></i> <strong>Estimation:</strong> {parseFloat(ticket.estimation_prix).toFixed(2)} DH 
                 (Acompte: {parseFloat(ticket.acompte).toFixed(2)} DH)</p>
              <p><i className="fa-solid fa-calendar-days"></i> <strong>Date réception:</strong> {new Date(ticket.date_reception).toLocaleDateString('fr-MA')}</p>
            </div>

            <div className="ticket-actions">
              <select
                value={ticket.statut}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                className="status-select"
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem' }}
              >
                <option value="RECU">Reçu</option>
                <option value="DIAGNOSTIC">En diagnostic</option>
                <option value="ATTENTE_PIECE">Attente pièce</option>
                <option value="EN_REPARATION">En réparation</option>
                <option value="PRET">Prêt</option>
                <option value="LIVRE">Livré</option>
                <option value="NON_REPARABLE">Non réparable</option>
              </select>
              <button className="btn btn-secondary btn-sm">Détails</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-screwdriver-wrench"></i> Nouveau Ticket de Réparation</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Client existant</label>
                    <select
                      value={formData.client}
                      onChange={(e) => {
                        const client = clients.find(c => c.id === parseInt(e.target.value))
                        setFormData({
                          ...formData,
                          client: e.target.value,
                          nom_client: client ? `${client.prenom} ${client.nom}` : '',
                          telephone_client: client ? client.telephone : '',
                        })
                      }}
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.prenom} {client.nom} - {client.telephone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nom client*</label>
                    <input
                      type="text"
                      required
                      value={formData.nom_client}
                      onChange={(e) => setFormData({...formData, nom_client: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Téléphone client*</label>
                    <input
                      type="text"
                      required
                      value={formData.telephone_client}
                      onChange={(e) => setFormData({...formData, telephone_client: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Marque appareil*</label>
                    <input
                      type="text"
                      required
                      value={formData.marque_appareil}
                      onChange={(e) => setFormData({...formData, marque_appareil: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Modèle appareil*</label>
                    <input
                      type="text"
                      required
                      value={formData.modele_appareil}
                      onChange={(e) => setFormData({...formData, modele_appareil: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>IMEI ou Numéro de série</label>
                    <input
                      type="text"
                      value={formData.imei_ou_serie}
                      onChange={(e) => setFormData({...formData, imei_ou_serie: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Code de déverrouillage</label>
                    <input
                      type="text"
                      value={formData.code_deverrouillage}
                      onChange={(e) => setFormData({...formData, code_deverrouillage: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estimation prix (DH)*</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.estimation_prix}
                      onChange={(e) => setFormData({...formData, estimation_prix: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Acompte (DH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.acompte}
                      onChange={(e) => setFormData({...formData, acompte: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div className="form-group" style={{ marginTop: 14 }}>
                  <label>Panne déclarée*</label>
                  <textarea
                    required
                    value={formData.panne_declaree}
                    onChange={(e) => setFormData({...formData, panne_declaree: e.target.value})}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>Constat d'entrée*</label>
                  <textarea
                    required
                    value={formData.constat_entree}
                    onChange={(e) => setFormData({...formData, constat_entree: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>État esthétique</label>
                  <textarea
                    value={formData.etat_esthetique}
                    onChange={(e) => setFormData({...formData, etat_esthetique: e.target.value})}
                    rows="2"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">Créer Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reparations
