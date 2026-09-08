import { useState, useEffect } from 'react';

export default function BarberyPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const whatsappNumber = "50689363659";

  // Perfil del cliente actual guardado en localStorage
  const [clientProfile, setClientProfile] = useState(null);

  // Estados del modal de registro de cliente nuevo
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Notificación interactiva tras escaneo o registro
  const [notification, setNotification] = useState(null);

  // Tab de navegación para vista pública
  const [activeTab, setActiveTab] = useState('fidelizacion');

  // Lista de clientes registrados para el Panel Administrativo
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('barbery_all_clients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 1, name: 'Carlos Ruiz', phone: '88881111', stamps: 4 },
      { id: 2, name: 'David Brenes', phone: '87654321', stamps: 2 },
      { id: 3, name: 'Kevin Mora', phone: '60123456', stamps: 6 }
    ];
  });

  // Generador de QR del Admin
  const [adminQrPhone, setAdminQrPhone] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // Catálogo de servicios para el público
  const services = [
    { id: 1, name: 'Corte de Cabello Premium', desc: 'Asesoría de imagen, fade/texturizado y peinado', price: '₡6,000' },
    { id: 2, name: 'Perfilado de Barba', desc: 'Delineado preciso con toalla caliente y bálsamo', price: '₡4,000' },
    { id: 3, name: 'Combo Isaac Cut', desc: 'Corte completo + Barba + Mascarilla facial', price: '₡9,000' }
  ];

  // Helper para sincronizar la lista de clientes en localStorage
  const saveClientsList = (newList) => {
    setClients(newList);
    localStorage.setItem('barbery_all_clients', JSON.stringify(newList));
  };

  const updateClientInGlobalList = (profile) => {
    setClients(prev => {
      const existsIndex = prev.findIndex(c => c.phone === profile.phone || c.name.toLowerCase() === profile.name.toLowerCase());
      let updated;
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = { ...updated[existsIndex], stamps: profile.cutsCount };
      } else {
        const newClient = {
          id: Date.now(),
          name: profile.name,
          phone: profile.phone,
          stamps: profile.cutsCount
        };
        updated = [newClient, ...prev];
      }
      localStorage.setItem('barbery_all_clients', JSON.stringify(updated));
      return updated;
    });
  };

  // 1. Inicialización y detección de Escaneo QR al cargar
  useEffect(() => {
    // Verificar sesión admin
    if (localStorage.getItem('barbery_admin_token')) {
      setIsAdmin(true);
    }

    // Cargar perfil actual del cliente
    const savedProfileStr = localStorage.getItem('barbery_client_profile');
    let currentProfile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
    if (currentProfile) {
      setClientProfile(currentProfile);
    }

    // Detectar si el usuario ingresó por un escaneo de código QR (?scan=true o ?qr=...)
    const params = new URLSearchParams(window.location.search);
    const isScan = params.get('scan') === 'true' || params.has('qr');

    if (isScan) {
      // Limpiar el parámetro de la URL sin recargar
      window.history.replaceState({}, document.title, window.location.pathname);

      if (!currentProfile) {
        // CLIENTE NUEVO: Abrir modal de bienvenida y registro
        setShowRegisterModal(true);
      } else {
        // CLIENTE RECURRENTE: Sumar +1 visita automáticamente (máximo 6)
        const previousCount = currentProfile.cutsCount || 0;
        const newCount = previousCount >= 6 ? 6 : previousCount + 1;
        const updated = { ...currentProfile, cutsCount: newCount };

        localStorage.setItem('barbery_client_profile', JSON.stringify(updated));
        setClientProfile(updated);
        updateClientInGlobalList(updated);

        if (newCount === 6) {
          setNotification({
            title: `🎉 ¡Felicidades, ${updated.name}!`,
            message: '¡Has alcanzado tu 6.º corte! Este corte es completamente GRATIS. Muéstrale esta pantalla a Isaac para canjearlo. 💈',
            type: 'free_cut'
          });
        } else {
          setNotification({
            title: `¡Corte #${newCount} confirmado! 💈`,
            message: `¡Hola de nuevo, ${updated.name}! Se ha registrado tu visita con éxito. Te faltan ${6 - newCount} cortes para tu corte gratis.`,
            type: 'scan_success'
          });
        }
      }
    }
  }, []);

  // 2. Registro de cliente nuevo
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert("Por favor completa tu nombre y teléfono.");
      return;
    }

    const newProfile = {
      name: regName.trim(),
      phone: regPhone.trim(),
      cutsCount: 1
    };

    localStorage.setItem('barbery_client_profile', JSON.stringify(newProfile));
    setClientProfile(newProfile);
    setShowRegisterModal(false);
    setRegName('');
    setRegPhone('');

    updateClientInGlobalList(newProfile);

    setNotification({
      title: `¡Bienvenido, ${newProfile.name}! 💈`,
      message: 'Has registrado tu 1.er corte con éxito. ¡Acumula 6 sellos para disfrutar de tu corte gratis!',
      type: 'welcome'
    });
  };

  // Acciones administrativas
  const updateStamps = (id, delta) => {
    const updated = clients.map(client => {
      if (client.id === id) {
        const newStamps = Math.max(0, Math.min(6, client.stamps + delta));
        // Si es el cliente actual en este dispositivo, sincronizar su perfil
        if (clientProfile && clientProfile.phone === client.phone) {
          const syncProfile = { ...clientProfile, cutsCount: newStamps };
          setClientProfile(syncProfile);
          localStorage.setItem('barbery_client_profile', JSON.stringify(syncProfile));
        }
        return { ...client, stamps: newStamps };
      }
      return client;
    });
    saveClientsList(updated);
  };

  const resetClientCard = (id) => {
    const updated = clients.map(client => {
      if (client.id === id) {
        if (clientProfile && clientProfile.phone === client.phone) {
          const syncProfile = { ...clientProfile, cutsCount: 0 };
          setClientProfile(syncProfile);
          localStorage.setItem('barbery_client_profile', JSON.stringify(syncProfile));
        }
        return { ...client, stamps: 0 };
      }
      return client;
    });
    saveClientsList(updated);
  };

  const handleGenerateQR = () => {
    // Genera URL que apunta directamente a /barbery?scan=true
    const targetUrl = `${window.location.origin}/barbery?scan=true`;
    const qrData = encodeURIComponent(targetUrl);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`);
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

  const cutsCount = clientProfile ? (clientProfile.cutsCount || 0) : 0;

  return (
    <div className="page-container barbery-container" style={{ padding: '32px', color: '#ffffff', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Encabezado */}
      <div className="barbery-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 900, 
            margin: 0, 
            background: 'linear-gradient(90deg, #3b82f6 0%, #ffffff 50%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            Isaac Cut Club
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💈</span> Sistema BarberLoyalty
          </p>
        </div>

        {isAdmin ? (
          <button 
            onClick={handleLogout}
            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}
          >
            Cerrar Sesión Admin
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            style={{ 
              background: '#0d0f12', 
              color: '#ffffff', 
              border: '1px solid #3b82f6', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            💈 Panel de Control
          </button>
        )}
      </div>

      {/* Modal / Notificación flotante de confirmación */}
      {notification && (
        <div style={{
          background: notification.type === 'free_cut' 
            ? 'linear-gradient(135deg, #1e1b4b 0%, #7f1d1d 100%)' 
            : '#12161b',
          border: notification.type === 'free_cut' ? '2px solid #ef4444' : '1px solid #3b82f6',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', color: notification.type === 'free_cut' ? '#ef4444' : '#3b82f6', fontSize: '1.2rem', fontWeight: 800 }}>
              {notification.title}
            </h3>
            <p style={{ margin: 0, color: '#f4f4f5', fontSize: '0.95rem', lineHeight: 1.4 }}>
              {notification.message}
            </p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            style={{ background: '#374151', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Entendido
          </button>
        </div>
      )}

      {/* VISTA PRIVADA / PANEL ADMIN (SOLO CUANDO INICIAS SESIÓN) */}
      {isAdmin ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Sección 1: Directorio de Clientes */}
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>Directorio de Clientes y Fidelización</h3>
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
                    border: client.stamps === 6 ? '1px solid #ef4444' : '1px solid #2d3748',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '1rem', margin: 0 }}>{client.name}</h4>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '4px' }}>Tel: {client.phone}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: client.stamps === 6 ? '#ef4444' : '#3b82f6', fontWeight: 'bold', fontSize: '1rem' }}>
                        {client.stamps} / 6 Sellos
                      </span>
                      {client.stamps === 6 && (
                        <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: 'bold' }}>🎉 ¡Corte Gratis Listo!</p>
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
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                      {client.stamps === 6 && (
                        <button 
                          onClick={() => resetClientCard(client.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0 10px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                          title="Reiniciar a 0 sellos tras canjear"
                        >
                          Reiniciar Tarjeta
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 2: Generar QR de Fidelización */}
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '16px' }}>Código QR para Escaneo en Barbería</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '16px' }}>
              Coloca este código QR en el mostrador para que los clientes lo escaneen con la cámara de su teléfono y registren automáticamente sus visitas.
            </p>
            <button 
              onClick={handleGenerateQR}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)' }}
            >
              Mostrar Código QR Oficial
            </button>

            {qrUrl && (
              <div style={{ marginTop: '20px', textAlign: 'center', background: '#0d0f12', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'inline-block' }}>
                <img src={qrUrl} alt="QR BarberLoyalty" style={{ background: '#fff', padding: '12px', borderRadius: '10px' }} />
                <p style={{ marginTop: '10px', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Escanea para sumar cortes en BarberLoyalty
                </p>
                <p style={{ color: '#71717a', fontSize: '0.8rem', margin: 0 }}>
                  URL: {window.location.origin}/barbery?scan=true
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* VISTA PÚBLICA (CLIENTES) */
        <div>

          {/* ══════ TARJETA DE FIDELIZACIÓN (SIEMPRE VISIBLE) ══════ */}
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.35)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ color: '#3b82f6', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                <span>💈</span> {clientProfile ? `¡Hola de nuevo, ${clientProfile.name}!` : 'Tarjeta de Fidelización'}
              </h3>
              
              {!clientProfile ? (
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Activar mi Tarjeta
                </button>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#9ca3af', background: '#0d0f12', padding: '4px 10px', borderRadius: '20px', border: '1px solid #27272a' }}>
                  📱 {clientProfile.phone}
                </span>
              )}
            </div>

            <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '0.95rem' }}>
              Acumula sellos en cada visita escaneando nuestro código QR. ¡Tu <strong>6.º corte es GRATIS</strong>!
            </p>

            {/* Cuadrícula de 6 Sellos */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '24px 0', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const isCompleted = num <= cutsCount;
                const isGrandPrize = num === 6;

                if (isGrandPrize) {
                  return (
                    <div 
                      key={num} 
                      style={{ 
                        width: '58px', 
                        height: '58px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: isCompleted ? '0.85rem' : '0.75rem',
                        transition: 'all 0.3s ease',
                        cursor: 'default',
                        ...(isCompleted ? {
                          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                          color: '#ffffff',
                          border: '2px solid #fca5a5',
                          boxShadow: '0 0 16px rgba(239, 68, 68, 0.8)'
                        } : {
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: '#ef4444',
                          border: '2px dashed #ef4444'
                        })
                      }}
                      title="6.º Corte GRATIS"
                    >
                      <span>{isCompleted ? '✓' : '🎁'}</span>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GRATIS</span>
                    </div>
                  );
                }

                return (
                  <div 
                    key={num} 
                    style={{ 
                      width: '52px', 
                      height: '52px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.15rem',
                      transition: 'all 0.2s ease',
                      ...(isCompleted ? {
                        background: '#3b82f6',
                        color: '#ffffff',
                        border: '2px solid #60a5fa',
                        boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)'
                      } : {
                        background: 'transparent',
                        color: '#9ca3af',
                        border: '2px solid #3f3f46'
                      })
                    }}
                  >
                    {isCompleted ? '✓' : num}
                  </div>
                );
              })}
            </div>

            {/* Mensaje de Celebración si llegó al 6to corte */}
            {cutsCount === 6 && (
              <div style={{
                marginTop: '16px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                border: '2px solid #ef4444',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.35)'
              }}>
                <h4 style={{ color: '#ef4444', fontSize: '1.25rem', margin: '0 0 6px 0', fontWeight: 900 }}>
                  🎉 ¡CORTE GRATIS DESBLOQUEADO!
                </h4>
                <p style={{ color: '#ffffff', fontSize: '0.95rem', margin: 0 }}>
                  Felicidades <strong>{clientProfile?.name}</strong>, tu 6.º corte es <strong>100% GRATIS</strong>. Muéstrale esta pantalla a Isaac para canjearlo.
                </p>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════
              DOCK FLOTANTE / NUBE DE ACCESOS DIRECTOS
          ══════════════════════════════════════════════ */}
          <div style={{
            marginTop: '15px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(24, 24, 27, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '999px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
          }}>
            {[
              { id: 'servicios', icon: '💈', label: 'Servicios' },
              { id: 'cortes', icon: '✂️', label: 'Cortes' },
              { id: 'ofertas', icon: '🔥', label: 'Ofertas' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(isActive ? '' : tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: isActive ? '8px 18px' : '8px 14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#9ca3af',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 0 12px rgba(59, 130, 246, 0.5)' : 'none',
                    outline: 'none',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ══════ SECCIÓN: SERVICIOS ══════ */}
          {activeTab === 'servicios' && (
          <div style={{ background: '#12161b', padding: '24px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
              <span>✂️</span> Servicios y Tarifas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {services.map(s => (
                <div key={s.id} style={{ background: '#0d0f12', padding: '18px', borderRadius: '10px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{s.name}</strong>
                      <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.15rem' }}>{s.price}</span>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                  </div>

                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola! Me gustaría agendar una cita para el servicio: ${s.name} (${s.price})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                      color: '#ffffff',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    Agendar Cita 💈
                  </a>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* ══════ TAB: CORTES MODERNOS ══════ */}
          {activeTab === 'cortes' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '18px'
            }}>
              <h3 style={{
                color: '#ffffff', fontSize: '1.25rem', fontWeight: 900,
                margin: 0, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                ✂️ Galería de Cortes Modernos
              </h3>
              <span style={{
                background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
                fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: '20px', border: '1px solid rgba(59,130,246,0.4)',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>Desliza →</span>
            </div>

            {/* Carrusel deslizable */}
            <div style={{
              display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px',
              scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #12161b'
            }}>
              {[
                {
                  emoji: '✂️', name: 'Mid Skin Fade',
                  sub: 'Degradado medio al cero',
                  tag: '🔥 Más Pedido', tagColor: '#ef4444',
                  bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  accent: '#3b82f6'
                },
                {
                  emoji: '🌿', name: 'Textured French Crop',
                  sub: 'Texturizado con flequillo',
                  tag: '⭐ Tendencia', tagColor: '#eab308',
                  bg: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)',
                  accent: '#eab308'
                },
                {
                  emoji: '💫', name: 'Low Taper Fade',
                  sub: 'Sutil y moderno',
                  tag: '✨ Elegante', tagColor: '#a78bfa',
                  bg: 'linear-gradient(135deg, #1e1b2e 0%, #110f1a 100%)',
                  accent: '#a78bfa'
                },
                {
                  emoji: '⚡', name: 'Buzz Cut Fade',
                  sub: 'Diseño militar estilizado',
                  tag: '💪 Atrevido', tagColor: '#ef4444',
                  bg: 'linear-gradient(135deg, #1f1010 0%, #0f0a0a 100%)',
                  accent: '#ef4444'
                },
                {
                  emoji: '🔥', name: 'Mullet Moderno / Burst Fade',
                  sub: 'Estilo urbano / atrevido',
                  tag: '🎨 Urban Style', tagColor: '#f97316',
                  bg: 'linear-gradient(135deg, #1f160a 0%, #100c04 100%)',
                  accent: '#f97316'
                },
                {
                  emoji: '💈', name: 'Combo Isaac Cut',
                  sub: 'Corte clásico + perfilado de barba',
                  tag: '💈 Clásico Moderno', tagColor: '#3b82f6',
                  bg: 'linear-gradient(135deg, #0d1a2e 0%, #060d18 100%)',
                  accent: '#3b82f6'
                }
              ].map((cut, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: '200px', maxWidth: '200px',
                    background: cut.bg,
                    borderRadius: '16px',
                    border: `1px solid ${cut.accent}33`,
                    padding: '20px 16px 16px',
                    scrollSnapAlign: 'start',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px ${cut.accent}22`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.7), 0 0 0 1px ${cut.accent}55`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px ${cut.accent}22`;
                  }}
                >
                  {/* Ícono grande */}
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '3rem', display: 'block', lineHeight: 1 }}>{cut.emoji}</span>
                  </div>

                  {/* Etiqueta de estilo */}
                  <span style={{
                    display: 'inline-block',
                    background: `${cut.tagColor}22`,
                    color: cut.tagColor,
                    fontSize: '0.68rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: '20px',
                    border: `1px solid ${cut.tagColor}55`,
                    marginBottom: '8px', alignSelf: 'flex-start'
                  }}>
                    {cut.tag}
                  </span>

                  {/* Nombre */}
                  <strong style={{
                    color: '#ffffff', fontSize: '0.95rem',
                    display: 'block', marginBottom: '4px', lineHeight: 1.3
                  }}>
                    {cut.name}
                  </strong>
                  <p style={{
                    color: '#9ca3af', fontSize: '0.78rem',
                    margin: '0 0 14px 0', lineHeight: 1.4
                  }}>
                    {cut.sub}
                  </p>

                  {/* Botón WhatsApp */}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola! Me gustaría pedir el estilo: ${cut.name} (${cut.sub})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '8px 12px', borderRadius: '8px',
                      background: `${cut.accent}22`,
                      color: cut.accent,
                      border: `1px solid ${cut.accent}55`,
                      fontSize: '0.78rem', fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = cut.accent;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${cut.accent}22`;
                      e.currentTarget.style.color = cut.accent;
                    }}
                  >
                    Pedir este estilo 💬
                  </a>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* ══════ TAB: OFERTAS ══════ */}
          {activeTab === 'ofertas' && (
          <div style={{
            background: '#12161b',
            borderRadius: '16px',
            border: '1px solid rgba(239,68,68,0.3)',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            {/* Encabezado de sección */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              <h3 style={{
                color: '#ef4444', fontSize: '1.25rem', fontWeight: 900,
                margin: 0, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                🏷️ Zona de Ofertas
              </h3>
              <span style={{
                background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px',
                borderRadius: '20px', border: '1px solid rgba(239,68,68,0.4)',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                ⏳ Tiempo Limitado
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {[
                {
                  badge: '🔥 Oferta del Mes',
                  title: 'Combo Estudiante',
                  desc: 'Corte básico + perfilado de barba. Válido con carnet universitario.',
                  original: '₡10,000',
                  price: '₡7,500',
                  saving: 'Ahorrás ₡2,500',
                  accent: '#ef4444',
                  cta: 'Quiero esta oferta 🎓'
                },
                {
                  badge: '⭐ Pack Premium',
                  title: 'Combo Isaac Cut + Mascarilla',
                  desc: 'Corte completo + barba perfilada + mascarilla facial hidratante.',
                  original: '₡13,000',
                  price: '₡9,000',
                  saving: 'Ahorrás ₡4,000',
                  accent: '#3b82f6',
                  cta: 'Reservar Combo 💈'
                },
                {
                  badge: '💇 Primera Visita',
                  title: 'Bienvenida Isaac Cut',
                  desc: 'Descuento especial en tu primer corte. Solo con previa cita por WhatsApp.',
                  original: '₡6,000',
                  price: '₡4,500',
                  saving: 'Ahorrás ₡1,500',
                  accent: '#eab308',
                  cta: 'Reclamar descuento ✨'
                }
              ].map((offer, i) => (
                <div
                  key={i}
                  style={{
                    background: '#0d0f12',
                    borderRadius: '12px',
                    border: `1px solid ${offer.accent}33`,
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${offer.accent}33`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Franja decorativa superior */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: `linear-gradient(90deg, ${offer.accent} 0%, transparent 100%)`
                  }} />

                  {/* Badge */}
                  <span style={{
                    display: 'inline-block', alignSelf: 'flex-start',
                    background: `${offer.accent}20`, color: offer.accent,
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '20px', border: `1px solid ${offer.accent}44`,
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    {offer.badge}
                  </span>

                  {/* Título */}
                  <strong style={{ color: '#ffffff', fontSize: '1rem', lineHeight: 1.3 }}>
                    {offer.title}
                  </strong>

                  {/* Descripción */}
                  <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                    {offer.desc}
                  </p>

                  {/* Precios */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{
                      color: offer.accent, fontWeight: 900, fontSize: '1.4rem'
                    }}>{offer.price}</span>
                    <span style={{
                      color: '#6b7280', fontSize: '0.85rem',
                      textDecoration: 'line-through'
                    }}>{offer.original}</span>
                  </div>

                  {/* Tag de ahorro */}
                  <span style={{
                    display: 'inline-block', alignSelf: 'flex-start',
                    background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                    fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '20px', border: '1px solid rgba(16,185,129,0.35)'
                  }}>
                    ✅ {offer.saving}
                  </span>

                  {/* CTA WhatsApp */}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola! Quiero aprovechar la oferta: ${offer.title} por ${offer.price}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center', marginTop: '4px',
                      padding: '10px 16px', borderRadius: '8px',
                      background: `linear-gradient(135deg, ${offer.accent}cc 0%, ${offer.accent} 100%)`,
                      color: '#ffffff', fontWeight: 700, fontSize: '0.85rem',
                      textDecoration: 'none',
                      boxShadow: `0 4px 14px ${offer.accent}44`,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.opacity = '0.88';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {offer.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
          )}

        </div>
      )}

      {/* Modal de Registro para Cliente Nuevo (Primera Visita / Escaneo) */}
      {showRegisterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <form onSubmit={handleRegisterSubmit} style={{ background: '#12161b', padding: '28px', borderRadius: '16px', border: '1px solid #3b82f6', width: '100%', maxWidth: '360px', boxShadow: '0 10px 40px rgba(0,0,0,0.9)' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.5rem' }}>💈</span>
              <h3 style={{ margin: '8px 0 4px', color: '#fff', fontSize: '1.3rem' }}>¡Bienvenido a Isaac Cut Club!</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
                Regístrate para activar tu tarjeta de fidelidad y registrar tu 1.er corte.
              </p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '4px' }}>Nombre Completo</label>
              <input 
                type="text"
                placeholder="Ej. Jonathan Solís"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #374151', background: '#0d0f12', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.8rem', marginBottom: '4px' }}>Número de Teléfono</label>
              <input 
                type="tel"
                placeholder="Ej. 8888-8888"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #374151', background: '#0d0f12', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)' }}>
                Activar Tarjeta 💈
              </button>
              <button type="button" onClick={() => setShowRegisterModal(false)} style={{ padding: '12px 16px', background: '#27272a', color: '#a1a1aa', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Login Admin */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
          <form onSubmit={handleLogin} style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #3b82f6', width: '100%', maxWidth: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            <h3 style={{ marginBottom: '12px', color: '#fff' }}>Acceso Administrativo 💈</h3>
            <input 
              type="password"
              autoComplete="current-password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#0d0f12', color: '#fff', marginBottom: '12px', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '12px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}>
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