import React from 'react';

export const Boleta = ({ pedido, setVistaActual }) => {
  if (!pedido) return null;

  const { cliente, items, totalPagar, subtotal, descuentoMonto, costoDespacho, montoNeto, iva, codigoSeguimiento } = pedido;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <section className="main-container no-print-padding">
      {/* ENCABEZADO SUPERIOR Y BOTONES DE ACCIÓN */}
      <div className="boleta-top-header">
        <div>
          <h2 className="titulo-boleta-script">Comprobante Oficial de Compra</h2>
          <p className="subtitulo-boleta">
            Tu pedido fue registrado en el taller de repostería. Puedes imprimir o guardar tu boleta.
          </p>
        </div>

        <div className="boleta-actions-btns no-print">
          <button className="btn-imprimir-boleta" onClick={handleImprimir}>
            Imprimir / Guardar en PDF
          </button>
          <button 
            className="btn-seguimiento-verde" 
            onClick={() => setVistaActual('seguimiento')}
          >
            Ver Seguimiento en Tiempo Real
          </button>
        </div>
      </div>

      {/* COMPROBANTE OFICIAL / BOLETA */}
      <div className="boleta-card-exact">
        
        {/* CABECERA DE LA EMPRESA Y DATOS SII */}
        <div className="boleta-company-row">
          <div className="boleta-company-info">
            <h1 className="company-logo-text">Pastelería Mil Sabores SpA</h1>
            <p className="company-subdetail">Giro: Elaboración y Venta de Productos de Repostería y Pastelería Fina</p>
            <p className="company-subdetail">Casa Matriz: Av. Providencia 1234, Providencia, Región Metropolitana</p>
            <p className="company-subdetail">Contacto: contacto@milsabores.cl | +56 2 2345 6789</p>
          </div>

          <div className="boleta-sii-box">
            <div>RUT: 76.543.210-K</div>
            <strong className="boleta-tipo-title">BOLETA ELECTRÓNICA</strong>
            <div>N.º 004892</div>
            <div>SII - SANTIAGO ORIENTE</div>
          </div>
        </div>

        {/* CAJA DE DATOS DEL CLIENTE Y ENVÍO */}
        <div className="boleta-info-box-gray">
          <div className="info-box-col">
            <h4 className="info-box-title">DATOS DEL CLIENTE</h4>
            <div><strong>{cliente.nombre}</strong></div>
            <div>RUN: {cliente.rut}</div>
            <div>Correo electrónico: {cliente.email}</div>
            <div>Teléfono: {cliente.telefono}</div>
          </div>

          <div className="info-box-col">
            <h4 className="info-box-title">DATOS DEL ENVÍO Y ENTREGA</h4>
            <div><strong>Código de Seguimiento:</strong> <span className="text-code-orange">{codigoSeguimiento}</span></div>
            <div><strong>Fecha de Entrega Programada:</strong> <span className="text-date-green">2026-10-10</span></div>
            <div><strong>Franja Horaria:</strong> Mañana (09:00 a 13:00 h)</div>
            <div><strong>Destino:</strong> {cliente.direccion || 'Providencia, Santiago'}</div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <table className="boleta-items-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Descripción del Producto</th>
              <th style={{ textAlign: 'center' }}>Cant.</th>
              <th style={{ textAlign: 'right' }}>Precio Unit.</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{item.nombre}</td>
                <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                <td style={{ textAlign: 'right' }}>${item.precio.toLocaleString('es-CL')}</td>
                <td style={{ textAlign: 'right' }}>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* DESGLOSE DE MONTOS Y TOTAL */}
        <div className="boleta-totals-section">
          <div className="total-row-item">
            <span>Subtotal Bruto:</span>
            <span>${subtotal.toLocaleString('es-CL')}</span>
          </div>

          <div className="total-row-item text-green">
            <span>Descuento Promocional:</span>
            <span>-${descuentoMonto.toLocaleString('es-CL')}</span>
          </div>

          <div className="total-row-item">
            <span>Costo de Despacho:</span>
            <span>${costoDespacho.toLocaleString('es-CL')}</span>
          </div>

          <div className="total-row-item text-muted">
            <span>Monto Neto:</span>
            <span>${montoNeto.toLocaleString('es-CL')}</span>
          </div>

          <div className="total-row-item text-muted">
            <span>I.V.A. (19%):</span>
            <span>${iva.toLocaleString('es-CL')}</span>
          </div>

          <div className="total-row-item total-final-bold">
            <span>TOTAL:</span>
            <span>${totalPagar.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* PIE Y TIMBRE ELECTRÓNICO S.I.I. */}
        <div className="boleta-sii-footer">
          <p className="sii-note-title">Timbre Electrónico S.I.I.</p>
          <p className="sii-note-desc">Res. 99 de 2014 - Verifique documento en www.sii.cl</p>
          <p className="sii-note-desc">La boleta electrónica constituye comprobante válido de compra y garantía de elaboración artesanal fresca.</p>

          <div className="barcode-mock-box">
            <div className="barcode-lines">||||| | |||| || ||||| |||</div>
            <div className="barcode-code-text">{codigoSeguimiento}-VAL-SII</div>
          </div>
        </div>

      </div>
    </section>
  );
};