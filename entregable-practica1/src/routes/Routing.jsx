import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import Navbar from '../components/Navbar';

// Páginas Públicas
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Páginas Privadas
import DashboardPage from '../pages/DashboardPage';
import PerfilPage from '../pages/PerfilPage';

export default function Routing() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas Privadas */}
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
