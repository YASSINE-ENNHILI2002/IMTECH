import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products API
export const productsAPI = {
  getAll: () => api.get('/produits/'),
  getById: (id) => api.get(`/produits/${id}/`),
  create: (data) => api.post('/produits/', data),
  update: (id, data) => api.put(`/produits/${id}/`, data),
  delete: (id) => api.delete(`/produits/${id}/`),
  getByBarcode: (code) => api.get('/produits/par_code_barres/', { params: { code } }),
  getLowStock: () => api.get('/produits/stock_faible/'),
  // Public API for storefront
  getPublicCatalog: () => api.get('/produits/public/catalog/'),
  getPublicCategories: () => api.get('/produits/public/categories/'),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
}

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/clients/'),
  getById: (id) => api.get(`/clients/${id}/`),
  create: (data) => api.post('/clients/', data),
  update: (id, data) => api.put(`/clients/${id}/`, data),
  delete: (id) => api.delete(`/clients/${id}/`),
}

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions/'),
  getById: (id) => api.get(`/transactions/${id}/`),
  create: (data) => api.post('/transactions/', data),
  update: (id, data) => api.put(`/transactions/${id}/`, data),
  complete: (id) => api.post(`/transactions/${id}/completer/`),
  getFacturePDF: (id) => api.get(`/transactions/${id}/facture_pdf/`, { responseType: 'blob' }),
}

// Reparations API
export const reparationsAPI = {
  getAll: () => api.get('/tickets/'),
  getById: (id) => api.get(`/tickets/${id}/`),
  create: (data) => api.post('/tickets/', data),
  update: (id, data) => api.put(`/tickets/${id}/`, data),
  changeStatus: (id, status) => api.post(`/tickets/${id}/changer_statut/`, { statut: status }),
  addPiece: (id, data) => api.post(`/tickets/${id}/ajouter_piece/`, data),
  notifyClient: (id) => api.post(`/tickets/${id}/notifier_client/`),
}

// Used phones API
export const phonesAPI = {
  getAll: () => api.get('/telephones-occasion/'),
  create: (data) => api.post('/telephones-occasion/', data),
  update: (id, data) => api.put(`/telephones-occasion/${id}/`, data),
}

export default api
