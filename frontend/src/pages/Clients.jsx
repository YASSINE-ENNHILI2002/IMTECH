import { useState, useEffect } from 'react'
import { clientsAPI } from '../services/api'
import './Clients.css'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    type_piece: 'CIN',
    numero_piece: '',
    email: '',
    adresse: '',
    notes: '',
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll()
      setClients(response.data)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.includes(searchTerm) ||
    client.numero_piece.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await clientsAPI.create(formData)
      setShowModal(false)
      loadClients()
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        type_piece: 'CIN',
        numero_piece: '',
        email: '',
        adresse: '',
        notes: '',
      })
    } catch (error) {
      console.error('Error creating client:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientsAPI.delete(id)
        loadClients()
      } catch (error) {
        console.error('Error deleting client:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="clients-page">
      <div className="page-header">
        <h2>Gestion des Clients</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Client
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, téléphone, numéro de pièce..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="clients-list">
        {filteredClients.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-header">
              <h3>{client.prenom} {client.nom}</h3>
              <span className="badge">{client.type_piece}</span>
            </div>
            <div className="client-details">
              <p><strong>Téléphone:</strong> {client.telephone}</p>
              <p><strong>Pièce d'identité:</strong> {client.numero_piece}</p>
              {client.email && <p><strong>Email:</strong> {client.email}</p>}
              {client.adresse && <p><strong>Adresse:</strong> {client.adresse}</p>}
              <p><strong>Date création:</strong> {new Date(client.date_creation).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="client-actions">
              <button className="btn btn-sm btn-info">Modifier</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(client.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nouveau Client</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom*</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Prénom*</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone*</label>
                  <input
                    type="text"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Type de pièce*</label>
                  <select
                    required
                    value={formData.type_piece}
                    onChange={(e) => setFormData({...formData, type_piece: e.target.value})}
                  >
                    <option value="CIN">Carte d'Identité Nationale</option>
                    <option value="PASSEPORT">Passeport</option>
                    <option value="CARTE_SEJOUR">Carte de séjour</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Numéro de pièce*</label>
                  <input
                    type="text"
                    required
                    value={formData.numero_piece}
                    onChange={(e) => setFormData({...formData, numero_piece: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="2"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients
