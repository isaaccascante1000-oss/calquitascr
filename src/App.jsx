import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes de Layout
import Sidebar from './components/layout/Sidebar';
import TopBanner from './components/layout/TopBanner';

// Vistas Públicas
import CalquitasPage from './pages/CalquitasPage';
import BarberyPage from './pages/BarberyPage';
import PasteleriaPage from './pages/PasteleriaPage';

// Componentes de Protección y Vistas Privadas
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardVentas from './pages/admin/DashboardVentas';

function App() {
  // Simulación de estado de autenticación (Cámbialo a false para probar que la protección funciona)
  const isAuth = true; 

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f12' }}>
        {/* Menú lateral fijo a la izquierda */}
        <Sidebar />

        {/* Contenedor principal sin restricciones de scroll interno */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Banner superior */}
          <TopBanner />

          {/* Rutas de la aplicación */}
          <Routes>
            {/* RUTAS PÚBLICAS: Acceso libre */}
            <Route path="/" element={<CalquitasPage />} />
            <Route path="/pasteleria" element={<PasteleriaPage />} />
            <Route path="/barbery" element={<BarberyPage />} />
            
            {/* RUTAS PRIVADAS: Lógica de negocio aplicada (Solo admin) */}
            <Route element={<ProtectedRoute isAllowed={isAuth} redirectTo="/" />}>
              <Route path="/admin/ventas" element={<DashboardVentas />} />
            </Route>

            {/* Redirección para cualquier otra ruta no encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 