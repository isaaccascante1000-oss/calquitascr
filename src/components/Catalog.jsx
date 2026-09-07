import { useState, useEffect } from 'react';
import { stickersData } from '../data/stickers';
import './Catalog.css';
import SinpeCard from './SinpeCard';

export default function Catalog() {
  const phoneNumber = "50689363659"; // Tu número de WhatsApp sin signos ni espacios
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterView, setFilterView] = useState('disponibles'); // 'disponibles' | 'todos'

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

  // Filtrado de calcas por estado y buscador
  const filteredStickers = stickersData.filter((s) => {
    const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterView === 'disponibles') {
      return matchesSearch && s.status !== 'vendido';
    }
    return matchesSearch;
  });

  return (
    <section className="catalog-section">
      <div className="catalog-container">
        
        {/* Encabezado */}
        <div className="catalog-header">
          <h2 className="catalog-title">
            Inventario de Calcas
          </h2>
          <p className="catalog-subtitle">
            Todas las calcas a ₡300 cada una • Envíos y entregas a convenir
          </p>

          {/* Tarjeta de SINPE Móvil justo en el encabezado superior */}
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <SinpeCard numeroSinpe="85643342" />
          </div>

          {/* Buscador y Filtros */}
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

      {/* Modal con ZOOM */}
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