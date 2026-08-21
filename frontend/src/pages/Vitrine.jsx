import { useState, useEffect, useRef, useCallback } from 'react'
import { productsAPI } from '../services/api'
import Logo from '../components/Logo'
import './Vitrine.css'

/* ─── Mock images per type ─── */
const IMGS = {
  phone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849906660-bf47e125f195?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=600&auto=format&fit=crop&q=80',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80',
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
  ],
  accessory: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  ],
}

const WHATSAPP_PHONE = '212634825368'

function getImages(product) {
  const s = (product.nom + ' ' + (product.categorie_nom || '')).toLowerCase()
  if (/téléphone|phone|mobile|iphone|samsung|xiaomi|redmi|oppo/.test(s)) return IMGS.phone
  if (/ordinateur|pc|laptop|macbook|asus|dell|lenovo|hp/.test(s)) return IMGS.laptop
  if (/tablette|ipad|tablet/.test(s)) return IMGS.tablet
  return IMGS.accessory
}

/* ─── Animated counter hook ─── */
function useCounter(target, isVisible) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const duration = 1800
    const step = (target / duration) * 16
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [isVisible, target])
  return count
}

/* ─── Intersection observer hook ─── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ─── Particle generator ─── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 3 + Math.random() * 8,
  left: `${5 + Math.random() * 90}%`,
  delay: `${Math.random() * 10}s`,
  duration: `${8 + Math.random() * 12}s`,
  color: i % 3 === 0 ? '#73be43' : i % 3 === 1 ? '#105a81' : '#1472a4',
}))

/* ─── TESTIMONIALS data ─── */
const TESTIMONIALS = [
  {
    id: 1,
    text: "J'ai acheté mon iPhone ici et le service était exceptionnel. Prix compétitifs et staff très professionnel. Je recommande vivement !",
    name: 'Karim B.',
    location: 'Marrakech, Guéliz',
    initials: 'KB',
    color: '#105a81',
  },
  {
    id: 2,
    text: "Réparation rapide de mon écran en moins de 2h ! Vraiment impressionnée par la qualité du travail. Mon téléphone est comme neuf.",
    name: 'Fatima Z.',
    location: 'Marrakech, Médina',
    initials: 'FZ',
    color: '#73be43',
  },
  {
    id: 3,
    text: "Meilleur magasin informatique de Marrakech ! J'ai trouvé mon PC portable au meilleur prix avec garantie. Merci I'mtech !",
    name: 'Younes M.',
    location: 'Marrakech, Hivernage',
    initials: 'YM',
    color: '#f59e0b',
  },
]

