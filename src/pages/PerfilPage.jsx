import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PerfilPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', color: '#fff' }}>
      <h2>Mi Perfil</h2>
      <p style={{ color: '#888', marginTop: '10px' }}>
        Bienvenido a tu perfil. Aquí puedes gestionar tu cuenta.
      </p>

      <div style={{
        marginTop: '30px',
        backgroundColor: '#161922',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #2a2e3d',
        display: 'inline-block'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Opciones de cuenta</h3>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 16px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
