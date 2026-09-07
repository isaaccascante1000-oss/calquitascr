import { useState } from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';

export default function CalquitasPage() {
  const [showCatalog, setShowCatalog] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#09090b' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {!showCatalog ? (
          <Hero onExplore={() => setShowCatalog(true)} />
        ) : (
          <Catalog />
        )}
      </div>
    </div>
  );
}