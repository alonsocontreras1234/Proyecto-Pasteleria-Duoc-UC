import React, { useState } from 'react';
import { validarRutChileno } from '../utils/validations';

export const Checkout = ({ carrito, usuario, onFinalizarPedido, setVistaActual }) => {
  const [nombre, setNombre] = useState(usuario?.nombre || 'magdalena zuniga');
  const [rut, setRut] = useState(usuario?.rut || '22163627-9');
  const [email, setEmail] = useState(usuario?.email || 'magd.zuniga@duocuc.cl');
  const [telefono, setTelefono] = useState('+56928821422');
  const [direccion, setDireccion] = useState('fafc 23 (Providencia)');
  const [tipoEntrega, setTipoEntrega] = useState('despacho');
  const [cuponInput, setCuponInput] = useState('FELICES50');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const costoDespacho = tipoEntrega === 'despacho' ? 2500 : 0;
  const descuentoMonto = Math.round((subtotal * descuentoPorcentaje) / 100);
  const totalPagar = subtotal - descuentoMonto + costoDespacho;
  const montoNeto = Math.round(totalPagar / 1.19);
  const iva = totalPagar - montoNeto;

  const handleSubmit = (e) => {
    e.preventDefault();

    const codigoSeguimiento = `PMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    onFinalizarPedido({
      cliente: { nombre, rut, email, telefono, direccion },
      tipoEntrega,
      items: carrito,
      subtotal,
      descuentoMonto,
      costoDespacho,
      montoNeto,
      iva,
      totalPagar,
      codigoSeguimiento
    });
  };

  return (
    <section className="main-container">
      <div className="checkout-header-exact">
        <h2 className="titulo-checkout-script">Confirmación de Pedido y Despacho</h2>
        <p className="subtitulo-checkout">
          Completa los datos de entrega, selecciona tu fecha y franja horaria preferida para recibir tu pedido artesanal recién horneado.
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
            <h3 className="step-title-script">2. Modalidad y Fecha de Entrega Preferida</h3>
            
            <div className="form-group-exact">
              <label>Dirección de Destino *</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>
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

            <hr className="summary-divider-soft" />

            <div className="summary-breakdown-table">
              <div className="breakdown-row">
                <span>Subtotal Productos:</span>
                <strong>${subtotal.toLocaleString('es-CL')}</strong>
              </div>
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