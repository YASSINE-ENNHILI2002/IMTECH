import { useState, useEffect } from 'react'
import { productsAPI, categoriesAPI } from '../services/api'
import './Produits.css'

const EMPTY_FORM = {
  nom: '', code_barres: '', categorie: '', type_stock: 'QUANTITE',
  marque: '', modele: '', capacite: '', couleur: '',
  prix_achat: '', prix_vente: '', stock: 0, stock_min: 5,
  garantie_mois: 12, description: '',
}

function Produits() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [pr, cr] = await Promise.all([productsAPI.getAll(), categoriesAPI.getAll()])
      setProducts(pr.data)
      setCategories(cr.data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const openCreate = () => { setEditProduct(null); setFormData(EMPTY_FORM); setShowModal(true) }
  const openEdit = (p) => {
    setEditProduct(p)
    setFormData({
      nom: p.nom, code_barres: p.code_barres || '', categorie: p.categorie || '',
      type_stock: p.type_stock, marque: p.marque || '', modele: p.modele || '',
      capacite: p.capacite || '', couleur: p.couleur || '',
      prix_achat: p.prix_achat, prix_vente: p.prix_vente,
      stock: p.stock, stock_min: p.stock_min, garantie_mois: p.garantie_mois, description: p.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editProduct) await productsAPI.update(editProduct.id, formData)
      else await productsAPI.create(formData)
      setShowModal(false); loadData()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit définitivement ?')) return
    try { await productsAPI.delete(id); loadData() } catch (e) { console.error(e) }
  }

  const set = (k, v) => setFormData(f => ({ ...f, [k]: v }))

  const filtered = products.filter(p => {
    const q = searchTerm.toLowerCase()
    const matchSearch = p.nom.toLowerCase().includes(q) || (p.code_barres || '').toLowerCase().includes(q) || (p.marque || '').toLowerCase().includes(q)
    const matchCat = !selectedCategory || p.categorie === parseInt(selectedCategory)
    return matchSearch && matchCat
  })

  if (loading) return <div className="loading-state"><div className="spinner"></div><span>Chargement des produits...</span></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><i className="fa-solid fa-box-open"></i> Produits</div>
          <div className="page-subtitle">{products.length} produit{products.length !== 1 ? 's' : ''} dans l'inventaire</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="fa-solid fa-plus"></i> Nouveau produit
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters-bar">
        <div className="search-wrapper" style={{flex:1, maxWidth:380}}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" className="form-control search-input" placeholder="Rechercher par nom, code-barres, marque..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="form-control" style={{width:'200px'}} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
        <span className="results-count">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* TABLE */}
      <div className="card" style={{padding:0}}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-box-open"></i>
            <h4>Aucun produit trouvé</h4>
            <p>Modifiez votre recherche ou ajoutez un nouveau produit</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Prix achat</th>
                  <th>Prix vente</th>
                  <th>Stock</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{fontWeight:600, color:'var(--text-primary)'}}>{p.nom}</div>
                      <div style={{fontSize:'0.78rem', color:'var(--text-muted)', marginTop:'2px'}}>
                        {p.marque && <span>{p.marque} </span>}
                        {p.code_barres && <span>· {p.code_barres}</span>}
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{p.categorie_nom || '—'}</span></td>
                    <td style={{color:'var(--text-secondary)'}}>{parseFloat(p.prix_achat).toFixed(2)} DH</td>
                    <td style={{fontWeight:600, color:'var(--accent-green)'}}>{parseFloat(p.prix_vente).toFixed(2)} DH</td>
                    <td>
                      <span style={{fontWeight:600, color: p.est_stock_faible ? 'var(--accent-red)' : 'var(--text-primary)'}}>
                        {p.stock}
                      </span>
                      <span style={{fontSize:'0.75rem', color:'var(--text-muted)'}}> / min {p.stock_min}</span>
                    </td>
                    <td>
                      {p.est_stock_faible
                        ? <span className="badge badge-red"><i className="fa-solid fa-triangle-exclamation"></i> Stock faible</span>
                        : <span className="badge badge-green"><i className="fa-solid fa-check"></i> OK</span>}
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-icon" title="Modifier" onClick={() => openEdit(p)}><i className="fa-solid fa-pen"></i></button>
                        <button className="btn-icon danger" title="Supprimer" onClick={() => handleDelete(p.id)}><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3><i className={`fa-solid ${editProduct ? 'fa-pen' : 'fa-plus'}`}></i>{editProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom du produit</label>
                    <input className="form-control" required value={formData.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex: Coque iPhone 14" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Code-barres</label>
                    <input className="form-control" value={formData.code_barres} onChange={e => set('code_barres', e.target.value)} placeholder="EAN13..." />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Catégorie</label>
                    <select className="form-control" value={formData.categorie} onChange={e => set('categorie', e.target.value)}>
                      <option value="">— Sélectionner —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type de stock</label>
                    <select className="form-control" value={formData.type_stock} onChange={e => set('type_stock', e.target.value)}>
                      <option value="QUANTITE">Quantité en vrac</option>
                      <option value="UNIQUE_IMEI">Unité unique (IMEI)</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Marque</label>
                    <input className="form-control" value={formData.marque} onChange={e => set('marque', e.target.value)} placeholder="Apple, Samsung..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Modèle</label>
                    <input className="form-control" value={formData.modele} onChange={e => set('modele', e.target.value)} placeholder="iPhone 14, Galaxy S23..." />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prix d'achat (DH)</label>
                    <input className="form-control" type="number" step="0.01" required value={formData.prix_achat} onChange={e => set('prix_achat', e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prix de vente (DH)</label>
                    <input className="form-control" type="number" step="0.01" required value={formData.prix_vente} onChange={e => set('prix_vente', e.target.value)} placeholder="0.00" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stock initial</label>
                    <input className="form-control" type="number" value={formData.stock} onChange={e => set('stock', parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock minimum</label>
                    <input className="form-control" type="number" value={formData.stock_min} onChange={e => set('stock_min', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={formData.description} onChange={e => set('description', e.target.value)} placeholder="Description optionnelle..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" style={{width:14,height:14,borderWidth:2}}></div> Enregistrement...</> : <><i className="fa-solid fa-check"></i> {editProduct ? 'Mettre à jour' : 'Créer'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Produits
