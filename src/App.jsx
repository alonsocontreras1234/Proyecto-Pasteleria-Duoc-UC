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
import { crearPedidoDesdeCarrito } from './services/PedidoService';
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

  // Si al abrir la página ya hay un administrador o vendedor conectado, parte en su panel
  const [vistaActual, setVistaActual] = useState(() =>
    usuario?.rol === 'admin' || usuario?.rol === 'vendedor' ? 'admin' : 'inicio'
  );
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
  // Al iniciar sesión: el administrador o vendedor entra directo a su panel, el cliente al inicio
  const handleLogin = (datos) => {
    setUsuario(datos);
    setVistaActual(datos?.rol === 'admin' || datos?.rol === 'vendedor' ? 'admin' : 'inicio');
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

  const handleFinalizarPedido = async (datosPedido) => {
    let pedido = null;
    let avisoBackend = '';
    let registradoEnBackend = false;

    // 1. Si hay una sesión real (no invitado), registrar el pedido en el backend.
    if (usuario?.id && !usuario.esInvitado) {
      try {
        const remoto = await crearPedidoDesdeCarrito({
          usuarioId: usuario.id,
          carrito: datosPedido.items,
          direccionDespacho:
            datosPedido.tipoEntrega === 'retiro'
              ? 'Retiro en tienda - Av. Providencia 1234'
              : datosPedido.cliente.direccion,
          metodoPago: datosPedido.metodoPago || 'EFECTIVO',
          descuentoAplicado: datosPedido.porcentajeDescuento || 0,
        });

        registradoEnBackend = true;
        // La boleta usa los montos del checkout, pero el folio y el código
        // de seguimiento son los reales del backend.
        pedido = {
          ...datosPedido,
          backendId: remoto.id,
          folio: remoto.folio ?? remoto.id,
          codigoSeguimiento: remoto.codigoSeguimiento,
          fecha: remoto.fecha || new Date().toISOString(),
          etapa: remoto.etapa,
          estadoNombre: remoto.estadoNombre,
        };
      } catch (error) {
        const detalle = error?.response?.data;
        const status = error?.response?.status;
        const mensajeServidor =
          (typeof detalle === 'string' && detalle) ||
          detalle?.error ||
          detalle?.message;

        if (status === 401) {
          avisoBackend =
            'Tu sesión expiró o no está autenticada en el servidor. Cierra sesión, vuelve a entrar y repite el pedido.';
        } else if (status === 403) {
          avisoBackend =
            'El servidor rechazó el pedido porque la cuenta no tiene permiso. Inicia sesión con una cuenta válida.';
        } else {
          avisoBackend =
            mensajeServidor ||
            error?.message ||
            'No se pudo registrar el pedido en el servidor.';
        }
      }
    }

    // 2. Si no se pudo registrar en el backend, se guarda en este navegador
    //    para mantener el respaldo offline sin duplicar en el historial.
    if (!registradoEnBackend) {
      const res = crearPedido(datosPedido);
      if (!res.ok) throw new Error(res.error);
      pedido = res.pedido;

      if (!usuario?.id) {
        avisoBackend =
          'El pedido se guardó en este navegador. Tu sesión no tiene el ID del backend (puede ser una sesión antigua): cierra sesión, vuelve a entrar y repite el pedido para que quede registrado en la base de datos.';
      } else if (avisoBackend) {
        avisoBackend = `No se pudo registrar en el servidor: ${avisoBackend} El pedido se guardó en este navegador.`;
      }
    }

    if (avisoBackend) pedido = { ...pedido, avisoBackend };

    setUltimoPedido(pedido);

    // Si canjeó la torta gratis Duoc, se anota el año para que no la pida otra vez
    if (pedido.descuentoTorta > 0 && usuario?.email) {
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

        {/* Panel de Administración: para usuarios con rol "admin" o "vendedor" */}
        {vistaActual === 'admin' && (usuario?.rol === 'admin' || usuario?.rol === 'vendedor') && (
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