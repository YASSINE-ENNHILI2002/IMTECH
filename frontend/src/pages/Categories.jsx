import { useState, useEffect } from 'react'
import { categoriesAPI, productsAPI } from '../services/api'
import './Categories.css'

const ICONS = [
  'fa-mobile-screen', 'fa-laptop', 'fa-tablet-screen-button', 'fa-headphones',
  'fa-plug', 'fa-keyboard', 'fa-computer-mouse', 'fa-memory',
  'fa-hard-drive', 'fa-camera', 'fa-tv', 'fa-gamepad',
  'fa-print', 'fa-microchip', 'fa-battery-full', 'fa-cable-car',
  'fa-tags', 'fa-box-open', 'fa-star', 'fa-wrench',
]

const COLORS = [
  '#105a81', '#73be43', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6',
]

const EMPTY_FORM = { nom: '', description: '', icone: 'fa-tags', couleur: '#105a81' }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [cr, pr] = await Promise.all([categoriesAPI.getAll(), productsAPI.getAll()])
      setCategories(cr.data)
      setProducts(pr.data)
    } catch (e) {
      showToast('Erreur lors du chargement des données', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const productCountFor = (catId) =>
    products.filter(p => p.categorie === catId || p.categorie_nom === catId).length

  const openCreate = () => {
    setEditCat(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditCat(cat)
    setForm({
      nom: cat.nom || '',
      description: cat.description || '',
      icone: cat.icone || 'fa-tags',
      couleur: cat.couleur || '#105a81',
    })
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditCat(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nom.trim()) return
    setSaving(true)
    try {
      if (editCat) {
        await categoriesAPI.update(editCat.id, form)
        showToast(`Catégorie "${form.nom}" modifiée`)
      } else {
        await categoriesAPI.create(form)
        showToast(`Catégorie "${form.nom}" créée`)
      }
      closeModal()
      loadData()
    } catch (e) {
      showToast('Erreur lors de la sauvegarde', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (cat) => {
    if (!window.confirm(`Supprimer la catégorie "${cat.nom}" ? Les produits associés perdront leur catégorie.`)) return
    setDeleting(cat.id)
    try {
      await categoriesAPI.delete(cat.id)
      showToast(`Catégorie "${cat.nom}" supprimée`, 'info')
      loadData()
    } catch (e) {
      showToast('Impossible de supprimer cette catégorie', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = categories.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <span>Chargement des catégories...</span>
    </div>
  )

  return (
    <div className="cat-page">
      {/* ─── Toast ─── */}
      {toast && (
        <div className={`toast toast-${toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'success'}`}>
          <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark' : toast.type === 'info' ? 'fa-circle-info' : 'fa-circle-check'}`} />
          {toast.msg}
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="page-header">
        <div>
          <div className="page-title"><i className="fa-solid fa-tags" /> Catégories</div>
          <div className="page-subtitle">{categories.length} catégorie{categories.length !== 1 ? 's' : ''} — organisez votre inventaire</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="fa-solid fa-plus" /> Nouvelle catégorie
        </button>
      </div>

      {/* ─── Info bar ─── */}
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <i className="fa-solid fa-circle-info" />
        <span>Les catégories permettent de classer vos produits. Chaque produit appartient à une seule catégorie. Créez vos catégories ici avant d'ajouter des produits.</span>
      </div>

      {/* ─── Search ─── */}
      <div className="cat-search-bar">
        <div className="search-wrapper" style={{ flex: 1, maxWidth: 340 }}>
          <i className="fa-solid fa-search" />
          <input
            className="form-control search-input"
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="cat-count-chip">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ─── Grid ─── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-tags" />
          <h4>Aucune catégorie</h4>
          <p>Commencez par créer vos premières catégories (ex: Téléphones, Laptops, Accessoires)</p>
          <button className="btn btn-primary" onClick={openCreate}>
            <i className="fa-solid fa-plus" /> Créer la première catégorie
          </button>
        </div>
      ) : (
        <div className="cat-grid">
          {filtered.map(cat => {
            const count = productCountFor(cat.id)
            const color = cat.couleur || '#105a81'
            const icon = cat.icone || 'fa-tags'
            return (
              <div key={cat.id} className="cat-card" style={{ '--cat-color': color }}>
                <div className="cat-card-icon" style={{ background: `${color}15`, color }}>
                  <i className={`fa-solid ${icon}`} />
                </div>
                <div className="cat-card-body">
                  <div className="cat-card-name">{cat.nom}</div>
                  {cat.description && (
                    <div className="cat-card-desc">{cat.description}</div>
                  )}
                  <div className="cat-card-meta">
                    <span className="cat-product-count">
                      <i className="fa-solid fa-box-open" /> {count} produit{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="cat-card-actions">
                  <button
                    className="btn-icon"
                    onClick={() => openEdit(cat)}
                    title="Modifier"
                  >
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDelete(cat)}
                    disabled={deleting === cat.id}
                    title="Supprimer"
                  >
                    {deleting === cat.id
                      ? <i className="fa-solid fa-circle-notch fa-spin" />
                      : <i className="fa-solid fa-trash" />}
                  </button>
                </div>
              </div>
            )
          })}

          {/* ─── Quick create card ─── */}
          <button className="cat-add-card" onClick={openCreate}>
            <i className="fa-solid fa-plus" />
            <span>Nouvelle catégorie</span>
          </button>
        </div>
      )}

      {/* ─── Suggested categories ─── */}
      <div className="cat-suggestions">
        <div className="cat-suggestions-title">
          <i className="fa-solid fa-lightbulb" /> Suggestions de catégories pour un magasin informatique
        </div>
        <div className="cat-suggestions-chips">
          {[
            { nom: 'Téléphones', icone: 'fa-mobile-screen', couleur: '#105a81' },
            { nom: 'Laptops & PC', icone: 'fa-laptop', couleur: '#73be43' },
            { nom: 'Tablettes', icone: 'fa-tablet-screen-button', couleur: '#8b5cf6' },
            { nom: 'Accessoires', icone: 'fa-headphones', couleur: '#f59e0b' },
            { nom: 'Chargeurs', icone: 'fa-plug', couleur: '#ef4444' },
            { nom: 'Coques & Protections', icone: 'fa-shield-halved', couleur: '#14b8a6' },
            { nom: 'Pièces Détachées', icone: 'fa-wrench', couleur: '#64748b' },
            { nom: 'Gaming', icone: 'fa-gamepad', couleur: '#ec4899' },
          ].map(sug => {
            const exists = categories.some(c => c.nom.toLowerCase() === sug.nom.toLowerCase())
            return (
              <button
                key={sug.nom}
                className={`cat-sug-chip ${exists ? 'exists' : ''}`}
                disabled={exists}
                onClick={() => {
                  setForm({ nom: sug.nom, description: '', icone: sug.icone, couleur: sug.couleur })
                  setEditCat(null)
                  setShowModal(true)
                }}
              >
                <i className={`fa-solid ${sug.icone}`} style={{ color: sug.couleur }} />
                {sug.nom}
                {exists && <i className="fa-solid fa-check" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fa-solid fa-tags" />
                {editCat ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {/* Preview */}
                <div className="cat-modal-preview">
                  <div className="cat-card-icon" style={{ background: `${form.couleur}15`, color: form.couleur, width: 56, height: 56, fontSize: '1.4rem' }}>
                    <i className={`fa-solid ${form.icone}`} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{form.nom || 'Nom de la catégorie'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{form.description || 'Description...'}</div>
                  </div>
                </div>

                {/* Nom */}
                <div className="form-group">
                  <label className="form-label">Nom de la catégorie</label>
                  <input
                    className="form-control"
                    placeholder="Ex: Téléphones, Laptops..."
                    value={form.nom}
                    onChange={e => set('nom', e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description (optionnel)</label>
                  <input
                    className="form-control"
                    placeholder="Courte description de cette catégorie..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                </div>

                {/* Icône */}
                <div className="form-group">
                  <label className="form-label">Icône</label>
                  <div className="cat-icon-grid">
                    {ICONS.map(ic => (
                      <button
                        key={ic}
                        type="button"
                        className={`cat-icon-btn ${form.icone === ic ? 'selected' : ''}`}
                        onClick={() => set('icone', ic)}
                        style={form.icone === ic ? { borderColor: form.couleur, background: `${form.couleur}12`, color: form.couleur } : {}}
                        title={ic.replace('fa-', '')}
                      >
                        <i className={`fa-solid ${ic}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleur */}
                <div className="form-group">
                  <label className="form-label">Couleur</label>
                  <div className="cat-color-row">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`cat-color-btn ${form.couleur === c ? 'selected' : ''}`}
                        style={{ background: c }}
                        onClick={() => set('couleur', c)}
                      />
                    ))}
                    <input
                      type="color"
                      value={form.couleur}
                      onChange={e => set('couleur', e.target.value)}
                      className="cat-color-picker"
                      title="Couleur personnalisée"
                    />
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !form.nom.trim()}>
                  {saving ? <><i className="fa-solid fa-circle-notch fa-spin" /> Enregistrement...</> : <><i className="fa-solid fa-check" /> {editCat ? 'Modifier' : 'Créer'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
