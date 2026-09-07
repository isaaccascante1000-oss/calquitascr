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
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: '#ffffff',
      maxWidth: '320px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>📱</span>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Pago por SINPE Móvil</h4>
      </div>
      
      <p style={{ margin: '4px 0', fontSize: '14px', color: '#4a5568' }}>
        Titular: <strong>{titular}</strong>
      </p>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        backgroundColor: '#f7fafc',
        border: '1px dashed #cbd5e0',
        borderRadius: '8px',
        padding: '8px 12px',
        marginTop: '10px'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>
          {numeroSinpe}
        </span>
        <button
          onClick={copiarAlPortapapeles}
          style={{
            backgroundColor: copiado ? '#38a169' : '#3182ce',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          {copiado ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
    </div>
  );
};

export default SinpeCard;