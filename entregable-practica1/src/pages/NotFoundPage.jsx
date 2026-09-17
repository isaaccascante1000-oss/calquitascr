import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>404 - Página no encontrada</h2>
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}
