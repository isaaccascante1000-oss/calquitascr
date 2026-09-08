import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import TopBanner from './components/layout/TopBanner';
import CalquitasPage from './pages/CalquitasPage';
import BarberyPage from './pages/BarberyPage';
import PasteleriaPage from './pages/PasteleriaPage';

function App() {
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
            <Route path="/" element={<CalquitasPage />} />
            <Route path="/pasteleria" element={<PasteleriaPage />} />
            <Route path="/barbery" element={<BarberyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;