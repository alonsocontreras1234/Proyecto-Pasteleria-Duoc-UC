import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user } = useAuth();

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm py-2 brand-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <span className="brand-logo-icon">🎂</span>
          <div>
            <div className="fw-bold text-dark fs-4 brand-title">Mil Sabores</div>
            <small className="text-muted d-block brand-sub">50.° Aniversario (1976 - 2026)</small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-center gap-1">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo">
              Catálogo
            </Nav.Link>
            <Nav.Link as={NavLink} to="/seguimiento">
              Seguimiento
            </Nav.Link>
            <Nav.Link as={NavLink} to="/checkout">
              Checkout
            </Nav.Link>
            <Nav.Link as={NavLink} to="/perfil">
              {user ? user.nombre.split(' ')[0] : 'Mi Perfil'}
            </Nav.Link>
            {!user && (
              <Nav.Link as={NavLink} to="/registro">
                Regístrate
              </Nav.Link>
            )}

            <Button
              variant="warning"
              className="ms-lg-3 d-flex align-items-center gap-2 fw-semibold shadow-sm"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Ver carrito"
            >
              <span>🛒 Carrito</span>
              <Badge bg="danger" pill>
                {totalItems}
              </Badge>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;