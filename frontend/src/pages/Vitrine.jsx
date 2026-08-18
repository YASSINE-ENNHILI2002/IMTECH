import { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import './Vitrine.css'

function Vitrine() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getPublicCatalog()
      setProducts(response.data)
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(response.data.map(p => p.categorie_nom).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.modele?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categorie_nom === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactClick = (product) => {
    setSelectedProduct(product)
    setShowContactModal(true)
  }

  const handleWhatsAppOrder = (product) => {
    const phoneNumber = "33612345678" // À remplacer par votre numéro WhatsApp international (ex: 33612345678 pour France)
    const message = `Bonjour! Je souhaite commander le produit suivant:\n\n📱 *${product.nom}*\n💰 Prix: ${parseFloat(product.prix_vente).toFixed(2)}€\n📦 Stock disponible: ${product.stock}\n📍 Magasin: Magasin Mobile Paris\n\nMerci de me confirmer la disponibilité et les modalités de commande.`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) return <div className="loading-vitrine">Chargement...</div>

  return (
    <div className="vitrine-page">
      {/* Header */}
      <header className="vitrine-header">
        <div className="header-content">
          <h1>📱 Magasin Mobile</h1>
          <p>Vente de téléphones, accessoires et services de réparation</p>
          <div className="header-contact">
            <span>📍 123 Rue du Commerce, Paris</span>
            <span>📞 01 23 45 67 89</span>
            <span>📱 WhatsApp: +33 6 12 34 56 78</span>
            <span>✉️ contact@magasin-mobile.fr</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Découvrez nos produits</h2>
          <p>Téléphones neufs et d'occasion, accessoires, et services de réparation professionnelle</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">Produits disponibles</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Service client</span>
            </div>
            <div className="stat">
              <span className="stat-number">12 mois</span>
              <span className="stat-label">Garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un produit, marque, modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          <button 
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Tous les produits
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <h2>Nos Produits</h2>
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>Aucun produit ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.nom}
                      className="product-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="placeholder-image" style={{display: product.image_url ? 'none' : 'flex'}}>
                    {product.type_stock === 'UNIQUE_IMEI' ? '📱' : '📦'}
                  </div>
                  {product.est_stock_faible && (
                    <span className="stock-badge warning">Stock limité</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.nom}</h3>
                  <p className="product-category">{product.categorie_nom || 'Divers'}</p>
                  {product.marque && (
                    <p className="product-brand">{product.marque} {product.modele}</p>
                  )}
                  {product.capacite && (
                    <p className="product-capacity">{product.capacite}</p>
                  )}
                  <div className="product-price">
                    <span className="price">{parseFloat(product.prix_vente).toFixed(2)}€</span>
                    <span className="stock">En stock: {product.stock}</span>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-whatsapp"
                      onClick={() => handleWhatsAppOrder(product)}
                    >
                      📱 Commander via WhatsApp
                    </button>
                    <button 
                      className="btn btn-contact"
                      onClick={() => handleContactClick(product)}
                    >
                      📞 Nous contacter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Nos Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🔧</div>
            <h3>Réparations</h3>
            <p>Réparation professionnelle de tous types de téléphones et tablettes</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🔄</div>
            <h3>Rachat Occasion</h3>
            <p>Nous rachetons votre ancien téléphone au meilleur prix</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>Téléphones Neufs</h3>
            <p>Large gamme de téléphones neufs avec garantie constructeur</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎧</div>
            <h3>Accessoires</h3>
            <p>Coques, protections, chargeurs et accessoires originaux</p>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nous contacter</h3>
              <button className="close-btn" onClick={() => setShowContactModal(false)}>×</button>
            </div>
            <div className="product-summary">
              <h4>Produit: {selectedProduct.nom}</h4>
              <p>Prix: {parseFloat(selectedProduct.prix_vente).toFixed(2)}€</p>
              <p>Stock: {selectedProduct.stock} unité(s)</p>
            </div>
            <div className="contact-info">
              <h4>Informations de contact</h4>
              <p>📍 Adresse: 123 Rue du Commerce, 75001 Paris</p>
              <p>📞 Téléphone: 01 23 45 67 89</p>
              <p>✉️ Email: contact@magasin-mobile.fr</p>
              <p>🕐 Horaires: Lundi-Samedi 9h-19h</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowContactModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="vitrine-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Magasin Mobile</h4>
            <p>Votre partenaire pour tous vos besoins mobiles</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📍 123 Rue du Commerce, Paris</p>
            <p>📞 01 23 45 67 89</p>
            <p>✉️ contact@magasin-mobile.fr</p>
          </div>
          <div className="footer-section">
            <h4>Horaires</h4>
            <p>Lundi - Samedi: 9h - 19h</p>
            <p>Dimanche: Fermé</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Magasin Mobile. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default Vitrine
