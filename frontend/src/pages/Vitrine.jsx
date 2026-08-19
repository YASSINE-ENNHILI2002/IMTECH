import { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import Logo from '../components/Logo'
import './Vitrine.css'

// Curated high-fidelity Unsplash images for smartphones, laptops, tablets, and accessories.
const PRODUCT_MOCK_IMAGES = {
  phone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', // Angle 1: Front
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', // Angle 2: Back
    'https://images.unsplash.com/photo-1565849906660-bf47e125f195?w=600&auto=format&fit=crop&q=80', // Angle 3: Side close-up
    'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=600&auto=format&fit=crop&q=80'  // Angle 4: Lifestyle/Handheld
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=600&auto=format&fit=crop&q=80', // Angle 1: Keyboard & Screen open
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80', // Angle 2: Close-up angled view
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80', // Angle 3: Sleek side profile
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80'  // Angle 4: Desk setup view
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80', // Angle 1: Screen view
    'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=600&auto=format&fit=crop&q=80', // Angle 2: Stand view
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80', // Angle 3: Angled side view
  ],
  accessory: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', // Angle 1: Headphones main
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80', // Angle 2: Detail profile
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'  // Angle 3: Presentation view
  ]
}

function Vitrine() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Keep track of active image index in card carousels (keyed by product ID)
  const [carouselIndices, setCarouselIndices] = useState({})
  // Track active image in modal details
  const [modalImageIndex, setModalImageIndex] = useState(0)

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const r = await productsAPI.getPublicCatalog()
      setProducts(r.data)
      const cats = [...new Set(r.data.map(p => p.categorie_nom).filter(Boolean))]
      setCategories(cats)
    } catch (e) { 
      console.error('Error fetching public catalog:', e) 
    } finally { 
      setLoading(false) 
    }
  }

  // Helper to determine product type and retrieve multiple angles
  const getProductImages = (product) => {
    const searchString = (product.nom + ' ' + (product.categorie_nom || '')).toLowerCase()
    
    let pool = PRODUCT_MOCK_IMAGES.accessory
    if (
      searchString.includes('téléphone') || 
      searchString.includes('phone') || 
      searchString.includes('mobile') || 
      searchString.includes('iphone') || 
      searchString.includes('samsung') || 
      searchString.includes('redmi')
    ) {
      pool = PRODUCT_MOCK_IMAGES.phone
    } else if (
      searchString.includes('ordinateur') || 
      searchString.includes('pc') || 
      searchString.includes('laptop') || 
      searchString.includes('macbook') || 
      searchString.includes('asus') || 
      searchString.includes('dell')
    ) {
      pool = PRODUCT_MOCK_IMAGES.laptop
    } else if (
      searchString.includes('tablette') || 
      searchString.includes('ipad') || 
      searchString.includes('tablet')
    ) {
      pool = PRODUCT_MOCK_IMAGES.tablet
    }

    if (product.image_url) {
      return [product.image_url, ...pool]
    }
    return pool
  }

  // Handle carousel navigation on card
  const handlePrevImage = (e, productId, imagesCount) => {
    e.stopPropagation()
    setCarouselIndices(prev => {
      const currentIndex = prev[productId] || 0
      const nextIndex = currentIndex === 0 ? imagesCount - 1 : currentIndex - 1
      return { ...prev, [productId]: nextIndex }
    })
  }

  const handleNextImage = (e, productId, imagesCount) => {
    e.stopPropagation()
    setCarouselIndices(prev => {
      const currentIndex = prev[productId] || 0
      const nextIndex = currentIndex === imagesCount - 1 ? 0 : currentIndex + 1
      return { ...prev, [productId]: nextIndex }
    })
  }

  const openDetailsModal = (product) => {
    setSelectedProduct(product)
    setModalImageIndex(0)
  }

  const filtered = products.filter(p => {
    const q = searchTerm.toLowerCase()
    const matchCategory = !selectedCategory || p.categorie_nom === selectedCategory
    
    // Support quick filters like "Occasion" and "PC"
    const isOccasionSearch = q.includes('occasion') || q.includes('refurbished') || q.includes('reconditionne')
    const matchesQuickType = isOccasionSearch 
      ? p.type_stock === 'UNIQUE_IMEI'
      : true

    const matchesSearch = 
      p.nom.toLowerCase().includes(q) || 
      (p.marque || '').toLowerCase().includes(q) || 
      (p.modele || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)

    return matchCategory && matchesQuickType && matchesSearch
  })

  const handleWhatsApp = (p, selectedIndex = 0) => {
    const phone = '212600000000'
    const images = getProductImages(p)
    const activeImage = images[selectedIndex] || ''
    
    let msg = `Bonjour IMTECH !\n`
    msg += `Je souhaite réserver le produit suivant :\n\n`
    msg += `📱 *${p.nom}*\n`
    if (p.marque) msg += `• Marque : ${p.marque}\n`
    if (p.modele) msg += `• Modèle : ${p.modele}\n`
    if (p.capacite) msg += `• Capacité : ${p.capacite}\n`
    if (p.couleur) msg += `• Couleur : ${p.couleur}\n`
    if (p.type_stock === 'UNIQUE_IMEI') msg += `• État : Occasion certifiée Grade A\n`
    msg += `💰 *Prix : ${parseFloat(p.prix_vente).toFixed(2)} €*\n\n`
    msg += `Lien Photo : ${activeImage}\n\n`
    msg += `Est-il toujours disponible en magasin ? Merci !`

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // Helper to resolve icon for category
  const getCategoryIcon = (catName) => {
    const name = catName.toLowerCase()
    if (name.includes('phone') || name.includes('téléphone') || name.includes('smartphone')) return 'fa-solid fa-mobile-screen'
    if (name.includes('pc') || name.includes('ordinateur') || name.includes('laptop')) return 'fa-solid fa-laptop'
    if (name.includes('accessoire') || name.includes('chargeur') || name.includes('écouteur')) return 'fa-solid fa-headphones'
    if (name.includes('tablette') || name.includes('ipad')) return 'fa-solid fa-tablet-screen-button'
    return 'fa-solid fa-tags'
  }

  return (
    <div className="vitrine-page">
      {/* ===== VITRINE NAV ===== */}
      <nav className="vitrine-nav">
        <div className="vitrine-nav-container">
          <div className="vitrine-brand">
            <Logo width={32} height={32} />
            <div>
              <span className="vitrine-brand-name">IMTECH</span>
              <span className="vitrine-brand-sub">Showroom Digital</span>
            </div>
          </div>
          <div className="vitrine-nav-actions">
            <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="nav-contact-btn">
              <i className="fa-brands fa-whatsapp"></i>
              <span>Des questions ?</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="vitrine-hero">
        <div className="hero-grid-decor"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-mobile-screen-button"></i> Smartphones Occasion & PC
          </div>
          <h1 className="hero-title">Trouvez votre prochain appareil au meilleur prix</h1>
          <p className="hero-subtitle">
            Découvrez notre catalogue de téléphones d'occasion testés, d'ordinateurs portables performants, de tablettes et d'accessoires premium garantis.
          </p>
          <div className="hero-features-chips">
            <span className="feat-chip"><i className="fa-solid fa-shield-check"></i> Garantie 12 mois</span>
            <span className="feat-chip"><i className="fa-solid fa-circle-check"></i> 100% Fonctionnel</span>
            <span className="feat-chip"><i className="fa-solid fa-truck-fast"></i> Réservation WhatsApp</span>
          </div>
        </div>
      </header>

      {/* ===== FILTERS & GRID MAIN CONTAINER ===== */}
      <main className="vitrine-main">
        <div className="vitrine-layout-container">
          
          {/* Left Sidebar Filters - Desktop */}
          <aside className="vitrine-sidebar">
            <div className="sidebar-widget">
              <h3 className="widget-title">Recherche</h3>
              <div className="sidebar-search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Marque, modèle, spec..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">Catégories</h3>
              <div className="sidebar-cat-list">
                <button
                  className={`sidebar-cat-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  <i className="fa-solid fa-border-all"></i>
                  <span>Toutes les catégories</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`sidebar-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <i className={getCategoryIcon(cat)}></i>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">Filtre Rapide</h3>
              <button
                className={`sidebar-cat-btn ${searchTerm === 'occasion' ? 'active' : ''}`}
                onClick={() => setSearchTerm(searchTerm === 'occasion' ? '' : 'occasion')}
              >
                <i className="fa-solid fa-stars"></i>
                <span>✨ Appareils Occasion</span>
              </button>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <section className="vitrine-catalog-area">
            {/* Mobile-only Search and category slide */}
            <div className="mobile-search-filter">
              <div className="sidebar-search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Rechercher marque, modèle..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mobile-cats-scroll">
                <button
                  className={`mobile-cat-chip ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  Tout
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`mobile-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="catalog-header-meta">
              <div className="catalog-results-count">
                <strong>{filtered.length}</strong> produit{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? (
              <div className="vitrine-loader-wrap">
                <div className="spinner"></div>
                <span>Chargement des offres en cours...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="vitrine-empty-wrap">
                <i className="fa-solid fa-box-open"></i>
                <h4>Aucun appareil trouvé</h4>
                <p>Essayez d'ajuster vos critères de recherche ou sélectionnez une autre catégorie.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => {
                  const images = getProductImages(p)
                  const activeImgIndex = carouselIndices[p.id] || 0
                  const isOccasion = p.type_stock === 'UNIQUE_IMEI'

                  return (
                    <div key={p.id} className={`product-card ${p.stock <= 0 ? 'out-of-stock' : ''}`}>
                      {/* Carousel Header Area */}
                      <div className="product-image-carousel">
                        <img 
                          src={images[activeImgIndex]} 
                          alt={p.nom} 
                          className="product-carousel-img" 
                          onClick={() => openDetailsModal(p)}
                        />
                        {/* Carousel Arrows */}
                        {images.length > 1 && (
                          <>
                            <button 
                              className="carousel-arrow prev" 
                              onClick={(e) => handlePrevImage(e, p.id, images.length)}
                            >
                              <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button 
                              className="carousel-arrow next" 
                              onClick={(e) => handleNextImage(e, p.id, images.length)}
                            >
                              <i className="fa-solid fa-chevron-right"></i>
                            </button>
                            {/* Carousel Indicators dots */}
                            <div className="carousel-dots">
                              {images.map((_, idx) => (
                                <span 
                                  key={idx} 
                                  className={`carousel-dot ${idx === activeImgIndex ? 'active' : ''}`}
                                ></span>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Custom tags */}
                        {isOccasion && <div className="product-badge occasion">✨ Occasion</div>}
                        {p.stock <= 0 && <div className="product-badge out-of-stock">Rupture</div>}
                        {p.stock > 0 && p.stock <= 3 && (
                          <div className="product-badge low-stock">
                            <i className="fa-solid fa-fire"></i> Stock Faible
                          </div>
                        )}
                      </div>

                      {/* Info Area */}
                      <div className="product-card-body">
                        <div className="product-card-meta">
                          <span className="product-card-category">{p.categorie_nom}</span>
                          {p.garantie_mois && (
                            <span className="product-card-garantie">Garantie {p.garantie_mois}m</span>
                          )}
                        </div>
                        <h3 className="product-card-title" onClick={() => openDetailsModal(p)}>{p.nom}</h3>
                        
                        {(p.marque || p.modele) && (
                          <p className="product-card-specs">
                            {[p.marque, p.modele, p.capacite, p.couleur].filter(Boolean).join(' · ')}
                          </p>
                        )}

                        <div className="product-card-footer">
                          <div className="product-card-price">
                            {parseFloat(p.prix_vente).toFixed(2)} €
                          </div>
                          <div className="product-card-actions">
                            <button
                              className="card-btn-view"
                              onClick={() => openDetailsModal(p)}
                              title="Fiche technique & Photos"
                            >
                              <i className="fa-solid fa-eye"></i> Infos
                            </button>
                            <button
                              className="card-btn-buy"
                              onClick={() => handleWhatsApp(p, activeImgIndex)}
                              disabled={p.stock <= 0}
                            >
                              <i className="fa-brands fa-whatsapp"></i> Commander
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ===== FOOTER CONTACT BAR ===== */}
      <footer className="vitrine-footer">
        <div className="vitrine-footer-container">
          <div className="footer-grid">
            <div className="footer-info-card">
              <i className="fa-solid fa-location-dot"></i>
              <h4>Notre Boutique</h4>
              <p>Adresse Magasin IMTECH</p>
              <p>Maroc / France</p>
            </div>
            <div className="footer-info-card">
              <i className="fa-solid fa-clock"></i>
              <h4>Heures d'ouverture</h4>
              <p>Lundi au Samedi</p>
              <p>De 09h00 à 19h00</p>
            </div>
            <div className="footer-info-card">
              <i className="fa-solid fa-phone"></i>
              <h4>Contactez-nous</h4>
              <p>WhatsApp direct en un clic</p>
              <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="footer-wa-link">
                +212 6 00 00 00 00
              </a>
            </div>
          </div>
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} IMTECH. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* ===== SPLIT IMAGE/SPECS DETAIL MODAL ===== */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedProduct(null)}>
          <div className="vitrine-detail-modal">
            <div className="detail-modal-header">
              <h3>Détails de l'article</h3>
              <button className="detail-modal-close" onClick={() => setSelectedProduct(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="detail-modal-content">
              {/* Left Side: Images carousel and thumbnails */}
              <div className="detail-left-gallery">
                <div className="detail-main-img-wrap">
                  <img 
                    src={getProductImages(selectedProduct)[modalImageIndex]} 
                    alt={selectedProduct.nom}
                    className="detail-main-img"
                  />
                </div>
                <div className="detail-thumbnails-strip">
                  {getProductImages(selectedProduct).map((imgUrl, index) => (
                    <button
                      key={index}
                      className={`thumbnail-btn ${index === modalImageIndex ? 'active' : ''}`}
                      onClick={() => setModalImageIndex(index)}
                    >
                      <img src={imgUrl} alt={`angle-${index}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side: Detailed specs list */}
              <div className="detail-right-specs">
                <div className="specs-header">
                  {selectedProduct.type_stock === 'UNIQUE_IMEI' && (
                    <span className="specs-badge">✨ Appareil d'occasion certifié</span>
                  )}
                  <h2 className="specs-title">{selectedProduct.nom}</h2>
                  <div className="specs-price">{parseFloat(selectedProduct.prix_vente).toFixed(2)} €</div>
                </div>

                <div className="specs-grid-table">
                  {selectedProduct.categorie_nom && (
                    <div className="specs-row"><span>Catégorie</span><strong>{selectedProduct.categorie_nom}</strong></div>
                  )}
                  {selectedProduct.marque && (
                    <div className="specs-row"><span>Marque</span><strong>{selectedProduct.marque}</strong></div>
                  )}
                  {selectedProduct.modele && (
                    <div className="specs-row"><span>Modèle</span><strong>{selectedProduct.modele}</strong></div>
                  )}
                  {selectedProduct.capacite && (
                    <div className="specs-row"><span>Stockage</span><strong>{selectedProduct.capacite}</strong></div>
                  )}
                  {selectedProduct.couleur && (
                    <div className="specs-row"><span>Couleur</span><strong>{selectedProduct.couleur}</strong></div>
                  )}
                  <div className="specs-row">
                    <span>Garantie</span>
                    <strong>{selectedProduct.garantie_mois || 12} mois</strong>
                  </div>
                  <div className="specs-row">
                    <span>Disponibilité</span>
                    <strong style={{color: selectedProduct.stock > 0 ? '#10b981' : '#ef4444'}}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} en stock` : 'Rupture de stock'}
                    </strong>
                  </div>
                </div>

                {selectedProduct.description && (
                  <div className="specs-description">
                    <h4>Description</h4>
                    <p>{selectedProduct.description}</p>
                  </div>
                )}

                <div className="specs-actions">
                  <button 
                    className="specs-btn-wa" 
                    onClick={() => handleWhatsApp(selectedProduct, modalImageIndex)}
                    disabled={selectedProduct.stock <= 0}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>Réserver sur WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vitrine
