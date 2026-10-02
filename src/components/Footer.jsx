import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom mt-5 pt-5 pb-4">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="fw-bold mb-3">🎂 Pastelería Mil Sabores</h5>
            <p className="text-muted small">
              50 años celebrando momentos inolvidables junto a las familias de Chile. Maestría artesanal,
              ingredientes de excelencia y el compromiso inalterable con la tradición repostera.
            </p>
            <p className="small text-muted mb-0">
              <strong>Casa Matriz:</strong> Av. Providencia 1234, Santiago.<br />
              <strong>Horario:</strong> Lunes a Domingo, 09:00 - 20:00 h.
            </p>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold mb-3">Enlaces Rápidos</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/catalogo" className="text-decoration-none text-muted">Catálogo Completo</Link></li>
              <li className="mb-2"><Link to="/seguimiento" className="text-decoration-none text-muted">Seguimiento de Despacho</Link></li>
              <li className="mb-2"><Link to="/checkout" className="text-decoration-none text-muted">Finalizar Compra</Link></li>
              <li className="mb-2"><Link to="/registro" className="text-decoration-none text-muted">Registro de Nuevos Clientes</Link></li>
              <li className="mb-2"><Link to="/perfil" className="text-decoration-none text-muted">Zona de Clientes</Link></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold mb-3">Beneficios 50.° Aniversario</h5>
            <div className="p-3 bg-light rounded border border-warning">
              <span className="badge bg-warning text-dark mb-2">Promoción Oficial</span>
              <p className="small mb-1">
                Ingresa el cupón <strong>FELICES50</strong> al finalizar tu compra para obtener un <strong>10 % de descuento inmediato</strong>.
              </p>
              <small className="text-muted">
                Descuento del 50 % permanente para adultos mayores (50+ años) y torta gratis en cumpleaños para estudiantes de Duoc UC.
              </small>
            </div>
          </Col>
        </Row>

        <hr className="my-4 text-muted" />

        <Row className="align-items-center small text-muted">
          <Col md={6} className="text-center text-md-start">
            &copy; 2026 Pastelería Mil Sabores SpA. Todos los derechos reservados.
          </Col>
          <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
            Fullstack II — DSY1104 | Evaluación Parcial 2 (React Frontend)
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;