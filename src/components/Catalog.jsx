import { useState, useEffect } from 'react';
import { stickersData } from '../data/stickers.js';
import './Catalog.css';

export default function Catalog() {
  const phoneNumber = "50689363659"; // Tu número de WhatsApp sin signos ni espacios
  const sinpeNumber = "85643342"; // Número para el SINPE Móvil
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterView, setFilterView] = useState('disponibles'); // 'disponibles' | 'todos'
  const [selectedCategory, setSelectedCategory] = useState('todas'); // 'todas' | 'letras' | 'logos' | 'criaturas' | 'premium'
  const [copied, setCopied] = useState(false);

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

  const handleCopySinpe = () => {
    navigator.clipboard.writeText(sinpeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Filtrado de calcas por estado, buscador y categorías
  const filteredStickers = stickersData.filter((s) => {
    const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterView === 'disponibles' ? s.status !== 'vendido' : true;
    const matchesCategory = selectedCategory === 'todas' ? true : s.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <section id="inventario-calcas" className="catalog-section">
      <div className="catalog-container">
        
        {/* Encabezado */}
        <div className="catalog-header">
          <h2 className="catalog-title">
            Inventario de Calcas
          </h2>
          <p className="catalog-subtitle">
            Todas las calcas a ₡300 cada una • Envíos y entregas a convenir
          </p>

          {/* Tarjeta de Pago SINPE Móvil */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#12161b', 
            border: '1px solid #1f2937', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            maxWidth: '450px', 
            margin: '0 auto 20px auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>
                Paga vía SINPE Móvil
              </span>
              <strong style={{ fontSize: '1.2rem', color: '#00e676', letterSpacing: '1px' }}>
                📱 {sinpeNumber}
              </strong>
            </div>
            <button 
              onClick={handleCopySinpe}
              style={{
                background: copied ? '#00e676' : '#1f2937',
                color: copied ? '#000' : '#fff',
                border: '1px solid #374151',
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          {/* Buscador y Filtros de Estado */}
          <div className="catalog-search-wrapper">
            <input 
              type="text" 
              placeholder="🔍 Buscar por código (ej: K10A, K20...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="catalog-search-input"
            />

            {/* Pestañas de Filtro Disponibles / Todos */}
            <div className="catalog-filter-tabs">
              <button
                onClick={() => setFilterView('disponibles')}
                className={`catalog-filter-btn ${filterView === 'disponibles' ? 'active' : ''}`}
              >
                Disponibles ({stickersData.filter(s => s.status !== 'vendido').length})
              </button>
              <button
                onClick={() => setFilterView('todos')}
                className={`catalog-filter-btn ${filterView === 'todos' ? 'active' : ''}`}
              >
                Ver Todo ({stickersData.length})
              </button>
            </div>

            {/* Pestañas de Categorías */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginTop: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { id: 'todas', label: ' Todas' },
                { id: 'letras', label: ' Letras' },
                { id: 'logos', label: ' Logos' },
                { id: 'criaturas', label: ' Criaturas' },
                { id: 'premium', label: ' Premium' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: selectedCategory === cat.id ? '#00e676' : '#12161b',
                    color: selectedCategory === cat.id ? '#000' : '#9ca3af',
                    border: '1px solid #2d3748',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Grid del Catálogo */}
        <div className="catalog-grid">
          {filteredStickers.map((item) => {
            const isSold = item.status === 'vendido';

            return (
              <div 
                key={item.id} 
                className={`catalog-card ${isSold ? 'sold' : ''}`}
                onClick={() => {
                  if (!isSold) setSelectedSticker(item);
                }}
              >
                <div className="catalog-card-image-box">
                  {isSold && (
                    <div className="catalog-sold-overlay">
                      <span className="catalog-sold-badge">
                        AGOTADA
                      </span>
                    </div>
                  )}

                  <img 
                    src={item.image} 
                    alt={item.code} 
                    className="catalog-card-image"
                    style={{ 
                      transform: `rotate(${item.rotate}deg)`,
                      width: item.rotate % 180 !== 0 ? '100%' : 'auto',
                      height: item.rotate % 180 !== 0 ? '100%' : 'auto'
                    }} 
                  />
                </div>

                <div className="catalog-card-info">
                  <h3 className="catalog-card-title">
                    {item.code}
                  </h3>
                  <p className={`catalog-card-price ${isSold ? 'sold-text' : ''}`}>
                    {isSold ? 'Agotada' : item.price}
                  </p>
                </div>

                <button
                  disabled={isSold}
                  className="catalog-card-btn"
                >
                  {isSold ? 'AGOTADA' : 'Reservar Calca'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal con ZOOM enfocado a la calca */}
      {selectedSticker && (
        <div 
          onClick={() => setSelectedSticker(null)}
          className="catalog-modal-overlay"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="catalog-modal-content"
          >
            <button 
              onClick={() => setSelectedSticker(null)}
              className="catalog-modal-close"
            >
              ✕
            </button>

            <div className="catalog-modal-image-box">
              <img 
                src={selectedSticker.image} 
                alt={selectedSticker.code} 
                className="catalog-modal-image"
                style={{ 
                  width: selectedSticker.rotate % 180 !== 0 ? '240px' : '100%', 
                  height: selectedSticker.rotate % 180 !== 0 ? '240px' : '100%', 
                  transform: `rotate(${selectedSticker.rotate}deg) scale(1.85)`
                }} 
              />
            </div>

            <h3 className="catalog-modal-title">
              Calca {selectedSticker.code}
            </h3>
            <p className="catalog-modal-price">
              {selectedSticker.price}
            </p>

            <form onSubmit={handleReservation} className="catalog-modal-form">
              <input 
                type="text" 
                placeholder="Nombre aquí" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)}
                className="catalog-modal-input"
                required
              />
              <button 
                type="submit"
                className="catalog-modal-submit"
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