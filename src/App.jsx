import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminServices from './pages/admin/AdminServices';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminLeads from './pages/admin/AdminLeads';
import AdminAbout from './pages/admin/AdminAbout';
import AdminClients from './pages/admin/AdminClients';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          {/* Adicionaremos rotas dinâmicas como /portfolio depois */}
        </Route>

        {/* Rotas do Painel Administrativo */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
