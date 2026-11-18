import { useEffect, useState } from 'react';
import { buscarPedido, obtenerPedidoPorCodigo } from '../data/pedidosDB';
import { buscarPedidoEnBackend } from '../services/PedidoService';

// Convierte un pedido local (localStorage) en los datos que muestra esta vista
const armarVistaLocal = (p) => ({
  id: p.codigoSeguimiento,
  etapa: p.etapa,
  estadoNombre: p.estadoNombre,
  estimado: p.tipoEntrega === 'retiro'
    ? 'Disponible para retiro en tienda'
    : 'Dentro de las próximas 24 horas',
  direccion: p.tipoEntrega === 'retiro'
    ? 'Retiro en Taller Central - Av. Providencia 1234'
    : p.cliente?.direccion || 'Sin dirección registrada',
  items: (p.items || []).map(it => `${it.cantidad}x ${it.nombre}`)
});

// Convierte un pedido del backend (ya adaptado por PedidoService) en la vista
const armarVistaBackend = (p) => ({
  id: p.codigoSeguimiento,
  etapa: p.etapa,
  estadoNombre: p.estadoNombre,
  estimado: 'Dentro de las próximas 24 horas',
  direccion: p.direccionDespacho || 'Sin dirección registrada',
  items: (p.items || []).map(it => `${it.cantidad}x ${it.nombre}`)
});

