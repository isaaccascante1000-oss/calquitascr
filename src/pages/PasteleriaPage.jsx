import { useState, useEffect } from 'react';

export default function PasteleriaPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('catalogo');
  const [cart, setCart] = useState([]);

  // Estados del Simulador
  const [simShape, setSimShape] = useState('Redondo');
  const [simFlavor, setSimFlavor] = useState('Vainilla');
  const [simColor, setSimColor] = useState('#ff69b4');
  const [simTopping, setSimTopping] = useState('Ninguno');

  // Catálogo Base
  const [cakes, setCakes] = useState([
    { id: 1, name: 'Torta de Chocolate Fudge', desc: 'Bizcocho húmedo relleno de ganache.', price: 15000, img: '🍫' },
    { id: 2, name: 'Cheesecake de Fresa', desc: 'Base de galleta con jalea artesanal.', price: 18000, img: '🍓' },
    { id: 3, name: 'Tres Leches Tradicional', desc: 'Receta clásica con merengue flameado.', price: 12000, img: '🥛' }
  ]);

  useEffect(() => {
    if (localStorage.getItem('pasteleria_admin_token')) setIsAdmin(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('pasteleria_admin_token', 'active_session');
      setIsAdmin(true);
      setShowLoginModal(false);
      setActiveTab('admin');
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    alert(`${item.name} agregado al carrito`);
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price, 0);

  // Generador del mensaje de WhatsApp
  const sendToWhatsApp = () => {
    const phoneNumber = "50688888888"; // <-- CAMBIA ESTO POR EL NÚMERO REAL
    const total = calculateTotal();
    const advance = total / 2;

    let message = `¡Hola! Me gustaría realizar una cotización de repostería:\n\n`;
    
    cart.forEach((item, index) => {
      message += `🍰 *Item ${index + 1}:* ${item.name}\n`;
      if (item.desc) message += `   Detalle: ${item.desc}\n`;
      message += `   Precio: ₡${item.price}\n\n`;
    });

    message += `*Total Estimado:* ₡${total}\n`;
    message += `*Adelanto Requerido (50%):* ₡${advance}\n\n`;
    message += `Por favor, confírmeme disponibilidad de agenda y el número para realizar el SINPE Móvil. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="page-container pasteleria-container" style={{ padding: '32px', color: '#ffffff', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Encabezado y Navegación Interna */}
      <div className="pasteleria-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '24px', width: '100%' }}>
        <div className="pasteleria-title-box" style={{ width: '100%' }}>
          <h1 style={{ fontSize: '2rem', color: '#ff69b4', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Repostería</h1>
          <p style={{ color: '#9ca3af', margin: '4px 0 0 0' }}>Catálogo y Creación Personalizada</p>
        </div>
        
        <div className="pasteleria-nav-tabs" style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('catalogo')} style={{ background: activeTab === 'catalogo' ? '#ff69b4' : '#1f2937', color: activeTab === 'catalogo' ? '#000' : '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Catálogo</button>
          <button onClick={() => setActiveTab('simulador')} style={{ background: activeTab === 'simulador' ? '#ff69b4' : '#1f2937', color: activeTab === 'simulador' ? '#000' : '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Simulador 3D</button>
          
          {isAdmin ? (
            <button onClick={() => setActiveTab('admin')} style={{ background: '#00e676', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Panel Admin</button>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Admin</button>
          )}
        </div>
      </div>

      {/* VISTA: CATÁLOGO */}
      {activeTab === 'catalogo' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {cakes.map(cake => (
              <div key={cake.id} style={{ background: '#12161b', border: '1px solid #1f2937', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                  {cake.img}
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{cake.name}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>{cake.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff69b4' }}>₡{cake.price}</span>
                    <button onClick={() => addToCart(cake)} style={{ background: '#ffffff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA: SIMULADOR */}
      {activeTab === 'simulador' && (
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', background: '#0a0c0f', borderRadius: '12px', border: '2px solid #374151', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#ff69b4', fontWeight: 'bold', letterSpacing: '2px' }}>MODO CREACIÓN</div>
            <div style={{ 
              width: simShape === 'Redondo' ? '200px' : '220px', 
              height: simShape === 'Alto' ? '250px' : '150px', 
              backgroundColor: simColor, 
              borderRadius: simShape === 'Redondo' ? '50%' : '8px',
              boxShadow: `0 0 30px ${simColor}40`,
              transition: 'all 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 'bold',
              textShadow: '0px 1px 2px rgba(255,255,255,0.5)',
              textAlign: 'center',
              padding: '16px'
            }}>
              {simFlavor} <br/>+<br/> {simTopping}
            </div>
          </div>

          <div style={{ flex: '1 1 300px', background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            <h3 style={{ textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>Especificaciones</h3>
            
            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Formato / Estructura</label>
            <select value={simShape} onChange={(e) => setSimShape(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px' }}>
              <option>Redondo</option>
              <option>Cuadrado</option>
              <option>Alto (Doble barril)</option>
            </select>

            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Sabor de Masa</label>
            <select value={simFlavor} onChange={(e) => setSimFlavor(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px' }}>
              <option>Vainilla</option>
              <option>Chocolate</option>
              <option>Red Velvet</option>
            </select>

            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Color de Cobertura</label>
            <input type="color" value={simColor} onChange={(e) => setSimColor(e.target.value)} style={{ width: '100%', height: '40px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer' }} />

            <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Toppings Extra</label>
            <select value={simTopping} onChange={(e) => setSimTopping(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '32px', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px' }}>
              <option>Ninguno</option>
              <option>Drip de Chocolate</option>
              <option>Fresas Frescas</option>
              <option>Macarons</option>
            </select>

            <button onClick={() => addToCart({ name: `Pastel Personalizado (${simFlavor})`, price: 25000, desc: `Formato: ${simShape}, Color: ${simColor}, Topping: ${simTopping}` })} style={{ width: '100%', background: '#ff69b4', color: '#000', padding: '16px', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase' }}>
              Confirmar Diseño - ₡25,000
            </button>
          </div>
        </div>
      )}

      {/* VISTA: PANEL ADMIN */}
      {activeTab === 'admin' && isAdmin && (
        <div style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #00e676' }}>
          <h2 style={{ color: '#00e676', margin: '0 0 24px 0' }}>Gestor de Inventario</h2>
          
          {/* Formulario para Agregar Producto */}
          <div style={{ background: '#0d0f12', padding: '20px', borderRadius: '8px', border: '1px solid #1f2937', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#fff', fontSize: '1.2rem' }}>Agregar Nuevo Pastel</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <input type="text" placeholder="Nombre del producto" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
              <input type="number" placeholder="Precio (CRC)" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
              <input type="text" placeholder="URL de la foto real" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
              <input type="text" placeholder="Descripcion de los ingredientes" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
            </div>
            <button style={{ background: '#00e676', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Producto</button>
          </div>

          {/* Lista de Productos Actuales */}
          <h3 style={{ marginBottom: '16px', color: '#fff', fontSize: '1.2rem' }}>Catalogo Activo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cakes.map(cake => (
              <div key={cake.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d0f12', padding: '16px', borderRadius: '8px', border: '1px solid #1f2937' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '2rem' }}>{cake.img}</span>
                  <div>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>{cake.name}</strong>
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Precio: {cake.price} CRC</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: '#374151', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARRITO Y CHECKOUT */}
      {cart.length > 0 && activeTab !== 'admin' && (
        <div style={{ marginTop: '40px', background: '#1f2937', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Tu Pedido ({cart.length} items)</h3>
            <button onClick={() => setCart([])} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Vaciar</button>
          </div>
          
          {cart.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#d1d5db' }}>
              <span>{item.name}</span>
              <span>₡{item.price}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0', paddingTop: '16px', borderTop: '1px solid #4b5563', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total Estimado:</span>
            <span>₡{calculateTotal()}</span>
          </div>
          <div style={{ background: '#374151', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ margin: 0, color: '#fbbf24', fontSize: '0.9rem' }}>
              ⚠️ <strong>Política de Reserva:</strong> Para agendar tu pedido, requerimos un adelanto del 50% (₡{calculateTotal() / 2}) mediante SINPE Móvil o transferencia.
            </p>
          </div>
          <button onClick={sendToWhatsApp} style={{ width: '100%', background: '#25D366', color: '#fff', padding: '16px', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
            Enviar Cotización por WhatsApp
          </button>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleLogin} style={{ background: '#12161b', padding: '24px', borderRadius: '12px', border: '1px solid #374151', width: '300px' }}>
            <h3 style={{ marginBottom: '16px' }}>Acceso Pastelería</h3>
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #374151', background: '#0d0f12', color: '#fff' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#ff69b4', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar</button>
              <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, padding: '10px', background: '#374151', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}