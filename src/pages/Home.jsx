import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { products, CATEGORIAS } from '../data/products';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('Todas las categorías');

  const productosFiltrados = products.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           p.descripcionCorta.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = categoriaSel === 'Todas las categorías' || p.categoria === categoriaSel;
    return coincideNombre && coincideCat;
  });

  // 4 productos destacados para la portada
  const destacados = products.slice(0, 4);

  return (
    <div>
      {/* SECCIÓN HERO / ANIVERSARIO */}
      <section className="hero-banner text-center py-5 mb-5 bg-gradient-custom text-white position-relative">
        <Container className="py-4">
          <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 mb-3 text-uppercase fw-bold shadow-sm">
            ⭐ 50.° Aniversario (1976 - 2026)
          </Badge>
          <h1 className="display-4 fw-bold mb-3">Tradición, Pasión y Sabor Artesanal</h1>
          <p className="lead mx-auto mb-4" style={{ maxWidth: '750px' }}>
            Cinco décadas horneando las recetas familiares más queridas de Chile. Descubre nuestras tortas
            conmemorativas, postres tradicionales y opciones inclusivas sin gluten, sin azúcar y veganas.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/catalogo" variant="light" size="lg" className="fw-bold px-4 text-primary shadow">
              Explorar Catálogo
            </Button>
            <Button as={Link} to="/seguimiento" variant="outline-light" size="lg" className="fw-semibold px-4">
              Rastrear Pedido
            </Button>
          </div>
        </Container>
      </section>

      <Container>
        {/* BUSCADOR Y FILTROS INTERACTIVOS */}
        <section className="p-4 bg-light rounded-4 shadow-sm mb-5 border">
          <Row className="g-3 align-items-center">
            <Col md={7}>
              <InputGroup size="lg">
                <InputGroup.Text className="bg-white border-end-0">🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, ingrediente o receta..."
                  className="border-start-0 shadow-none"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={5}>
              <Form.Select
                size="lg"
                value={categoriaSel}
                onChange={(e) => setCategoriaSel(e.target.value)}
                className="shadow-none"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </section>

        {/* LISTADO DE RESULTADOS O DESTACADOS */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">
                {busqueda || categoriaSel !== 'Todas las categorías'
                  ? `Resultados de Búsqueda (${productosFiltrados.length})`
                  : 'Pasteles Destacados del 50.° Aniversario'}
              </h2>
              <p className="text-muted small mb-0">Elaborados con ingredientes seleccionados y despacho refrigerado.</p>
            </div>
            <Link to="/catalogo" className="fw-semibold text-decoration-none">
              Ver todo ({products.length}) →
            </Link>
          </div>

          <Row className="g-4">
            {(busqueda || categoriaSel !== 'Todas las categorías' ? productosFiltrados : destacados).map((prod) => (
              <Col key={prod.codigo} sm={6} lg={3}>
                <ProductCard producto={prod} />
              </Col>
            ))}
          </Row>
        </section>

        {/* SECCIÓN HISTORIA Y TRADICIÓN (1995 RECORD GUINNESS) */}
        <section className="p-4 p-md-5 bg-white rounded-4 shadow-sm border mb-5">
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <Badge bg="info" text="dark" className="mb-3 px-3 py-2 fw-semibold">
                📜 Hito Histórico • 1995
              </Badge>
              <h2 className="fw-bold display-6 mb-3">Nuestra Historia de Tradición y Récord</h2>
              <p className="lead text-primary fw-semibold">
                En 1995, Pastelería Mil Sabores hizo historia al colaborar en la elaboración de la <em>torta más grande del mundo</em>, un logro certificado por el <strong>Libro Guinness de los Récords</strong>.
              </p>
              <p className="text-muted">
                Tres décadas después de aquel hito nacional, esa misma pasión artesanal evoluciona hacia una experiencia digital moderna. Puedes programar la fecha exacta de tu celebración, personalizar dedicatorias y recibir comprobantes fiscales electrónicos válidos en segundos.
              </p>
              <div className="d-flex gap-4 mt-4 pt-3 border-top">
                <div>
                  <div className="fs-3 fw-bold text-dark">1995</div>
                  <small className="text-muted text-uppercase">Récord Guinness</small>
                </div>
                <div className="border-end"></div>
                <div>
                  <div className="fs-3 fw-bold text-dark">+50</div>
                  <small className="text-muted text-uppercase">Años de Receta</small>
                </div>
                <div className="border-end"></div>
                <div>
                  <div className="fs-3 fw-bold text-dark">100 %</div>
                  <small className="text-muted text-uppercase">Artesanal</small>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <img
                src="/img/noticias/noticias-1.jpg"
                alt="Récord Guinness Torta más grande"
                className="img-fluid rounded-4 shadow object-fit-cover w-100"
                style={{ maxHeight: '380px' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/FFF8F0/6B2D2D?text=50+Aniversario+Mil+Sabores';
                }}
              />
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Home;