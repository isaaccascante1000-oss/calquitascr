import React, { useState } from 'react';

export const SinpeCard = ({ numeroSinpe = "85643342", titular = "CalquitasCR" }) => {
  const [copiado, setCopiado] = useState(false);

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(numeroSinpe);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div style={{
      backgroundColor: '#12161a',
      border: '1px solid #22c55e',
      borderRadius: '12px',
      padding: '12px 18px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)',
      color: '#ffffff',
      margin: '15px auto'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Paga vía SINPE Móvil
        </span>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '1px' }}>
          📱 {numeroSinpe}
        </span>
      </div>

      <button
        onClick={copiarAlPortapapeles}
        style={{
          backgroundColor: copiado ? '#16a34a' : '#22c55e',
          color: '#000000',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 14px',
          fontWeight: 'bold',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: copiado ? 'none' : '0 0 10px rgba(34, 197, 94, 0.4)'
        }}
      >
        {copiado ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  );
};

export default SinpeCard;