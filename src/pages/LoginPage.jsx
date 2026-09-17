import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    setError('');

    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setError('Demasiados intentos fallidos. Intenta de nuevo en 30 segundos.');
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
          setError('');
        }, 30000);
      } else {
        setError(`Credenciales incorrectas. Te quedan ${3 - newAttempts} intento(s).`);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#161922',
        border: '1px solid #2a2e3d',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.5rem' }}>Iniciar Sesión</h2>
        <p style={{ color: '#8b949e', marginBottom: '24px', fontSize: '0.9rem' }}>
          Ingresa a tu cuenta para continuar
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#c9d1d9', marginBottom: '6px', fontSize: '0.875rem' }}>
              Usuario
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              autoComplete="new-password"
              defaultValue=""
              required
              disabled={isLocked}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #30363d',
                backgroundColor: isLocked ? '#2a2e3d' : '#0d1117',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#c9d1d9', marginBottom: '6px', fontSize: '0.875rem' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              autoComplete="new-password"
              defaultValue=""
              required
              disabled={isLocked}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #30363d',
                backgroundColor: isLocked ? '#2a2e3d' : '#0d1117',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={isLocked}
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: isLocked ? '#4b5563' : '#4F46E5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLocked ? 'Bloqueado (30s)' : 'Ingresar'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? <Link to="/registro" style={{ color: '#4F46E5', textDecoration: 'none', pointerEvents: isLocked ? 'none' : 'auto' }}>Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
