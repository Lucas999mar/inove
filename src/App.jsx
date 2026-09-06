import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
