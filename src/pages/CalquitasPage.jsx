import { useState } from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import ParticlesBackground from '../components/shared/ParticlesBackground';

export default function CalquitasPage() {
  const [showCatalog, setShowCatalog] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Fondo de partículas */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <ParticlesBackground />
      </div>

      {/* Contenido dinámico */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {!showCatalog ? (
          <Hero onExplore={() => setShowCatalog(true)} />
        ) : (
          <div>
            {/* Botón para regresar al inicio si lo deseas */}
            <div style={{ padding: '20px 32px 0 32px' }}>
              <button 
                onClick={() => setShowCatalog(false)}
                style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ← Volver al Inicio
              </button>
            </div>
            <Catalog />
          </div>
        )}
      </div>
    </div>
  );
}