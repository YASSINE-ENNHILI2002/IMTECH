import { useState, useEffect } from 'react'
import { productsAPI, transactionsAPI, clientsAPI } from '../services/api'
import './Caisse.css'

function Caisse() {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [scanning, setScanning] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('ESPECES')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, clientsRes] = await Promise.all([
        productsAPI.getAll(),
        clientsAPI.getAll(),
      ])
      setProducts(productsRes.data)
      setClients(clientsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code_barres?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantite: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantite: newQuantity }
          : item
      ))
    }
  }

  const handleBarcodeScan = async (e) => {
    if (e.key === 'Enter' && searchTerm) {
      try {
        const response = await productsAPI.getByBarcode(searchTerm)
        if (response.data) {
          addToCart(response.data)
          setSearchTerm('')
        } else {
          alert('Produit non trouvé')
        }
      } catch (error) {
        console.error('Error scanning barcode:', error)
        alert('Erreur lors du scan du code-barres')
      }
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.prix_vente) * item.quantite), 0)

  const handlePayment = async () => {
    if (cart.length === 0) {
      alert('Le panier est vide')
      return
    }

    try {
      const transactionData = {
        type_transaction: 'VENTE',
        client: selectedClient,
        montant_total: cartTotal,
        mode_paiement: paymentMethod,
        statut: 'EN_COURS',
      }

      const transactionRes = await transactionsAPI.create(transactionData)
      const transactionId = transactionRes.data.id

      // Add items to transaction
      for (const item of cart) {
        await fetch(`http://localhost:8000/api/lignes-transaction/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transaction: transactionId,
            produit: item.id,
            quantite: item.quantite,
            prix_unitaire: item.prix_vente,
            garantie_mois: item.garantie_mois || 12,
          }),
        })
      }

      // Complete transaction
      const completeRes = await transactionsAPI.complete(transactionId)
      
      setCart([])
      setSelectedClient(null)
      setShowPaymentModal(false)
      
      // Ask if user wants to see the invoice
      if (confirm('Vente effectuée avec succès! Voulez-vous voir la facture PDF?')) {
        try {
          const pdfRes = await transactionsAPI.getFacturePDF(transactionId)
          const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
          const url = window.URL.createObjectURL(blob)
          window.open(url, '_blank')
        } catch (error) {
          console.error('Error loading PDF:', error)
          alert('Erreur lors du chargement de la facture')
        }
      }
      
      loadData()
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Erreur lors du traitement du paiement')
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="caisse-page">
      <div className="caisse-container">
        <div className="products-section">
          <h2>Caisse / Point de Vente</h2>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Scanner code-barres ou rechercher produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleBarcodeScan}
              className="search-input"
              autoFocus
            />
            <button 
              className="btn btn-primary"
              onClick={() => setScanning(!scanning)}
            >
              {scanning ? '📷 Arrêter Scan' : '📷 Scanner'}
            </button>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={`product-item ${product.stock <= 0 ? 'out-of-stock' : ''}`}
                onClick={() => product.stock > 0 && addToCart(product)}
              >
                <div className="product-info">
                  <h4>{product.nom}</h4>
                  <p className="product-barcode">{product.code_barres || 'Sans code-barres'}</p>
                  <p className="product-price">{parseFloat(product.prix_vente).toFixed(2)}€</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                </div>
                {product.stock <= 0 && <div className="out-of-stock-badge">Rupture</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <div className="cart-header">
            <h3>Panier</h3>
            <span className="cart-count">{cart.length} article(s)</span>
          </div>

          <div className="client-selection">
            <select
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(e.target.value || null)}
              className="client-select"
            >
              <option value="">Client anonyme</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.prenom} {client.nom} - {client.telephone}
                </option>
              ))}
            </select>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">Panier vide</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.nom}</h4>
                    <p>{parseFloat(item.prix_vente).toFixed(2)}€</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantite - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantite}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    {(parseFloat(item.prix_vente) * item.quantite).toFixed(2)}€
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">{cartTotal.toFixed(2)}€</span>
            </div>
            <button 
              className="btn btn-success checkout-btn"
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
            >
              💰 Encaisser
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="modal">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h3>Paiement</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Total à payer:</span>
                <span className="total-amount">{cartTotal.toFixed(2)}€</span>
              </div>
            </div>

            <div className="payment-methods">
              <h4>Mode de paiement</h4>
              <div className="payment-options">
                {[
                  { value: 'ESPECES', label: '💵 Espèces', icon: '💵' },
                  { value: 'CARTE', label: '💳 Carte bancaire', icon: '💳' },
                  { value: 'VIREMENT', label: '🏦 Virement', icon: '🏦' },
                  { value: 'AVOIR', label: '🎫 Avoir magasin', icon: '🎫' },
                  { value: 'FRACTIONNE', label: '📊 Paiement fractionné', icon: '📊' },
                ].map(method => (
                  <button
                    key={method.value}
                    className={`payment-option ${paymentMethod === method.value ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <span className="payment-icon">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowPaymentModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-success" 
                onClick={handlePayment}
              >
                Confirmer Paiement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Caisse
