import React from 'react';

export const CarritoModal = ({ show, onClose, carrito, onQuitar, onVaciar, setVistaActual }) => {
  if (!show) return null;

  // Cálculo del total general del carrito
  const total = carrito.reduce((acc, item) => acc + item.precio * (Number(item.cantidad) || 1), 0);

  const handleIrAPagar = () => {
    onClose();
    setVistaActual('checkout');
  };

  return (
    <div className="modal-backdrop-exact" onClick={onClose}>
      <div className="modal-carrito-box" onClick={(e) => e.stopPropagation()}>
        <button className="btn-cerrar-modal-exact" onClick={onClose} title="Cerrar">✕</button>

        <h3 className="titulo-modal-script" style={{ marginBottom: '18px' }}>Tu Carrito de Compras</h3>

        {carrito.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '25px 0' }}>
            <p className="subtitle-switch" style={{ fontSize: '0.95rem' }}>El carrito está vacío por el momento.</p>
            <button 
              className="btn-ver-detalle-pedir" 
              style={{ marginTop: '12px', maxWidth: '200px' }} 
              onClick={onClose}
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div>
            {/* LISTA DE PRODUCTOS AGREGADOS */}
            <div className="carrito-items-list-scroll">
              {carrito.map((item) => (
                <div key={`${item.id}-${item.dedicatoria || ''}`} className="carrito-item-row">
                  <img src={item.imagen} alt={item.nombre} className="carrito-item-thumb" />
                  <div className="carrito-item-details">
                    <strong className="carrito-item-title">{item.nombre}</strong>
                    <div className="carrito-item-price-qty">
                      {Number(item.cantidad) || 1} × ${item.precio.toLocaleString('es-CL')} CLP
                    </div>
                    {item.dedicatoria && (
                      <div className="carrito-item-dedicatoria">"{item.dedicatoria}"</div>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn-quitar-item" 
                    onClick={() => onQuitar(item.id)}
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL Y ACCIONES */}
            <div className="carrito-summary-footer">
              <div className="carrito-total-row">
                <span>Total estimado:</span>
                <strong>${total.toLocaleString('es-CL')} CLP</strong>
              </div>

              <div className="carrito-actions-row">
                <button type="button" className="btn-vaciar-carrito" onClick={onVaciar}>
                  Vaciar Carrito
                </button>
                <button type="button" className="btn-ir-pagar-main" onClick={handleIrAPagar}>
                  Ir a Pagar ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};