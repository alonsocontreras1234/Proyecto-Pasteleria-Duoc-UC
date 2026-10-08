import React from 'react';
import { Offcanvas, Button, ListGroup, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Validators } from '../utils/validators';

const CartDrawer = () => {
  const {
    items,
    totalItems,
    subtotal,
    cupon,
    setCupon,
    montoDescuento,
    isDrawerOpen,
    setIsDrawerOpen,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito
  } = useCart();

  const navigate = useNavigate();

  const totalFinal = subtotal - montoDescuento;

  const handleIrCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <Offcanvas show={isDrawerOpen} onHide={() => setIsDrawerOpen(false)} placement="end" className="cart-drawer">
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold d-flex align-items-center gap-2">
          <span>Tu Carrito de Compras</span>
          <Badge bg="primary" pill>
            {totalItems}
          </Badge>
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-3">
        {items.length === 0 ? (
          <div className="text-center my-auto py-5">
            <h5 className="mt-3 fw-bold">Tu carrito está vacío</h5>
            <p className="text-muted small">Explora nuestro catálogo del 50.° Aniversario y agrega tus delicias favoritas.</p>
            <Button variant="primary" onClick={() => { setIsDrawerOpen(false); navigate('/catalogo'); }}>
              Ir al Catálogo
            </Button>
          </div>
        ) : (
          <>
            <ListGroup variant="flush" className="flex-grow-1 overflow-auto pe-1">
              {items.map((item) => (
                <ListGroup.Item key={item.codigo} className="px-0 py-3 border-bottom">
                  <div className="d-flex gap-3">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      width={64}
                      height={64}
                      className="rounded object-fit-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/100x100/FFF8F0/6B2D2D?text=Pastel';
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="mb-0 fw-semibold">{item.nombre}</h6>
                        <Button
                          variant="link"
                          className="text-danger p-0 ms-2 text-decoration-none"
                          onClick={() => eliminarDelCarrito(item.codigo)}
                          aria-label="Eliminar producto"
                        >
                          ✕
                        </Button>
                      </div>

                      <small className="text-muted d-block">{item.categoria}</small>
                      {item.dedicatoria && (
                        <small className="d-block text-primary fst-italic mt-1">
                          «{item.dedicatoria}»
                        </small>
                      )}

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-secondary"
                            onClick={() => actualizarCantidad(item.codigo, item.cantidad - 1)}
                          >
                            -
                          </Button>
                          <span className="btn btn-sm btn-outline-secondary disabled text-dark fw-bold px-3">
                            {item.cantidad}
                          </span>
                          <Button
                            variant="outline-secondary"
                            onClick={() => actualizarCantidad(item.codigo, item.cantidad + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <span className="fw-bold text-dark">
                          {Validators.formatCLP(item.precioNumero * item.cantidad)}
                        </span>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            {/* ZONA DE CUPÓN Y TOTALES */}
            <div className="border-top pt-3 mt-auto">
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold mb-1">¿Tienes cupón de descuento?</Form.Label>
                <div className="input-group input-group-sm">
                  <Form.Control
                    type="text"
                    placeholder="Ej: FELICES50"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value.toUpperCase())}
                  />
                  <span className="input-group-text bg-light text-muted">10 % OFF</span>
                </div>
                {cupon.trim().toUpperCase() === 'FELICES50' && (
                  <small className="text-success fw-semibold mt-1 d-block">
                    ✓ Cupón FELICES50 aplicado (10 % de descuento).
                  </small>
                )}
              </Form.Group>

              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Subtotal ({totalItems} ítems):</span>
                <span>{Validators.formatCLP(subtotal)}</span>
              </div>

              {montoDescuento > 0 && (
                <div className="d-flex justify-content-between small text-success mb-1">
                  <span>Descuento (FELICES50):</span>
                  <span>- {Validators.formatCLP(montoDescuento)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between fs-5 fw-bold text-dark my-2 pt-2 border-top">
                <span>Total Estimado:</span>
                <span className="text-primary">{Validators.formatCLP(totalFinal)}</span>
              </div>

              <div className="d-grid gap-2 mt-3">
                <Button variant="primary" size="lg" className="fw-semibold" onClick={handleIrCheckout}>
                  Proceder al Pago
                </Button>
                <Button variant="outline-danger" size="sm" onClick={vaciarCarrito}>
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;