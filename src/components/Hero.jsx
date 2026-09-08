export default function Hero({ onExplore }) {
  return (
    <section style={{
      minHeight: '88vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at 50% 30%, #1c1c21 0%, #09090b 80%)'
    }}>
      <span style={{
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        color: '#25D366',
        padding: '0.4rem 1.1rem',
        borderRadius: '30px',
        fontSize: '0.8rem',
        fontWeight: '800',
        marginBottom: '1.5rem',
        border: '1px solid rgba(37, 211, 102, 0.3)',
        letterSpacing: '1px'
      }}>
        STOCK DISPONIBLE • COSTA RICA
      </span>

      <h1 style={{
        fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '1.2rem',
        maxWidth: '850px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-1px'
      }}>
        Personaliza tu estilo con las mejores Calcas
      </h1>

      <p style={{
        fontSize: '1.15rem',
        color: '#a1a1aa',
        maxWidth: '580px',
        marginBottom: '2.5rem',
        lineHeight: '1.6'
      }}>
        Catálogo exclusivo de alta durabilidad desde <strong style={{ color: '#25D366' }}>₡300</strong> (Premium a <strong style={{ color: '#25D366' }}>₡400</strong>). Seleccioná y apartá directamente a WhatsApp.
      </p>

      <button 
        onClick={onExplore}
        style={{
          padding: '1.1rem 2.8rem',
          fontSize: '1.1rem',
          backgroundColor: '#25D366',
          color: '#09090b',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '800',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(37, 211, 102, 0.35)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 0 40px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(37, 211, 102, 0.35)';
        }}
      >
        Explorar Catálogo →
      </button>
    </section>
  );
}