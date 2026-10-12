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
import { AdminPanel } from './components/admin/AdminPanel';
import { crearPedido } from './data/pedidosDB';
import { actualizarUsuario } from './data/db';

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

  // Si al abrir la página ya hay un administrador conectado, parte en su panel
  const [vistaActual, setVistaActual] = useState(() => (usuario?.rol === 'admin' ? 'admin' : 'inicio'));
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
  // Al iniciar sesión: el administrador entra directo a su panel, el cliente al inicio
  const handleLogin = (datos) => { 
    setUsuario(datos); 
    setVistaActual(datos?.rol === 'admin' ? 'admin' : 'inicio'); 
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

  // Un mismo producto con distinta dedicatoria se guarda como otra línea del carrito
  // (si es el mismo producto con la misma dedicatoria, solo se suma la cantidad)
  const mismaLinea = (item, producto) =>
    item.id === producto.id && (item.dedicatoria || '').trim() === (producto.dedicatoria || '').trim();

  const agregarAlCarrito = (producto) => {
    const cantidadAgregar = Number(producto.cantidad) || 1;
    const dedicatoria = (producto.dedicatoria || '').trim();

    setCarrito(prev => {
      const existe = prev.find(item => mismaLinea(item, producto));
      if (existe) {
        return prev.map(item =>
          mismaLinea(item, producto)
            ? { ...item, cantidad: (Number(item.cantidad) || 1) + cantidadAgregar }
            : item
        );
      }
      return [...prev, { ...producto, dedicatoria, cantidad: cantidadAgregar }];
    });
  };

  const handleFinalizarPedido = (datosPedido) => {
    // Guardar el pedido en la base de datos simulada (pedidosDB.js)
    const res = crearPedido(datosPedido);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    setUltimoPedido(res.pedido);

    // Si canjeó la torta gratis Duoc, se anota el año para que no la pida otra vez
    if (res.pedido.descuentoTorta > 0 && usuario?.email) {
      const actualizado = actualizarUsuario(usuario.email, { tortaCanjeadaAnio: new Date().getFullYear() });
      if (actualizado.ok) setUsuario(actualizado.usuario);
    }
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
          <Seguimiento ultimoPedido={ultimoPedido} />
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

        {/* Panel de Administración: solo para usuarios con rol "admin" */}
        {vistaActual === 'admin' && usuario?.rol === 'admin' && (
          <AdminPanel usuario={usuario} />
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
        onQuitar={(producto) => setCarrito(prev => prev.filter(i => !mismaLinea(i, producto)))}
        onVaciar={() => setCarrito([])}
        setVistaActual={setVistaActual}
      />
    </div>
  );
}