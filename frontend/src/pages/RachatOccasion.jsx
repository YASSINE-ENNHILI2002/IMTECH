import { useState, useEffect, useRef } from 'react'
import { clientsAPI, transactionsAPI, phonesAPI } from '../services/api'
import SignatureCanvas from 'react-signature-canvas'
import './RachatOccasion.css'

function RachatOccasion() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [signaturePad, setSignaturePad] = useState(null)
  const [photoCIN, setPhotoCIN] = useState(null)
  const [formData, setFormData] = useState({
    // Client info
    nom: '',
    prenom: '',
    telephone: '',
    type_piece: 'CIN',
    numero_piece: '',
    
    // Phone info
    marque: '',
    modele: '',
    capacite: '',
    couleur: '',
    imei1: '',
    imei2: '',
    numero_serie: '',
    
    // Condition
    grade: 'B',
    etat_cosmetique: '',
    etat_batterie: 80,
    
    // Transaction
    prix_rachat: '',
    mode_paiement: 'ESPECES',
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

  const handleSignatureClear = () => {
    if (signaturePad) {
      signaturePad.clear()
    }
  }

  const handlePhotoCINChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoCIN(file)
    }
  }

  const handleSubmit = async () => {
    try {
      // Create or get client
      let clientId = null
      const existingClient = clients.find(
        c => c.numero_piece === formData.numero_piece
      )
      
      if (existingClient) {
        clientId = existingClient.id
      } else {
        const clientData = {
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          type_piece: formData.type_piece,
          numero_piece: formData.numero_piece,
        }
        
        const clientRes = await clientsAPI.create(clientData)
        clientId = clientRes.data.id
        
        // Upload CIN photo if provided
        if (photoCIN) {
          const formDataPhoto = new FormData()
          formDataPhoto.append('photo_piece', photoCIN)
          // Upload logic would go here
        }
        
        // Upload signature if provided
        if (signaturePad && !signaturePad.isEmpty()) {
          const signatureData = signaturePad.toDataURL()
          // Upload signature logic would go here
        }
      }
      
      // Create transaction
      const transactionData = {
        type_transaction: 'ACHAT',
        client: clientId,
        montant_total: formData.prix_rachat,
        mode_paiement: formData.mode_paiement,
        statut: 'EN_COURS',
        notes: formData.notes,
      }
      
      const transactionRes = await transactionsAPI.create(transactionData)
      
      // Create used phone entry
      const phoneData = {
        marque: formData.marque,
        modele: formData.modele,
        capacite: formData.capacite,
        couleur: formData.couleur,
        imei1: formData.imei1,
        imei2: formData.imei2,
        numero_serie: formData.numero_serie,
        grade: formData.grade,
        etat_cosmetique: formData.etat_cosmetique,
        etat_batterie: formData.etat_batterie,
        prix_achat: formData.prix_rachat,
      }
      
      // Note: This would need to be adjusted based on your actual API structure
      // await phonesAPI.create(phoneData)
      
      // Complete transaction
      await transactionsAPI.complete(transactionRes.data.id)
      
      alert('Rachat enregistré avec succès!')
      resetForm()
    } catch (error) {
      console.error('Error processing buyback:', error)
      alert('Erreur lors du traitement du rachat')
    }
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      type_piece: 'CIN',
      numero_piece: '',
      marque: '',
      modele: '',
      capacite: '',
      couleur: '',
      imei1: '',
      imei2: '',
      numero_serie: '',
      grade: 'B',
      etat_cosmetique: '',
      etat_batterie: 80,
      prix_rachat: '',
      mode_paiement: 'ESPECES',
      notes: '',
    })
    setPhotoCIN(null)
    setCurrentStep(1)
    if (signaturePad) {
      signaturePad.clear()
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="rachat-page">
      <div className="page-header">
        <h2>Rachat de Téléphones d'Occasion</h2>
        <p className="subtitle">Registre légal des objets mobiliers</p>
      </div>

      <div className="rachat-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Vendeur</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Téléphone</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">État</div>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Paiement</div>
          </div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''} ${currentStep > 5 ? 'completed' : ''}`}>
            <div className="step-number">5</div>
            <div className="step-label">Signature</div>
          </div>
        </div>

        {/* Step 1: Seller Information */}
        {currentStep === 1 && (
          <div className="form-section">
            <h3>Informations du Vendeur</h3>
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
                <label>Photo CIN</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoCINChange}
                  className="file-input"
                />
                {photoCIN && <span className="file-selected">✓ Photo sélectionnée</span>}
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={nextStep}>
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Phone Information */}
        {currentStep === 2 && (
          <div className="form-section">
            <h3>Informations du Téléphone</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Marque*</label>
                <input
                  type="text"
                  required
                  value={formData.marque}
                  onChange={(e) => setFormData({...formData, marque: e.target.value})}
                  placeholder="Ex: Apple, Samsung, Xiaomi..."
                />
              </div>
              <div className="form-group">
                <label>Modèle*</label>
                <input
                  type="text"
                  required
                  value={formData.modele}
                  onChange={(e) => setFormData({...formData, modele: e.target.value})}
                  placeholder="Ex: iPhone 13, Galaxy S21..."
                />
              </div>
              <div className="form-group">
                <label>Capacité</label>
                <input
                  type="text"
                  value={formData.capacite}
                  onChange={(e) => setFormData({...formData, capacite: e.target.value})}
                  placeholder="Ex: 64 Go, 128 Go..."
                />
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <input
                  type="text"
                  value={formData.couleur}
                  onChange={(e) => setFormData({...formData, couleur: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>IMEI 1*</label>
                <input
                  type="text"
                  required
                  value={formData.imei1}
                  onChange={(e) => setFormData({...formData, imei1: e.target.value})}
                  placeholder="15 chiffres"
                />
              </div>
              <div className="form-group">
                <label>IMEI 2</label>
                <input
                  type="text"
                  value={formData.imei2}
                  onChange={(e) => setFormData({...formData, imei2: e.target.value})}
                  placeholder="Optionnel (double SIM)"
                />
              </div>
              <div className="form-group">
                <label>Numéro de série</label>
                <input
                  type="text"
                  value={formData.numero_serie}
                  onChange={(e) => setFormData({...formData, numero_serie: e.target.value})}
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Précédent
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Condition Assessment */}
        {currentStep === 3 && (
          <div className="form-section">
            <h3>État du Téléphone</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Grade*</label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                >
                  <option value="A">Grade A (Comme neuf)</option>
                  <option value="B">Grade B (Traces d'utilisation)</option>
                  <option value="C">Grade C (Usé visible)</option>
                </select>
              </div>
              <div className="form-group">
                <label>État batterie (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.etat_batterie}
                  onChange={(e) => setFormData({...formData, etat_batterie: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="form-group">
              <label>État cosmétique*</label>
              <textarea
                required
                value={formData.etat_cosmetique}
                onChange={(e) => setFormData({...formData, etat_cosmetique: e.target.value})}
                rows="4"
                placeholder="Décrivez l'état: rayures, fissures, boutons, écran, coque..."
              />
            </div>
            <div className="condition-checklist">
              <h4>Points à vérifier :</h4>
              <div className="checklist-item">
                <span>Écran (rayures, fissures, tactile)</span>
              </div>
              <div className="checklist-item">
                <span>Coque arrière (rayures, fissures)</span>
              </div>
              <div className="checklist-item">
                <span>Boutons (home, volume, power)</span>
              </div>
              <div className="checklist-item">
                <span>Connecteurs (charge, écouteurs)</span>
              </div>
              <div className="checklist-item">
                <span>Caméras (avant et arrière)</span>
              </div>
              <div className="checklist-item">
                <span>Capteurs (FaceID, empreinte)</span>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Précédent
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div className="form-section">
            <h3>Prix et Paiement</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Prix de rachat (€)*</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.prix_rachat}
                  onChange={(e) => setFormData({...formData, prix_rachat: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Mode de paiement*</label>
                <select
                  required
                  value={formData.mode_paiement}
                  onChange={(e) => setFormData({...formData, mode_paiement: e.target.value})}
                >
                  <option value="ESPECES">Espèces</option>
                  <option value="VIREMENT">Virement</option>
                  <option value="AVOIR">Avoir en magasin</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="3"
                placeholder="Informations supplémentaires..."
              />
            </div>
            <div className="summary-box">
              <h4>Récapitulatif</h4>
              <p><strong>Vendeur:</strong> {formData.prenom} {formData.nom}</p>
              <p><strong>Téléphone:</strong> {formData.marque} {formData.modele}</p>
              <p><strong>IMEI:</strong> {formData.imei1}</p>
              <p><strong>Prix de rachat:</strong> {formData.prix_rachat}€</p>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Précédent
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Signature */}
        {currentStep === 5 && (
          <div className="form-section">
            <h3>Signature et Validation</h3>
            <div className="legal-notice">
              <p><strong>⚠️ Déclaration sur l'honneur</strong></p>
              <p>Je certifie être le propriétaire légitime de ce téléphone et déclare qu'il ne s'agit pas d'un bien volé.</p>
              <p>En signant, j'accepte les conditions de rachat et m'engage sur la véracité des informations fournies.</p>
            </div>
            
            <div className="signature-section">
              <label>Signature du vendeur*</label>
              <div className="signature-canvas-container">
                <SignatureCanvas
                  ref={(ref) => setSignaturePad(ref)}
                  canvasProps={{
                    className: 'signature-canvas'
                  }}
                />
              </div>
              <button className="btn btn-sm btn-secondary" onClick={handleSignatureClear}>
                Effacer la signature
              </button>
            </div>

            <div className="final-summary">
              <h4>Récapitulatif final du rachat</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Vendeur:</span>
                  <span className="value">{formData.prenom} {formData.nom}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Téléphone:</span>
                  <span className="value">{formData.marque} {formData.modele}</span>
                </div>
                <div className="summary-item">
                  <span className="label">IMEI:</span>
                  <span className="value">{formData.imei1}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Grade:</span>
                  <span className="value">{formData.grade}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Prix:</span>
                  <span className="value">{formData.prix_rachat}€</span>
                </div>
                <div className="summary-item">
                  <span className="label">Paiement:</span>
                  <span className="value">{formData.mode_paiement}</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Précédent
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
                ✓ Valider le Rachat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RachatOccasion
