import { useState, useEffect } from 'react';

export default function BarberyPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Estados del cliente y QR
  const [clientPhone, setClientPhone] = useState('');
  const [stamps, setStamps] = useState(3);
  const [qrUrl, setQrUrl] = useState('');

  // Lista de clientes registrados en el panel
  const [clients, setClients] = useState([
    { id: 1, name: 'Carlos Ruiz', phone: '88881111', stamps: 4 },
    { id: 2, name: 'David Brenes', phone: '87654321', stamps: 2 },
    { id: 3, name: 'Kevin Mora', phone: '60123456', stamps: 5 }
  ]);

  // Catalogo de servicios para el público
  const services = [
    { id: 1, name: 'Corte de Cabello Premium', desc: 'Asesoria de imagen, fade/texturizado y peinado', price: '₡6,000' },
    { id: 2, name: 'Perfilado de Barba', desc: 'Delineado preciso con toalla caliente y balsamo', price: '₡4,000' },
    { id: 3, name: 'Combo Isaac Cut', desc: 'Corte completo + Barba + Mascarilla facial', price: '₡9,000' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('barbery_admin_token');
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  const handleGenerateQR = () => {
    if (!clientPhone) return;
    const qrData = encodeURIComponent(`TEL:${clientPhone}|STAMPS:${stamps}`);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`);
  };

  const updateStamps = (id, delta) => {
    setClients(prev => prev.map(client => {
      if (client.id === id) {
        const newStamps = Math.max(0, Math.min(5, client.stamps + delta));
        return { ...client, stamps: newStamps };
      }
      return client;
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('barbery_admin_token', 'active_session');
      setIsAdmin(true);
      setShowLoginModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('barbery_admin_token');
    setIsAdmin(false);
  };

  return (
    <div className="page-container barbery-container" style={{ padding: '32px', color: '#ffffff', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#f2ca50' }}>Isaac Cut Club</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Sistema BarberLoyalty</p>
        </div>

        {isAdmin ? (
          <button 
            onClick={handleLogout}
            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Cerrar Sesion Admin
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            style={{ background: '#12161b', color: '#f2ca50', border: '1px solid #f2ca50', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Panel de Control
          </button>
        )}
      </div>

      {/* VISTA PRIVADA / PANEL ADMIN (SOLO CUANDO INICIAS SESIÓN) */}
      {isAdmin ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Seccion 1: Directorio de Clientes */}
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            <h3 style={{ color: '#f2ca50', marginBottom: '16px' }}>Directorio de Clientes y Fidelizacion</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clients.map(client => (
                <div 
                  key={client.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#0d0f12', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #2d3748' 
                  }}
                >
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '1rem', margin: 0 }}>{client.name}</h4>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Tel: {client.phone}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: client.stamps === 5 ? '#00e676' : '#f2ca50', fontWeight: 'bold' }}>
                        {client.stamps} / 5 Sellos
                      </span>
                      {client.stamps === 5 && (
                        <p style={{ color: '#00e676', fontSize: '0.75rem', margin: 0 }}>Corte Gratis Listo</p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => updateStamps(client.id, -1)}
                        style={{ background: '#374151', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <button 
                        onClick={() => updateStamps(client.id, 1)}
                        style={{ background: '#f2ca50', color: '#000', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seccion 2: Generar QR */}
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            <h3 style={{ color: '#f2ca50', marginBottom: '16px' }}>Generar QR para Nuevo Cliente</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Numero de telefono" 
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#0d0f12', color: '#fff' }}
              />
              <button 
                onClick={handleGenerateQR}
                style={{ background: '#f2ca50', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Generar QR
              </button>
            </div>

            {qrUrl && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <img src={qrUrl} alt="QR Fidelidad" style={{ background: '#fff', padding: '8px', borderRadius: '8px' }} />
                <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>Escanear para verificar puntos acumulados</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* VISTA PUBLICA (LO QUE VEN LOS CLIENTES) */
        <div>
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            <h3 style={{ color: '#f2ca50', marginBottom: '12px' }}>Tarjeta de Fidelizacion</h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Acumula sellos en cada visita y obten tu corte gratis al completar tu tarjeta.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '24px 0' }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num} 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    border: '2px solid #f2ca50', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: num <= stamps ? '#f2ca50' : 'transparent',
                    color: num <= stamps ? '#000' : '#f2ca50',
                    fontWeight: 'bold'
                  }}
                >
                  {num <= stamps ? '✓' : num}
                </div>
              ))}
            </div>
          </div>

          {/* Menu de Servicios */}
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937', marginTop: '24px' }}>
            <h3 style={{ color: '#f2ca50', marginBottom: '16px' }}>Servicios y Tarifas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {services.map(s => (
                <div key={s.id} style={{ background: '#0d0f12', padding: '16px', borderRadius: '8px', border: '1px solid #2d3748' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: '#fff' }}>{s.name}</strong>
                    <span style={{ color: '#f2ca50', fontWeight: 'bold' }}>{s.price}</span>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleLogin} style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #374151', width: '300px' }}>
            <h3 style={{ marginBottom: '12px', color: '#fff' }}>Acceso Administrativo</h3>
            <input 
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#0d0f12', color: '#fff', marginBottom: '12px', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#f2ca50', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Entrar
              </button>
              <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, padding: '10px', background: '#374151', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}