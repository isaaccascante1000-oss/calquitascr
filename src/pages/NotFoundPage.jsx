import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '20px',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '10px', color: '#ef4444' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Página no encontrada</h2>
      <p style={{ color: '#8b949e', marginBottom: '30px' }}>
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link 
        to="/"
        style={{
          padding: '12px 24px',
          backgroundColor: '#4F46E5',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
