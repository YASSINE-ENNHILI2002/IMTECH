import { useState, useEffect } from 'react'
import { productsAPI, categoriesAPI } from '../services/api'
import './Produits.css'

function Produits() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [formData, setFormData] = useState({
    nom: '',
    code_barres: '',
    categorie: '',
    type_stock: 'QUANTITE',
    marque: '',
    modele: '',
    capacite: '',
    couleur: '',
    prix_achat: '',
    prix_vente: '',
    stock: 0,
    stock_min: 5,
    garantie_mois: 12,
    description: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ])
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code_barres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.marque?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categorie === parseInt(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await productsAPI.create(formData)
      setShowModal(false)
      loadData()
      setFormData({
        nom: '',
        code_barres: '',
        categorie: '',
        type_stock: 'QUANTITE',
        marque: '',
        modele: '',
        capacite: '',
        couleur: '',
        prix_achat: '',
        prix_vente: '',
        stock: 0,
        stock_min: 5,
        garantie_mois: 12,
        description: '',
      })
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productsAPI.delete(id)
        loadData()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="produits-page">
      <div className="page-header">
        <h2>Gestion des Produits</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Produit
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par nom, code-barres, marque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className={`product-card ${product.est_stock_faible ? 'low-stock' : ''}`}>
            <div className="product-header">
              <h3>{product.nom}</h3>
              {product.est_stock_faible && <span className="badge warning">Stock faible</span>}
            </div>
            <div className="product-details">
              <p><strong>Code-barres:</strong> {product.code_barres || 'N/A'}</p>
              <p><strong>Catégorie:</strong> {product.categorie_nom || 'N/A'}</p>
              <p><strong>Type:</strong> {product.type_stock === 'UNIQUE_IMEI' ? 'Unité unique' : 'Quantité'}</p>
              {product.marque && <p><strong>Marque:</strong> {product.marque}</p>}
              {product.modele && <p><strong>Modèle:</strong> {product.modele}</p>}
              <p><strong>Prix vente:</strong> {parseFloat(product.prix_vente).toFixed(2)}€</p>
              <p><strong>Stock:</strong> {product.stock} {product.stock <= product.stock_min && '(minimum)'}</p>
            </div>
            <div className="product-actions">
              <button className="btn btn-sm btn-info">Modifier</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>
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
              <h3>Nouveau Produit</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom du produit*</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Code-barres</label>
                  <input
                    type="text"
                    value={formData.code_barres}
                    onChange={(e) => setFormData({...formData, code_barres: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type de stock</label>
                  <select
                    value={formData.type_stock}
                    onChange={(e) => setFormData({...formData, type_stock: e.target.value})}
                  >
                    <option value="QUANTITE">Quantité en vrac</option>
                    <option value="UNIQUE_IMEI">Unité unique (IMEI)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Marque</label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Modèle</label>
                  <input
                    type="text"
                    value={formData.modele}
                    onChange={(e) => setFormData({...formData, modele: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Prix d'achat*</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.prix_achat}
                    onChange={(e) => setFormData({...formData, prix_achat: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Prix de vente*</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.prix_vente}
                    onChange={(e) => setFormData({...formData, prix_vente: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stock initial</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Stock minimum</label>
                  <input
                    type="number"
                    value={formData.stock_min}
                    onChange={(e) => setFormData({...formData, stock_min: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
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

export default Produits
