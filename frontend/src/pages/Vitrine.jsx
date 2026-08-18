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

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const r = await productsAPI.getPublicCatalog()
      setProducts(r.data)
      const cats = [...new Set(r.data.map(p => p.categorie_nom).filter(Boolean))]
      setCategories(cats)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const filtered = products.filter(p => {
    const q = searchTerm.toLowerCase()
    return (
      (!selectedCategory || p.categorie_nom === selectedCategory) &&
      (p.nom.toLowerCase().includes(q) || (p.marque || '').toLowerCase().includes(q) || (p.modele || '').toLowerCase().includes(q))
    )
  })

  const handleWhatsApp = (p) => {
    const phone = '212600000000'
    const msg = `Bonjour ! Je suis intéressé(e) par :\n\n📱 *${p.nom}*\n💰 Prix : ${parseFloat(p.prix_vente).toFixed(2)} €\n\nPouvez-vous me donner plus d'informations ? Merci !`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="vitrine-page">
      {/* ===== HERO ===== */}
      <header className="vitrine-hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-mobile-screen-button"></i> IMTECH
          </div>
          <h1 className="hero-title">Spécialiste en Téléphonie</h1>
          <p className="hero-subtitle">Accessoires, smartphones reconditionnés & réparations toutes marques</p>
          <div className="hero-stats">
            <div className="hero-stat"><span>{products.length}</span><small>Produits</small></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><span>{categories.length}</span><small>Catégories</small></div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat"><i className="fa-brands fa-whatsapp" style={{color:'#25d366'}}></i><small>WhatsApp</small></div>
          </div>
        </div>
      </header>

      {/* ===== SEARCH & FILTER ===== */}
      <section className="vitrine-controls">
        <div className="vitrine-container">
          <div className="controls-inner">
            <div className="search-wrapper" style={{flex:1, maxWidth:420}}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="form-control search-input vitrine-search"
                placeholder="Rechercher un produit, marque, modèle..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="cats-scroll">
              <button
                className={`cat-chip ${!selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                <i className="fa-solid fa-border-all"></i> Tout
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="results-count">{filtered.length} produit{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS GRID ===== */}
      <section className="vitrine-products">
        <div className="vitrine-container">
          {loading ? (
            <div className="loading-state" style={{padding:'80px 0'}}>
              <div className="spinner"></div>
              <span>Chargement du catalogue...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state" style={{padding:'80px 0'}}>
              <i className="fa-solid fa-box-open"></i>
              <h4>Aucun produit trouvé</h4>
              <p>Essayez de modifier votre recherche ou sélectionnez une autre catégorie</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => (
                <div key={p.id} className={`product-card ${p.stock <= 0 ? 'out-of-stock' : ''}`}>
                  <div className="product-image-wrap">
                    <div className="product-image-placeholder">
                      <i className="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    {p.stock <= 0 && <div className="stock-overlay">Rupture de stock</div>}
                    {p.stock > 0 && p.stock <= 3 && (
                      <div className="stock-badge-low">
                        <i className="fa-solid fa-fire"></i> Dernières pièces
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    {p.categorie_nom && (
                      <span className="product-category">{p.categorie_nom}</span>
                    )}
                    <h3 className="product-name">{p.nom}</h3>
                    {(p.marque || p.modele) && (
                      <p className="product-model">{[p.marque, p.modele].filter(Boolean).join(' · ')}</p>
                    )}
                    {p.description && (
                      <p className="product-desc">{p.description.slice(0, 80)}{p.description.length > 80 ? '...' : ''}</p>
                    )}
                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price-main">{parseFloat(p.prix_vente).toFixed(2)} €</span>
                        {p.garantie_mois && <span className="price-garantie"><i className="fa-solid fa-shield-halved"></i> {p.garantie_mois} mois</span>}
                      </div>
                      <div className="product-actions-row">
                        <button
                          className="btn-detail"
                          onClick={() => setSelectedProduct(p)}
                          disabled={p.stock <= 0}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn-whatsapp"
                          onClick={() => handleWhatsApp(p)}
                          disabled={p.stock <= 0}
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                          {p.stock <= 0 ? 'Indisponible' : 'Commander'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CONTACT BAR ===== */}
      <section className="vitrine-contact">
        <div className="vitrine-container">
          <div className="contact-bar">
            <div className="contact-info">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <div className="contact-label">Notre adresse</div>
                <div className="contact-value">Votre adresse magasin</div>
              </div>
            </div>
            <div className="contact-info">
              <i className="fa-solid fa-clock"></i>
              <div>
                <div className="contact-label">Horaires</div>
                <div className="contact-value">Lun – Sam : 9h – 19h</div>
              </div>
            </div>
            <div className="contact-info">
              <i className="fa-solid fa-phone"></i>
              <div>
                <div className="contact-label">Téléphone</div>
                <div className="contact-value">+212 6 00 00 00 00</div>
              </div>
            </div>
            <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="btn-wa-main">
              <i className="fa-brands fa-whatsapp"></i> Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedProduct(null)}>
          <div className="modal" style={{maxWidth:520}}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-mobile-screen-button"></i> {selectedProduct.nom}</h3>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <div className="detail-image">
                <i className="fa-solid fa-mobile-screen-button"></i>
              </div>
              {selectedProduct.categorie_nom && <span className="badge badge-purple">{selectedProduct.categorie_nom}</span>}
              {selectedProduct.marque && (
                <div className="detail-row"><span>Marque</span><strong>{selectedProduct.marque}</strong></div>
              )}
              {selectedProduct.modele && (
                <div className="detail-row"><span>Modèle</span><strong>{selectedProduct.modele}</strong></div>
              )}
              {selectedProduct.capacite && (
                <div className="detail-row"><span>Capacité</span><strong>{selectedProduct.capacite}</strong></div>
              )}
              {selectedProduct.couleur && (
                <div className="detail-row"><span>Couleur</span><strong>{selectedProduct.couleur}</strong></div>
              )}
              <div className="detail-row">
                <span>Disponibilité</span>
                <strong style={{color: selectedProduct.stock > 0 ? 'var(--accent-green)' : 'var(--accent-red)'}}>
                  {selectedProduct.stock > 0 ? `${selectedProduct.stock} en stock` : 'Rupture de stock'}
                </strong>
              </div>
              {selectedProduct.garantie_mois && (
                <div className="detail-row"><span>Garantie</span><strong>{selectedProduct.garantie_mois} mois</strong></div>
              )}
              {selectedProduct.description && (
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <p style={{color:'var(--text-secondary)', fontSize:'0.875rem', lineHeight:1.6}}>{selectedProduct.description}</p>
                </div>
              )}
              <div className="detail-price">{parseFloat(selectedProduct.prix_vente).toFixed(2)} €</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Fermer</button>
              <button className="btn-wa-main" style={{padding:'10px 20px'}} onClick={() => handleWhatsApp(selectedProduct)}>
                <i className="fa-brands fa-whatsapp"></i> Commander via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vitrine