export const Seguimiento = ({ ultimoPedido }) => {
  const [codigo, setCodigo] = useState(ultimoPedido?.codigoSeguimiento || '');
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [errorBackend, setErrorBackend] = useState('');

  // Si viene de la boleta y existe en localStorage, mostrar ese pedido de inmediato
  const [pedido, setPedido] = useState(() => {
    const guardado = ultimoPedido ? obtenerPedidoPorCodigo(ultimoPedido.codigoSeguimiento) : null;
    if (guardado) return armarVistaLocal(guardado);
    if (ultimoPedido && !/^(?:PED-)?\d+$/i.test(String(ultimoPedido.codigoSeguimiento || '').trim())) {
      return armarVistaLocal(ultimoPedido);
    }
    return null;
  });

  // Si el pedido recién creado quedó en el backend (código PED-000X) y no en
  // localStorage, se carga automáticamente al entrar desde la boleta.
  useEffect(() => {
    const texto = ultimoPedido?.codigoSeguimiento;
    if (!texto) return undefined;
    if (obtenerPedidoPorCodigo(texto)) return undefined;
    if (!/^(?:PED-)?\d+$/i.test(texto.trim())) return undefined;

    let activo = true;

    const cargar = async () => {
      try {
        const remoto = await buscarPedidoEnBackend(texto);
        if (activo && remoto) setPedido(armarVistaBackend(remoto));
      } catch (err) {
        const status = err?.response?.status;
        if (activo && (status === 401 || status === 403)) {
          setErrorBackend('Inicia sesión con la cuenta que hizo el pedido para consultarlo en el servidor.');
        }
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [ultimoPedido?.codigoSeguimiento]);

  // Busca primero en el backend (por ID numérico o PED-0001) y luego en localStorage
  const handleBuscar = async (e) => {
    e.preventDefault();
    setBuscando(true);
    setNoEncontrado(false);
    setErrorBackend('');

    const texto = codigo.trim();
    let encontrado = null;

    try {
      const remoto = await buscarPedidoEnBackend(texto);
      if (remoto) encontrado = armarVistaBackend(remoto);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setErrorBackend('Inicia sesión con la cuenta que hizo el pedido para consultarlo en el servidor.');
      } else if (status !== 404 && texto.match(/^(?:PED-)?\d+$/i)) {
        setErrorBackend('No se pudo conectar con el backend para buscar ese ID.');
      }
    }

    if (!encontrado) {
      const local = buscarPedido(texto);
      if (local) encontrado = armarVistaLocal(local);
    }

    setPedido(encontrado);
    setNoEncontrado(!encontrado);
    setBuscando(false);
  };

  return (
    <section className="main-container">
      {/* ENCABEZADO */}
      <div className="seguimiento-header-exact">
        <h2 className="titulo-seguimiento-script">Seguimiento de Envíos en Tiempo Real</h2>
        <p className="subtitulo-seguimiento">
          Monitorea cada etapa de tu pedido artesanal desde que ingresa al horno de nuestro taller hasta que llega a la puerta de tu hogar.
        </p>
      </div>

      {/* TARJETA DE BÚSQUEDA DE PEDIDO */}
      <div className="card-buscar-seguimiento">
        <form onSubmit={handleBuscar} className="form-buscar-seguimiento">
          <input
            type="text"
            className="input-rastreo-exact"
            placeholder="Código (PMS-2026-8942), ID del pedido (1) o RUN..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button type="submit" className="btn-rastrear-exact" disabled={buscando}>
            {buscando ? 'Buscando...' : 'Rastrear'}
          </button>
        </form>
      </div>

      {/* AVISO CUANDO EL CÓDIGO O RUT NO EXISTE */}
      {errorBackend && (
        <p className="cupon-status-msg error" role="alert" style={{ textAlign: 'center', marginTop: '16px' }}>
          {errorBackend}
        </p>
      )}

      {noEncontrado && (
        <p className="cupon-status-msg error" role="alert" style={{ textAlign: 'center', marginTop: '16px' }}>
          No encontramos ningún pedido con ese código, ID o RUT.
        </p>
      )}

      {/* DETALLE Y ETAPAS DEL PEDIDO (SE MUESTRA AL RASTREAR) */}
      {pedido && (
        <div className="resultado-seguimiento-box">
          <div className="status-banner-exact">
            <h3 className="titulo-banner-estado">
              Estado del Pedido <span className="codigo-destacado">#{pedido.id}</span>: <span className="estado-texto-color">{pedido.estadoNombre}</span>
            </h3>
            <p className="estimado-texto">Estimado de entrega: <strong>{pedido.estimado}</strong></p>
          </div>

          {/* STEPPER DE ETAPAS */}
          <div className="tracking-stepper-container">
            <div className="tracking-line-bg">
              <div
                className="tracking-line-progress"
                style={{ width: `${((pedido.etapa - 1) / 3) * 100}%` }}
              ></div>
            </div>

            <div className={`step-item-exact ${pedido.etapa >= 1 ? (pedido.etapa === 1 ? 'active' : 'completed') : ''}`}>
              <div className="step-icon-exact">{pedido.etapa > 1 ? '✓' : '📝'}</div>
              <span className="step-label">Recibido</span>
            </div>

            <div className={`step-item-exact ${pedido.etapa >= 2 ? (pedido.etapa === 2 ? 'active' : 'completed') : ''}`}>
              <div className="step-icon-exact">{pedido.etapa > 2 ? '✓' : '👨‍🍳'}</div>
              <span className="step-label">En Preparación</span>
            </div>

            <div className={`step-item-exact ${pedido.etapa >= 3 ? (pedido.etapa === 3 ? 'active' : 'completed') : ''}`}>
              <div className="step-icon-exact">{pedido.etapa > 3 ? '✓' : '🚚'}</div>
              <span className="step-label">En Camino</span>
            </div>

            <div className={`step-item-exact ${pedido.etapa >= 4 ? 'completed' : ''}`}>
              <div className="step-icon-exact">🎁</div>
              <span className="step-label">Entregado</span>
            </div>
          </div>

          {/* DETALLES DE DIRECCIÓN Y PRODUCTOS */}
          <div className="info-pedido-grid">
            <div className="info-pedido-col">
              <h4>📍 Dirección de Destino</h4>
              <p>{pedido.direccion}</p>
            </div>
            <div className="info-pedido-col">
              <h4>🎂 Resumen de la Orden</h4>
              {pedido.items.length === 0 ? (
                <p className="text-muted mb-0">Este pedido no tiene productos registrados.</p>
              ) : (
                <ul>
                  {pedido.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
