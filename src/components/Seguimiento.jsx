import React, { useState } from 'react';
import { buscarPedido, obtenerPedidoPorCodigo } from '../data/pedidosDB';

// Convierte un pedido guardado en los datos que muestra esta vista
const armarVista = (p) => ({
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

export const Seguimiento = ({ ultimoPedido }) => {
  const [codigo, setCodigo] = useState(ultimoPedido?.codigoSeguimiento || '');
  const [noEncontrado, setNoEncontrado] = useState(false);

  // Si viene de la boleta, mostrar ese pedido (leído desde pedidosDB.js)
  const [pedido, setPedido] = useState(() => {
    const guardado = ultimoPedido ? obtenerPedidoPorCodigo(ultimoPedido.codigoSeguimiento) : null;
    return guardado ? armarVista(guardado) : null;
  });

  // Buscar por código de seguimiento o RUT en los pedidos guardados
  const handleBuscar = (e) => {
    e.preventDefault();
    const encontrado = buscarPedido(codigo);

    if (encontrado) {
      setPedido(armarVista(encontrado));
      setNoEncontrado(false);
    } else {
      setPedido(null);
      setNoEncontrado(true);
    }
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
            placeholder="Ingresa tu código de pedido (ej. PMS-2026-8942) o RUN..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button type="submit" className="btn-rastrear-exact">
            Rastrear
          </button>
        </form>
      </div>

      {/* AVISO CUANDO EL CÓDIGO O RUT NO EXISTE */}
      {noEncontrado && (
        <p className="cupon-status-msg error" role="alert" style={{ textAlign: 'center', marginTop: '16px' }}>
          No encontramos ningún pedido con ese código o RUT.
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
              <ul>
                {pedido.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};