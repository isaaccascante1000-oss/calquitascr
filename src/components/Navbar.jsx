export default function Navbar({ onNavigate, currentView }) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2.5rem',
      backgroundColor: 'rgba(9, 9, 11, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #27272a',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div 
        onClick={() => onNavigate('hero')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
      >
        <span style={{ 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          backgroundColor: '#380adbff', 
          boxShadow: '0 0 10px #25D366' 
        }}></span>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffffff', letterSpacing: '-0.5px' }}>
          Calquitas<span style={{ color: '#da0b0bff' }}>CR</span>
        </h2>
      </div>

      <nav style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => onNavigate('hero')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: currentView === 'hero' ? '#ffffff' : '#a1a1aa', 
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'color 0.2s'
          }}
        >
          Inicio
        </button>
        <button 
          onClick={() => onNavigate('catalog')} 
          style={{ 
            background: '#25D366', 
            color: '#09090b', 
            border: 'none', 
            padding: '0.55rem 1.3rem', 
            borderRadius: '10px', 
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '0.9rem',
            boxShadow: '0 0 15px rgba(37, 211, 102, 0.25)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Ver Inventario
        </button>
      </nav>
    </header>
  );
}