/* ─── HOURS ─── */
const HOURS = [
  { day: 'Lundi – Samedi', time: '09h00 – 14h00 et 17h00 – 22h00' },
  { day: 'Dimanche', time: 'Fermé (Repos)' },
]

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function Vitrine() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalImgIdx, setModalImgIdx] = useState(0)
  const [carouselIdx, setCarouselIdx] = useState({})
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statsRef, statsVisible] = useReveal()

  /* scroll listener for navbar shadow */
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* load products */
  useEffect(() => {
    productsAPI.getPublicCatalog()
      .then(r => {
        setProducts(r.data)
        const cats = [...new Set(r.data.map(p => p.categorie_nom).filter(Boolean))]
        setCategories(cats)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  /* reveal cards via IntersectionObserver */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.product-card').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [products, selectedCategory, search])

  /* reveal generic sections */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [loading])

  /* Filtered products */
  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.categorie_nom === selectedCategory
    const q = search.toLowerCase()
    const matchSearch = !q || p.nom.toLowerCase().includes(q) || (p.marque || '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  /* WhatsApp message */
  const openWhatsApp = (product, imgIdx = 0) => {
    const imgs = getImages(product)
    let msg = `Bonjour I'mtech ! 👋\n`
    msg += `Je suis intéressé(e) par :\n\n`
    msg += `📱 *${product.nom}*\n`
    if (product.marque) msg += `• Marque : ${product.marque}\n`
    if (product.modele) msg += `• Modèle : ${product.modele}\n`
    if (product.capacite) msg += `• Capacité : ${product.capacite}\n`
    if (product.type_stock === 'UNIQUE_IMEI') msg += `• État : Occasion – Grade A certifié\n`
    msg += `💰 *Prix : ${parseFloat(product.prix_vente).toFixed(2)} MAD*\n\n`
    msg += `📸 Photo : ${imgs[imgIdx]}\n\n`
    msg += `Est-il disponible ? Merci !`
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  /* Carousel helpers */
  const setCardImg = (pid, idx) => setCarouselIdx(p => ({ ...p, [pid]: idx }))
  const nextCardImg = (e, product) => {
    e.stopPropagation()
    const imgs = getImages(product)
    const cur = carouselIdx[product.id] || 0
    setCardImg(product.id, (cur + 1) % imgs.length)
  }
  const prevCardImg = (e, product) => {
    e.stopPropagation()
    const imgs = getImages(product)
    const cur = carouselIdx[product.id] || 0
    setCardImg(product.id, (cur - 1 + imgs.length) % imgs.length)
  }

  /* Open modal */
  const openModal = (product) => {
    setSelectedProduct(product)
    setModalImgIdx(0)
    document.body.style.overflow = 'hidden'
  }
  const closeModal = () => {
    setSelectedProduct(null)
    document.body.style.overflow = ''
  }

  const c1 = useCounter(5, statsVisible)
  const c2 = useCounter(1200, statsVisible)
  const c3 = useCounter(30, statsVisible)
  const c4 = useCounter(98, statsVisible)

  return (
    <div className="vitrine-root">

      {/* ─── FLOATING WHATSAPP ─── */}
      <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noreferrer" className="wa-float-btn" title="Contactez-nous sur WhatsApp">
        <i className="fa-brands fa-whatsapp" />
      </a>

      {/* ─── NAVBAR ─── */}
      <nav className={`vt-nav${navScrolled ? ' scrolled' : ''}`}>
        <div className="vt-nav-inner">
          <div className="vt-nav-logo">
            <Logo width={130} height={42} />
          </div>
          <ul className="vt-nav-links">
            <li><a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero') }}>Accueil</a></li>
            <li><a href="#catalog" onClick={e => { e.preventDefault(); scrollTo('catalog') }}>Produits</a></li>
            <li><a href="#occasion" onClick={e => { e.preventDefault(); setSelectedCategory('all'); scrollTo('catalog') }}>Occasion</a></li>
            <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact') }}>Contact</a></li>
          </ul>
          <div className="vt-nav-actions">
            <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noreferrer" className="btn-wa-nav">
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </a>
          </div>
          <button className="vt-burger" onClick={() => setMobileMenuOpen(v => !v)}>
            <i className={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="vt-mobile-menu">
          <a onClick={() => scrollTo('hero')}>Accueil</a>
          <a onClick={() => scrollTo('catalog')}>Produits</a>
          <a onClick={() => scrollTo('contact')}>Contact</a>
          <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noreferrer" style={{ color: '#25d366', fontWeight: 700 }}>
            <i className="fa-brands fa-whatsapp" /> WhatsApp
          </a>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="vt-hero" id="hero">
        {/* Particles */}
        <div className="hero-particles">
          {PARTICLES.map(p => (
            <div key={p.id} className="hero-particle" style={{
              width: p.size, height: p.size,
              left: p.left, bottom: '-20px',
              background: p.color,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }} />
          ))}
        </div>
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-grid" />

        <div className="hero-content-wrap">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Marrakech – Votre Solution Informatique
            </div>

            <h1 className="hero-title">
              Téléphones &<br />
              <span className="ht-brand">PC à Marrakech</span>
            </h1>

            <p className="hero-subtitle">
              Neuf, occasion certifiée ou réparation express — 
              <strong style={{ color: '#73be43' }}> i'm tech</strong> est votre partenaire 
              informatique de confiance à Marrakech depuis 2019.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo('catalog')}>
                <i className="fa-solid fa-store" /> Voir le Catalogue
              </button>
              <button className="btn-secondary" onClick={() => scrollTo('contact')}>
                <i className="fa-solid fa-location-dot" /> Nous Trouver
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">5+</span>
                <span className="hero-stat-label">Ans d'expérience</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">1200+</span>
                <span className="hero-stat-label">Clients satisfaits</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">30+</span>
                <span className="hero-stat-label">Marques dispo</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-phone-mockup">
              <div className="hero-phone-screen">
                <div className="hero-phone-logo-area">
                  <Logo width={100} height={32} dark={true} />
                  <p className="hero-phone-label">Showroom Digital</p>
                </div>
                <div className="hero-phone-price">dès 499 MAD</div>
                <p className="hero-phone-label">Téléphones · PC · Accessoires</p>
              </div>
            </div>
            {/* Floating info cards */}
            <div className="hero-floating-card fcard-1">
              <div className="hero-floating-card-icon" style={{ background: 'rgba(115,190,67,0.12)' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#73be43' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Garantie offerte</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Sur tous les produits</div>
              </div>
            </div>
            <div className="hero-floating-card fcard-2">
              <div className="hero-floating-card-icon" style={{ background: 'rgba(37,211,102,0.1)' }}>
                <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>Réponse rapide</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Sur WhatsApp</div>
              </div>
            </div>
            <div className="hero-floating-card fcard-3">
              <div className="hero-floating-card-icon" style={{ background: 'rgba(16,90,129,0.1)' }}>
                <i className="fa-solid fa-star" style={{ color: '#105a81' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>4.9 / 5</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>200+ avis Google</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Défiler</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="vt-section vt-features">
        <div className="vt-section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Pourquoi nous choisir</span>
            <h2 className="section-title">Votre confiance, <span>notre priorité</span></h2>
            <p className="section-subtitle">Plus de 5 ans d'expertise informatique au service des habitants de Marrakech.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: 'fa-shield-halved', color: '#105a81', bg: 'rgba(16,90,129,0.08)', title: 'Garantie incluse', desc: 'Tous nos produits neufs bénéficient d\'une garantie constructeur. Occasion certifiée avec garantie boutique.' },
              { icon: 'fa-wrench', color: '#73be43', bg: 'rgba(115,190,67,0.08)', title: 'Réparation Express', desc: 'Écran cassé, batterie, logiciel... Réparation en 2h dans notre boutique par des techniciens certifiés.' },
              { icon: 'fa-tag', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Meilleurs Prix', desc: 'Prix compétitifs sur toute notre gamme. Occasion soigneusement sélectionnée et testée à prix imbattable.' },
              { icon: 'fa-headset', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', title: 'Support Client', desc: 'Notre équipe répond à vos questions 7j/7 via WhatsApp. Conseil personnalisé avant et après achat.' },
            ].map((f, i) => (
              <div key={i} className={`feature-card reveal reveal-delay-${i + 1}`}>
                <div className="feature-icon" style={{ background: f.bg }}>
                  <i className={`fa-solid ${f.icon}`} style={{ color: f.color }} />
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="vt-stats" ref={statsRef}>
        <div className="stats-grid">
          {[
            { icon: 'fa-calendar-check', num: c1, suffix: '+', label: 'Années d\'expérience' },
            { icon: 'fa-users', num: c2, suffix: '+', label: 'Clients satisfaits' },
            { icon: 'fa-box-open', num: c3, suffix: '+', label: 'Marques disponibles' },
            { icon: 'fa-star', num: c4, suffix: '%', label: 'Clients recommandent' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <i className={`fa-solid ${s.icon} stat-icon`} />
              <div className="stat-number">{s.num.toLocaleString('fr-MA')}<span className="stat-suffix">{s.suffix}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATALOG ─── */}
      <section className="vt-section vt-catalog" id="catalog">
        <div className="vt-section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Notre Catalogue</span>
            <h2 className="section-title">Téléphones, PC & <span>Accessoires</span></h2>
            <p className="section-subtitle">Produits neufs et occasion certifiée — récupérés directement de notre stock en temps réel.</p>
          </div>

          {/* Search */}
          <div className="catalog-search-row">
            <i className="fa-solid fa-search" />
            <input
              className="catalog-search-input"
              type="text"
              placeholder="Rechercher un produit, marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="catalog-filter-bar">
            <button className={`filter-chip${selectedCategory === 'all' ? ' active' : ''}`} onClick={() => setSelectedCategory('all')}>
              <i className="fa-solid fa-border-all" /> Tout voir
            </button>
            {categories.map(cat => (
              <button key={cat} className={`filter-chip${selectedCategory === cat ? ' active' : ''}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="products-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton-line w70" />
                    <div className="skeleton-line w90" />
                    <div className="skeleton-line w50" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {filtered.length === 0 && (
                <div className="catalog-empty">
                  <i className="fa-solid fa-box-open" />
                  <p>Aucun produit trouvé. Essayez une autre recherche.</p>
                </div>
              )}
              {filtered.map((product, index) => {
                const imgs = getImages(product)
                const imgIdx = carouselIdx[product.id] || 0
                const isOccasion = product.type_stock === 'UNIQUE_IMEI'
                const inStock = product.quantite_stock > 0
                return (
                  <article
                    key={product.id}
                    className="product-card"
                    style={{ animationDelay: `${(index % 6) * 0.08}s` }}
                    onClick={() => openModal(product)}
                  >
                    {/* Image zone */}
                    <div className="pc-image-zone">
                      <img className="pc-img" src={imgs[imgIdx]} alt={product.nom} loading="lazy" />

                      {/* Arrows */}
                      {imgs.length > 1 && (
                        <>
                          <button className="pc-arrow pc-arrow-left" onClick={e => prevCardImg(e, product)}>
                            <i className="fa-solid fa-chevron-left" />
                          </button>
                          <button className="pc-arrow pc-arrow-right" onClick={e => nextCardImg(e, product)}>
                            <i className="fa-solid fa-chevron-right" />
                          </button>
                        </>
                      )}

                      {/* Dots */}
                      {imgs.length > 1 && (
                        <div className="pc-dots">
                          {imgs.map((_, i) => (
                            <button
                              key={i}
                              className={`pc-dot${i === imgIdx ? ' active' : ''}`}
                              onClick={e => { e.stopPropagation(); setCardImg(product.id, i) }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Badges */}
                      <div className="pc-badges">
                        {isOccasion && <span className="pc-badge pc-badge-occasion">Occasion</span>}
                        {!inStock && <span className="pc-badge pc-badge-stock">Épuisé</span>}
                        {!isOccasion && inStock && <span className="pc-badge pc-badge-new">Neuf</span>}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="pc-body">
                      {product.categorie_nom && <div className="pc-category">{product.categorie_nom}</div>}
                      <div className="pc-title">{product.nom}</div>
                      {(product.marque || product.capacite) && (
                        <div className="pc-specs">
                          {[product.marque, product.modele, product.capacite].filter(Boolean).join(' · ')}
                        </div>
                      )}
                      <div className="pc-footer">
                        <div className="pc-price">
                          {parseFloat(product.prix_vente).toFixed(0)}<span className="pc-currency"> MAD</span>
                        </div>
                        <div className="pc-actions">
                          <button className="btn-pc-detail" onClick={e => { e.stopPropagation(); openModal(product) }}>
                            <i className="fa-solid fa-eye" />
                          </button>
                          <button
                            className="btn-pc-wa"
                            disabled={!inStock}
                            onClick={e => { e.stopPropagation(); openWhatsApp(product, imgIdx) }}
                          >
                            <i className="fa-brands fa-whatsapp" /> Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="vt-section vt-testimonials">
        <div className="vt-section-inner">
          <div className="section-header reveal">
            <span className="section-tag">Avis Clients</span>
            <h2 className="section-title">Ce que disent <span>nos clients</span></h2>
            <p className="section-subtitle">Plus de 200 avis vérifiés sur Google Maps. La satisfaction, c'est notre engagement.</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                <div className="tc-stars">
                  {[...Array(5)].map((_, j) => <i key={j} className="fa-solid fa-star tc-star" />)}
                </div>
                <p className="tc-text">"{t.text}"</p>
                <div className="tc-author">
                  <div className="tc-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-location"><i className="fa-solid fa-location-dot" style={{ marginRight: 4 }} />{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATION / MAPS ─── */}
      <section className="vt-section vt-location" id="contact">
        <div className="vt-section-inner">

          {/* ─── SHOP PHOTOS GALLERY ─── */}
          <div className="shop-gallery-row reveal">
            <div className="shop-gallery-label">
              <span className="section-tag">Notre Boutique</span>
              <h2 className="section-title">Venez nous <span>rendre visite</span></h2>
              <p className="section-subtitle">Un espace accueillant au cœur de Marrakech, avec des centaines de produits disponibles immédiatement.</p>
              <a
                href="https://share.google/k0hNVuOUe97JCCsVO"
                target="_blank"
                rel="noreferrer"
                className="btn-directions"
              >
                <i className="fa-solid fa-diamond-turn-right" /> Voir sur Google Maps
              </a>
            </div>
            <div className="shop-gallery-imgs">
              <div className="shop-img-main">
                <img src="/boutique1.webp" alt="Boutique I'm Tech Marrakech" loading="lazy" />
                <div className="shop-img-badge">
                  <i className="fa-solid fa-store" /> Notre Magasin
                </div>
              </div>
              <div className="shop-img-secondary">
                <img src="/boutique2.webp" alt="Intérieur boutique I'm Tech" loading="lazy" />
                <div className="shop-img-overlay">
                  <i className="fa-solid fa-map-pin" /> Marrakech, Maroc
                </div>
              </div>
            </div>
          </div>

          <div className="location-grid">
            {/* MAP */}
            <div className="map-embed-wrap reveal">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13583.8!2d-7.9811!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zaTptIHRlY2ggbWFycmFrZWNo!5e0!3m2!1sfr!2sma!4v1692000000000!5m2!1sfr!2sma&q=i%27m+tech+marrakech"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="I'm Tech Marrakech - Localisation"
              />
            </div>

            {/* INFO */}
            <div className="location-info">
              <div className="location-info-header reveal">
                <h2>Trouvez-nous à <span style={{ color: '#105a81' }}>Marrakech</span></h2>
                <p>Nous sommes au cœur de Marrakech pour vous accueillir, vous conseiller et vous proposer le meilleur en informatique.</p>
              </div>

              <div className="contact-cards">
                {[
                  { icon: 'fa-location-dot', color: '#105a81', bg: 'rgba(16,90,129,0.08)', label: 'Adresse', value: 'Marrakech, Maroc', href: 'https://share.google/k0hNVuOUe97JCCsVO' },
                  { icon: 'fa-phone', color: '#73be43', bg: 'rgba(115,190,67,0.08)', label: 'Téléphone', value: '06 34 82 53 68', href: 'tel:+212634825368' },
                  { icon: 'fa-envelope', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Email', value: 'contact@imtech.ma', href: 'mailto:contact@imtech.ma' },
                ].map((c, i) => (
                  <a key={i} className={`contact-card reveal reveal-delay-${i + 1}`} href={c.href} target="_blank" rel="noreferrer">
                    <div className="cc-icon" style={{ background: c.bg }}>
                      <i className={`fa-solid ${c.icon}`} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="cc-label">{c.label}</div>
                      <div className="cc-value">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="hours-card reveal">
                <h4><i className="fa-solid fa-clock" style={{ marginRight: 6 }} />Horaires d'ouverture</h4>
                {HOURS.map((h, i) => (
                  <div key={i} className="hours-row">
                    <span className="hours-day">{h.day}</span>
                    <span className="hours-time" style={h.day === 'Dimanche' ? { color: '#ef4444', fontWeight: 600 } : {}}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="vt-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo width={140} height={46} dark={true} />
            <p className="footer-brand-desc">
              Votre solution informatique à Marrakech — téléphones, PC, tablettes, accessoires, 
              réparations et rachat d'appareils occasion.
            </p>
            <div className="footer-social">
              {[
                { icon: 'fa-facebook-f', href: '#' },
                { icon: 'fa-instagram', href: '#' },
                { icon: 'fa-tiktok', href: '#' },
                { icon: 'fa-whatsapp', href: `https://wa.me/${WHATSAPP_PHONE}` },
              ].map((s, i) => (
                <a key={i} className="social-btn" href={s.href} target="_blank" rel="noreferrer">
                  <i className={`fa-brands ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h5>Navigation</h5>
            <div className="footer-links">
              <a onClick={() => scrollTo('hero')}>Accueil</a>
              <a onClick={() => scrollTo('catalog')}>Catalogue</a>
              <a onClick={() => scrollTo('contact')}>Contact</a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Catégories</h5>
            <div className="footer-links">
              {categories.slice(0, 5).map(cat => (
                <a key={cat} onClick={() => { setSelectedCategory(cat); scrollTo('catalog') }}>{cat}</a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <div className="footer-links">
              <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noreferrer">
                <i className="fa-brands fa-whatsapp" /> WhatsApp
              </a>
              <a href="tel:+212634825368">
                <i className="fa-solid fa-phone" /> 06 34 82 53 68
              </a>
              <a href="mailto:contact@imtech.ma">
                <i className="fa-solid fa-envelope" /> contact@imtech.ma
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2024 <span>i'm tech</span> – Marrakech. Tous droits réservés.
          </p>
          <div className="footer-links-bottom">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
          </div>
        </div>
      </footer>

      {/* ─── MODAL PRODUIT ─── */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="modal-header">
              <span className="modal-title">{selectedProduct.nom}</span>
              <button className="modal-close" onClick={closeModal}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Modal body */}
            <div className="modal-body">
              {/* Gallery */}
              <div className="modal-gallery">
                <div className="modal-main-img-wrap">
                  <img
                    className="modal-main-img"
                    src={getImages(selectedProduct)[modalImgIdx]}
                    alt={selectedProduct.nom}
                  />
                </div>
                <div className="modal-thumbs">
                  {getImages(selectedProduct).map((img, i) => (
                    <button key={i} className={`modal-thumb-btn${i === modalImgIdx ? ' active' : ''}`} onClick={() => setModalImgIdx(i)}>
                      <img src={img} alt={`Vue ${i + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="modal-specs">
                {selectedProduct.categorie_nom && (
                  <span className="spec-category-tag">{selectedProduct.categorie_nom}</span>
                )}
                <h2 className="spec-prod-title">{selectedProduct.nom}</h2>
                <div className="spec-price">
                  {parseFloat(selectedProduct.prix_vente).toFixed(0)} MAD
                </div>

                <div className="spec-table">
                  {[
                    { label: 'Disponibilité', value: selectedProduct.quantite_stock > 0
                      ? <span className="spec-avail in-stock"><i className="fa-solid fa-circle-check" /> En stock</span>
                      : <span className="spec-avail out-stock"><i className="fa-solid fa-circle-xmark" /> Épuisé</span> },
                    selectedProduct.marque && { label: 'Marque', value: selectedProduct.marque },
                    selectedProduct.modele && { label: 'Modèle', value: selectedProduct.modele },
                    selectedProduct.capacite && { label: 'Capacité', value: selectedProduct.capacite },
                    selectedProduct.couleur && { label: 'Couleur', value: selectedProduct.couleur },
                    selectedProduct.type_stock === 'UNIQUE_IMEI' && { label: 'État', value: 'Occasion – Grade A certifié' },
                    selectedProduct.garantie_mois && { label: 'Garantie', value: `${selectedProduct.garantie_mois} mois` },
                  ].filter(Boolean).map((row, i) => (
                    <div key={i} className="spec-row">
                      <span className="spec-label">{row.label}</span>
                      <span className="spec-value">{row.value}</span>
                    </div>
                  ))}
                </div>

                {selectedProduct.description && (
                  <p className="spec-desc">{selectedProduct.description}</p>
                )}

                <div className="specs-actions">
                  <button
                    className="btn-wa-buy"
                    disabled={selectedProduct.quantite_stock <= 0}
                    onClick={() => openWhatsApp(selectedProduct, modalImgIdx)}
                  >
                    <i className="fa-brands fa-whatsapp" />
                    {selectedProduct.quantite_stock > 0 ? 'Réserver via WhatsApp' : 'Épuisé'}
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
