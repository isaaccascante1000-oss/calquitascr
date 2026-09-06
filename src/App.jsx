import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import ParticlesBackground from './components/ParticlesBackground';

export default function App() {
  const [currentView, setCurrentView] = useState('catalog'); // O 'hero' según prefieras

  return (
    <div style={{ position: 'relative', backgroundColor: '#09090b', minHeight: '100vh' }}>
      {/* Fondo de Puntos Animados */}
      <ParticlesBackground />

      {/* Contenido principal sobre el fondo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar onNavigate={setCurrentView} currentView={currentView} />
        {currentView === 'hero' ? (
          <Hero onGoToCatalog={() => setCurrentView('catalog')} />
        ) : (
          <Catalog />
        )}
      </div>
    </div>
  );
}