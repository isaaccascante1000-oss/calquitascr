import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', gap: '1rem' }}>
      <NavLink to="/" style={{ color: '#fff' }}>Home</NavLink>
      
      {isAuth ? (
        <>
          <NavLink to="/dashboard" style={{ color: '#fff' }}>Dashboard</NavLink>
          <NavLink to="/perfil" style={{ color: '#fff' }}>Perfil</NavLink>
          <button onClick={handleLogout} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" style={{ color: '#fff' }}>Login</NavLink>
          <NavLink to="/registro" style={{ color: '#fff' }}>Registro</NavLink>
        </>
      )}
    </nav>
  );
}
