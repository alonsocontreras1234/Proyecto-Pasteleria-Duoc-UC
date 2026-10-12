import React, { useState } from 'react';

export const Checkout = ({ carrito, usuario, onFinalizarPedido, setVistaActual }) => {
  const [nombre, setNombre] = useState(usuario?.nombre || 'Magdalena Zúñiga');
  const [rut, setRut] = useState(usuario?.rut || '22.163.627-9');
  const [email, setEmail] = useState(usuario?.email || 'magd.zuniga@duocuc.cl');
  const [telefono, setTelefono] = useState(usuario?.telefono || '+56 9 2882 1422');
  const [direccion, setDireccion] = useState(usuario?.direccion || 'Av. Providencia 1234');
  const [tipoEntrega, setTipoEntrega] = useState('despacho');
  const [cuponInput, setCuponInput] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(usuario?.porcentajeDescuento || 0);
  const [cuponMensaje, setCuponMensaje] = useState(
    usuario?.porcentajeDescuento ? `Descuento activo del ${usuario.porcentajeDescuento} % por perfil` : ''
  );

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const costoDespacho = tipoEntrega === 'despacho' ? 2500 : 0;
  const descuentoMonto = Math.round((subtotal * descuentoPorcentaje) / 100);
  const totalPagar = subtotal - descuentoMonto + costoDespacho;
  const montoNeto = Math.round(totalPagar / 1.19);
  const iva = totalPagar - montoNeto;

  const handleAplicarCupon = (e) => {
    e.preventDefault();
    if (cuponInput.trim().toUpperCase() === 'FELICES50') {
      const nuevoDescuento = Math.max(descuentoPorcentaje, 10);
      setDescuentoPorcentaje(nuevoDescuento);
      setCuponMensaje('¡Cupón FELICES50 aplicado! (10 % de descuento)');
    } else {
      setCuponMensaje('Cupón no válido.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const codigoSeguimiento = `PMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    onFinalizarPedido({
      cliente: { nombre, rut, email, telefono, direccion },
      tipoEntrega,
      items: carrito,
      subtotal,
      descuentoMonto,
      porcentajeDescuento: descuentoPorcentaje,
      costoDespacho,
      montoNeto,
      iva,
      totalPagar,
      codigoSeguimiento,
      tortaGratisDuoc: usuario?.tortaGratisDuoc || false
    });
  };

  return (
    <section className="main-container">
      <div className="checkout-header-exact">
        <h2 className="titulo-checkout-script">Confirmación de Pedido y Despacho</h2>
        <p className="subtitulo-checkout">
          Completa los datos de entrega, selecciona tu modalidad y aprovecha los beneficios del 50° Aniversario de Pastelería Mil Sabores.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-grid-layout">
        <div className="checkout-col-left">
          <div className="card-checkout-step">
            <h3 className="step-title-script">1. Datos de Contacto y Facturación</h3>
            
            <div className="checkout-form-row">
              <div className="form-group-exact">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-exact">
                <label>RUN / RUT *</label>
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="checkout-form-row">
              <div className="form-group-exact">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-exact">
                <label>Teléfono de Contacto *</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="card-checkout-step">
            <h3 className="step-title-script">2. Modalidad de Entrega</h3>
            
            <div className="form-group-exact" style={{ marginBottom: '16px' }}>
              <label>Tipo de Entrega</label>
              <select 
                value={tipoEntrega} 
                onChange={(e) => setTipoEntrega(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="despacho">Despacho a Domicilio ($2.500 CLP)</option>
                <option value="retiro">Retiro en Tienda (Gratis)</option>
              </select>
            </div>

            {tipoEntrega === 'despacho' && (
              <div className="form-group-exact">
                <label>Dirección de Destino *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        </div>

        <div className="checkout-col-right">
          <div className="card-checkout-summary">
            <h3 className="summary-title-script">Resumen del Pedido</h3>

            <div className="summary-items-list">
              {carrito.map((item) => (
                <div key={item.id} className="summary-item-row">
                  <span>{item.nombre} × {item.cantidad}</span>
                  <strong>${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
                </div>
              ))}
            </div>

            {/* Beneficio Duoc */}
            {usuario?.tortaGratisDuoc && (
              <div style={{ backgroundColor: '#eafaf1', color: '#155724', padding: '10px', borderRadius: '6px', fontSize: '12px', margin: '12px 0', border: '1px solid #c3e6cb' }}>
                🎂 <strong>Beneficio Duoc UC Activo:</strong> ¡Incluye torta gratis de cumpleaños para estudiantes institucionales!
              </div>
            )}

            {/* Aplicación de Cupón */}
            <div style={{ margin: '14px 0', padding: '10px', backgroundColor: '#fcf8e3', borderRadius: '6px', border: '1px solid #faebcc' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                ¿Tienes un código de descuento?
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ej: FELICES50"
                  value={cuponInput}
                  onChange={(e) => setCuponInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={handleAplicarCupon}
                  style={{ backgroundColor: '#8B4513', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  Aplicar
                </button>
              </div>
              {cuponMensaje && (
                <div style={{ fontSize: '11px', marginTop: '6px', color: cuponMensaje.includes('¡') ? '#1e8449' : '#a94442' }}>
                  {cuponMensaje}
                </div>
              )}
            </div>

            <hr className="summary-divider-soft" />

            <div className="summary-breakdown-table">
              <div className="breakdown-row">
                <span>Subtotal Productos:</span>
                <strong>${subtotal.toLocaleString('es-CL')}</strong>
              </div>

              {descuentoMonto > 0 && (
                <div className="breakdown-row" style={{ color: '#27ae60' }}>
                  <span>Descuento ({descuentoPorcentaje} %):</span>
                  <strong>-${descuentoMonto.toLocaleString('es-CL')}</strong>
                </div>
              )}

              <div className="breakdown-row">
                <span>Costo de Despacho:</span>
                <strong>${costoDespacho.toLocaleString('es-CL')}</strong>
              </div>
            </div>

            <hr className="summary-divider-bold" />

            <div className="total-pagar-row">
              <span>Total a Pagar:</span>
              <span className="total-monto-highlight">${totalPagar.toLocaleString('es-CL')}</span>
            </div>

            <button type="submit" className="btn-confirmar-pedido">
              Confirmar y Pagar Pedido
            </button>

            <button 
              type="button" 
              className="btn-volver-atras"
              onClick={() => setVistaActual('catalogo')}
            >
              ← Volver al Catálogo
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};