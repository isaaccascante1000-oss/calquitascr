import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botón hamburguesa flotante para celulares */}
      <button 
        onClick={toggleSidebar}
        className="mobile-menu-btn"
        aria-label="Menú"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay oscuro de fondo cuando el menú está abierto en móvil */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Contenedor del Sidebar */}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>Aisaac Central</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            onClick={closeSidebar}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="brand-dots" style={{ marginRight: '8px' }}>
                <span className="glow-dot blue"></span>
                <span className="glow-dot white"></span>
                <span className="glow-dot red"></span>
              </div>
              <span style={{ color: '#faf6f7ff' }}>Calquitas<strong style={{ color: '#ce1126' }}>CR</strong></span>
            </div>
          </NavLink>

          <NavLink 
            to="/pasteleria" 
            onClick={closeSidebar}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Pastelería
          </NavLink>

          <NavLink 
            to="/barbery" 
            onClick={closeSidebar}
            className={({ isActive }) => (isActive ? 'nav-link nav-link-barbery active' : 'nav-link nav-link-barbery')}
          >
            <span className="brand-blue">barbery </span>
            <span className="brand-white">Cut </span>
            <span className="brand-red">Loyalty</span>  
          </NavLink>
        </nav>
      </aside>
    </>
  );
}