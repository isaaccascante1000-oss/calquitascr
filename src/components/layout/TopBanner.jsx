import React from 'react';
import { Link } from 'react-router-dom';
import './TopBanner.css';

export default function TopBanner() {
  return (
    <div className="top-banner" role="status" aria-live="polite">
      <p>
        ¡Conoce nuestras otras tiendas! 🡆{' '}
      </p>
    </div>
  );
}