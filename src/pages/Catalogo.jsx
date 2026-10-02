import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Nav, Badge } from 'react-bootstrap';
import { products, CATEGORIAS } from '../data/products';
import ProductCard from '../components/ProductCard';

const Catalogo = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas las categorías');
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = products.filter((p) => {
    const coincideCat = categoriaActiva === 'Todas las categorías' || p.categoria === categoriaActiva;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            p.descripcionCorta.toLowerCase().includes(busqueda.toLowerCase()) ||
                            p.codigo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusqueda;
  });

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <Badge bg="warning" text="dark" className="px-3 py-2 fw-semibold mb-2">
          Colección Completa 2026
        </Badge>
        <h1 className="fw-bold display-5">Catálogo Oficial de Productos</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
          Tortas artesanales, postres individuales y líneas inclusivas preparadas bajo los más altos estándares
          sanitarios y recetas tradicionales chilenas.
        </p>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="mb-4">
        <InputGroup size="lg" className="shadow-sm">
          <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, código (ej: TC001) o ingrediente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* PESTAÑAS DE CATEGORÍA */}
      <div className="overflow-auto mb-4 pb-2">
        <Nav variant="pills" className="flex-nowrap gap-2">
          {CATEGORIAS.map((cat) => (
            <Nav.Item key={cat} className="flex-shrink-0">
              <Nav.Link
                active={categoriaActiva === cat}
                onClick={() => setCategoriaActiva(cat)}
                className="rounded-pill px-3 py-2 fw-semibold"
                style={{ cursor: 'pointer' }}
              >
                {cat}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* CONTADOR DE RESULTADOS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-muted small">
          Mostrando <strong>{productosFiltrados.length}</strong> de {products.length} productos
        </span>
      </div>

      {/* GRILLA DE PRODUCTOS */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-5 my-4 bg-light rounded-4 border">
          <span style={{ fontSize: '3rem' }}>🧁</span>
          <h4 className="fw-bold mt-2">No se encontraron productos</h4>
          <p className="text-muted">Prueba con otro término de búsqueda o selecciona otra categoría.</p>
        </div>
      ) : (
        <Row className="g-4">
          {productosFiltrados.map((prod) => (
            <Col key={prod.codigo} sm={6} lg={4} xl={3}>
              <ProductCard producto={prod} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Catalogo;