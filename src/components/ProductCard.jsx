import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Validators } from '../utils/validators';
import { useCart } from '../context/CartContext';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [dedicatoria, setDedicatoria] = useState('');

  const handleAgregarDirecto = (e) => {
    e.stopPropagation();
    agregarAlCarrito(producto, 1, dedicatoria);
  };

  const handleConfirmarModal = () => {
    agregarAlCarrito(producto, 1, dedicatoria);
    setShowModal(false);
  };

  return (
    <>
      <Card className="h-100 shadow-sm product-card border-0">
        <div className="product-img-wrapper position-relative" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          <Card.Img
            variant="top"
            src={producto.imagen}
            alt={producto.nombre}
            className="product-img"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400/FFF8F0/6B2D2D?text=' + encodeURIComponent(producto.nombre);
            }}
          />
          <Badge bg="dark" className="position-absolute top-0 start-0 m-2 opacity-75">
            {producto.codigo}
          </Badge>
          <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 fw-semibold">
            {producto.categoria}
          </Badge>
        </div>

        <Card.Body className="d-flex flex-column" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          <Card.Title className="fs-5 fw-bold mb-1">{producto.nombre}</Card.Title>
          <Card.Text className="text-muted small flex-grow-1">
            {producto.descripcionCorta}
          </Card.Text>

          <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
            <span className="fs-5 fw-bold text-primary">
              {Validators.formatCLP(producto.precioNumero)}
            </span>
            <Button
              variant="outline-primary"
              size="sm"
              className="fw-semibold px-3"
              onClick={handleAgregarDirecto}
            >
              + Añadir
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* MODAL DETALLE DE PRODUCTO */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{producto.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-4">
            <div className="col-md-6">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid rounded shadow-sm w-100"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/FFF8F0/6B2D2D?text=' + encodeURIComponent(producto.nombre);
                }}
              />
            </div>
            <div className="col-md-6 d-flex flex-column">
              <div className="mb-2">
                <Badge bg="secondary" className="me-2">{producto.codigo}</Badge>
                <Badge bg="warning" text="dark">{producto.categoria}</Badge>
              </div>

              <h4 className="fw-bold text-primary mb-3">
                {Validators.formatCLP(producto.precioNumero)}
              </h4>

              <p className="text-muted">{producto.descripcion}</p>

              {producto.pasos && producto.pasos.length > 0 && (
                <div className="mb-3">
                  <h6 className="fw-semibold small text-uppercase text-muted">Elaboración Tradicional:</h6>
                  <ol className="small ps-3 mb-0 text-muted">
                    {producto.pasos.map((paso, idx) => (
                      <li key={idx} className="mb-1">{paso}</li>
                    ))}
                  </ol>
                </div>
              )}

              <Form.Group className="mt-auto">
                <Form.Label className="small fw-semibold">Dedicatoria personalizada (opcional):</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ej: ¡Feliz cumpleaños, mamá! Con amor..."
                  value={dedicatoria}
                  onChange={(e) => setDedicatoria(e.target.value)}
                  maxLength={100}
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleConfirmarModal} className="fw-semibold">
            Agregar al Carrito ({Validators.formatCLP(producto.precioNumero)})
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;