import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Produits from './pages/Produits'
import Categories from './pages/Categories'
import Clients from './pages/Clients'
import Reparations from './pages/Reparations'
import Caisse from './pages/Caisse'
import RachatOccasion from './pages/RachatOccasion'
import Vitrine from './pages/Vitrine'
import AdminLogin from './pages/AdminLogin'
import './components/Layout.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique vitrine */}
        <Route path="/vitrine" element={<Vitrine />} />

        {/* Admin login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Routes admin avec layout (protégées via le Layout lui-même) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="produits" element={<Produits />} />
          <Route path="categories" element={<Categories />} />
          <Route path="clients" element={<Clients />} />
          <Route path="reparations" element={<Reparations />} />
          <Route path="caisse" element={<Caisse />} />
          <Route path="rachat" element={<RachatOccasion />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
