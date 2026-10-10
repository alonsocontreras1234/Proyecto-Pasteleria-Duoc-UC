import React, { useState, useEffect } from 'react'; // <-- Se agrega useEffect aquí
import { Navbar } from './components/Navbar';
import { NuestrosPasteles } from './components/NuestrosPasteles';
import { Historia } from './components/Historia';
import { Noticias } from './components/Noticias';
import { Catalogo } from './components/Catalogo';
import { Seguimiento } from './components/Seguimiento';
import { Perfil } from './components/Perfil';
import { Checkout } from './components/Checkout';
import { Boleta } from './components/Boleta';
import { Footer } from './components/Footer';
import { CarritoModal } from './components/CarritoModal';

export default function App() {
  // =========================================================
  // ESTADOS PRINCIPALES CON PERSISTENCIA EN LOCALSTORAGE
  // =========================================================
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario_mil_sabores');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito_mil_sabores');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [vistaActual, setVistaActual] = useState('inicio');
  const [showCarritoModal, setShowCarritoModal] = useState(false);
  const [ultimoPedido, setUltimoPedido] = useState(null);

  // Guardar en localStorage cuando cambie la sesión del usuario
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario_mil_sabores', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario_mil_sabores');
    }
  }, [usuario]);

  // Guardar en localStorage cuando cambien los productos del carrito
  useEffect(() => {
    localStorage.setItem('carrito_mil_sabores', JSON.stringify(carrito));
  }, [carrito]);

  // =========================================================
  // MANEJADORES DE EVENTOS Y NAVEGACIÓN
  // =========================================================
  const handleLogin = (datos) => { 
    setUsuario(datos); 
    setVistaActual('inicio'); 
  };

  const handleInvitado = () => { 
    setUsuario({ esInvitado: true, nombre: 'Invitado' }); 
    setVistaActual('inicio'); 
  };

  const handleLogout = () => { 
    setUsuario(null); 
    setCarrito([]); 
    localStorage.removeItem('usuario_mil_sabores');
    localStorage.removeItem('carrito_mil_sabores');
  };

  const agregarAlCarrito = (producto) => {
    const cantidadAgregar = Number(producto.cantidad) || 1;

    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: (Number(item.cantidad) || 1) + cantidadAgregar,
                dedicatoria: producto.dedicatoria || item.dedicatoria
              }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: cantidadAgregar }];
    });
  };

  const handleFinalizarPedido = (datosPedido) => {
    setUltimoPedido(datosPedido);
    setCarrito([]);
    setVistaActual('boleta');
  };

  // Si no se ha seleccionado sesión ni modo invitado, se muestra el Login/Registro
  if (!usuario) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
        <main style={{ flex: 1, padding: '20px 0' }}>
          <Perfil usuario={null} onLogin={handleLogin} onInvitado={handleInvitado} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        usuario={usuario}
        carritoCount={carrito.reduce((acc, item) => acc + (Number(item.cantidad) || 1), 0)}
        onOpenCarrito={() => setShowCarritoModal(true)}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
      />

      <main style={{ flex: 1 }}>
        {vistaActual === 'inicio' && (
          <>
            <NuestrosPasteles onAgregarAlCarrito={agregarAlCarrito} />
            <Historia />
            <Noticias />
          </>
        )}

        {vistaActual === 'catalogo' && (
          <Catalogo onAgregarAlCarrito={agregarAlCarrito} />
        )}

        {vistaActual === 'seguimiento' && (
          <Seguimiento />
        )}

        {vistaActual === 'perfil' && (
          <Perfil usuario={usuario} onLogin={handleLogin} onLogout={handleLogout} />
        )}

        {vistaActual === 'checkout' && (
          <Checkout 
            carrito={carrito} 
            usuario={usuario} 
            onFinalizarPedido={handleFinalizarPedido}
            setVistaActual={setVistaActual}
          />
        )}

        {vistaActual === 'boleta' && (
          <Boleta 
            pedido={ultimoPedido} 
            setVistaActual={setVistaActual}
          />
        )}
      </main>

      <Footer />

      <CarritoModal
        show={showCarritoModal}
        onClose={() => setShowCarritoModal(false)}
        carrito={carrito}
        onQuitar={(id) => setCarrito(prev => prev.filter(i => i.id !== id))}
        onVaciar={() => setCarrito([])}
        setVistaActual={setVistaActual}
      />
    </div>
  );
}