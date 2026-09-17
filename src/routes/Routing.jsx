import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

// Layout
import Sidebar from '../components/layout/Sidebar';
import TopBanner from '../components/layout/TopBanner';

// Vistas Públicas
import CalquitasPage from '../pages/CalquitasPage';
import BarberyPage from '../pages/BarberyPage';
import PasteleriaPage from '../pages/PasteleriaPage';
import LoginPage from '../pages/LoginPage';
import RegistroPage from '../pages/RegistroPage';
import NotFoundPage from '../pages/NotFoundPage';

// Vistas Privadas
import DashboardVentas from '../pages/admin/DashboardVentas';
import PerfilPage from '../pages/PerfilPage';

export default function Routing() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f12' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBanner />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<CalquitasPage />} />
          <Route path="/pasteleria" element={<PasteleriaPage />} />
          <Route path="/barbery" element={<BarberyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          {/* Rutas Privadas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<DashboardVentas />} />
            <Route path="/perfil" element={<PerfilPage />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
