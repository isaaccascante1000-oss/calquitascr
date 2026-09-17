import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="mobile-menu-btn"
        aria-label="Menú"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>Aisaac Central</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="brand-dots" style={{ marginRight: '8px' }}>
                <span className="glow-dot blue"></span>
                <span className="glow-dot white"></span>
                <span className="glow-dot red"></span>
              </div>
              <span style={{ color: '#faf6f7ff' }}>Calquitas<strong style={{ color: '#ce1126' }}>CR</strong></span>
            </div>
          </NavLink>
          <NavLink to="/pasteleria" onClick={closeSidebar} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Pastelería
          </NavLink>
          <NavLink to="/barbery" onClick={closeSidebar} className={({ isActive }) => (isActive ? 'nav-link nav-link-barbery active' : 'nav-link nav-link-barbery')}>
            <span className="brand-blue">barbery </span>
            <span className="brand-white">Cut </span>
            <span className="brand-red">Loyalty</span>  
          </NavLink>

          {isAuth ? (
            <>
              <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Reporte de Ventas
              </NavLink>
              <NavLink to="/perfil" onClick={closeSidebar} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Mi Perfil
              </NavLink>
              <button 
                onClick={handleLogout} 
                className="nav-link" 
                style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#ef4444', width: '100%', fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={closeSidebar} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Iniciar Sesión
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}