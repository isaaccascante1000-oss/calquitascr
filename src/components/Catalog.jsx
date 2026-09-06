import { useState, useEffect } from 'react';
import { stickersData } from '../data/stickers';


export default function Catalog() {
  const phoneNumber = "89363659"; // Tu número de WhatsApp sin signos ni espacios
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Bloquea el scroll de la página cuando el modal está abierto
  useEffect(() => {
    if (selectedSticker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedSticker]);

  const handleReservation = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Por favor ingresa tu nombre para reservar.");
      return;
    }

    const message = `¡Hola! Quisiera reservar la calca *${selectedSticker.code}* de ₡300.%0A%0A*Cliente:* ${customerName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    setSelectedSticker(null);
    setCustomerName('');
  };

  // Filtrado de calcas por buscador
  const filteredStickers = stickersData.filter((s) =>
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section style={{ padding: '3.5rem 2rem', backgroundColor: 'transparent', minHeight: '100vh', color: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Inventario de Calcas
          </h2>
          <p style={{ color: '#a1a1aa', marginTop: '0.5rem', fontSize: '1rem' }}>
            Todas las calcas a ₡300 cada una • Envíos y entregas a convenir
          </p>

          {/* Buscador */}
          <div style={{ marginTop: '1.8rem', display: 'flex', justifyContent: 'center' }}>
            <input 
              type="text" 
              placeholder="🔍 Buscar por código (ej: K10A, K20...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                border: '1px solid #27272a',
                backgroundColor: '#18181b',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>

        {/* Grid del Catálogo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.8rem' }}>
          {filteredStickers.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                backgroundColor: '#18181b', 
                borderRadius: '16px', 
                padding: '1.2rem', 
                textAlign: 'center',
                border: '1px solid #27272a',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#0070f3';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 112, 243, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
              onClick={() => setSelectedSticker(item)}
            >
              <div style={{ 
                backgroundColor: '#09090b', 
                borderRadius: '12px', 
                padding: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '180px', 
                overflow: 'hidden',
                border: '1px solid #27272a'
              }}>
                <img 
                  src={item.image} 
                  alt={item.code} 
                  style={{ 
                    width: item.rotate % 180 !== 0 ? '160px' : 'auto',
                    height: item.rotate % 180 !== 0 ? '160px' : 'auto',
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    transform: `rotate(${item.rotate}deg)`,
                    filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.7))' 
                  }} 
                />
              </div>

              <div>
                <h3 style={{ margin: '1.2rem 0 0.2rem', fontSize: '1.25rem', color: '#ffffff', fontWeight: '800', letterSpacing: '0.5px' }}>
                  {item.code}
                </h3>
                <p style={{ margin: '0 0 1.2rem', fontSize: '1.2rem', fontWeight: '800', color: '#25D366' }}>
                  {item.price}
                </p>
              </div>

              <button
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 0', 
                  backgroundColor: '#25D366', 
                  color: '#09090b', 
                  border: 'none',
                  borderRadius: '10px', 
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Reservar Calca
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal con ZOOM enfocado a la calca */}
      {selectedSticker && (
        <div 
          onClick={() => setSelectedSticker(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#18181b',
              padding: '2rem',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '95%',
              textAlign: 'center',
              position: 'relative',
              border: '1px solid #27272a',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <button 
              onClick={() => setSelectedSticker(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#a1a1aa',
                fontSize: '1.4rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {/* Cuadro de la imagen con ZOOM en el centro */}
            <div style={{ 
              backgroundColor: '#09090b', 
              borderRadius: '14px', 
              padding: '1rem', 
              margin: '1.2rem 0', 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden',
              border: '1px solid #27272a'
            }}>
              <img 
                src={selectedSticker.image} 
                alt={selectedSticker.code} 
                style={{ 
                  width: selectedSticker.rotate % 180 !== 0 ? '240px' : '100%', 
                  height: selectedSticker.rotate % 180 !== 0 ? '240px' : '100%', 
                  objectFit: 'contain',
                  /* Se combina la rotación con la escala (zoom a 1.85x) */
                  transform: `rotate(${selectedSticker.rotate}deg) scale(1.85)`,
                  filter: 'drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.8))'
                }} 
              />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '800' }}>
              Calca {selectedSticker.code}
            </h3>
            <p style={{ fontSize: '1.3rem', color: '#25D366', fontWeight: '800', marginBottom: '1.2rem' }}>
              {selectedSticker.price}
            </p>

            <form onSubmit={handleReservation} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <input 
                type="text" 
                placeholder="Nombre aquí" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  borderRadius: '10px', 
                  border: '1px solid #3f3f46', 
                  backgroundColor: '#09090b', 
                  color: '#fff', 
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                required
              />
              <button 
                type="submit"
                style={{ 
                  padding: '0.9rem', 
                  backgroundColor: '#25D366', 
                  color: '#09090b', 
                  border: 'none', 
                  borderRadius: '10px', 
                  fontWeight: '800', 
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(37, 211, 102, 0.25)'
                }}
              >
                Confirmar Reserva por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}