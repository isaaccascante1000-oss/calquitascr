import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">
        <h2>Aisaac Central</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Puntos brillantes integrados al lado del nombre */}
            <div className="brand-dots" style={{ marginRight: '8px' }}>
              <span className="glow-dot blue"></span>
              <span className="glow-dot white"></span>
              <span className="glow-dot red"></span>
            </div>
            {/* Texto con el "CR" en rojo */}
            <span style={{ color: '#faf6f7ff' }}>Calquitas<strong style={{ color: '#ce1126' }}>CR</strong></span>
          </div>
        </NavLink>

        <NavLink to="/pasteleria" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Pasteleria
        </NavLink>

        <NavLink to="/barbery" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Barbery
        </NavLink>
      </nav>
    </aside>
  );
}