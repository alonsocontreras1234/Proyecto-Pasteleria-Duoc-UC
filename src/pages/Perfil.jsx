import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Form, Badge, ListGroup, Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Validators } from '../utils/validators';

const Perfil = () => {
  const { user, login, logout } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Historial de órdenes de este usuario
  const allOrders = JSON.parse(localStorage.getItem('pms_orders')) || [];
  const misOrdenes = user
    ? allOrders.filter(
        (o) =>
          o.cliente.email.toLowerCase() === user.email.toLowerCase() ||
          o.cliente.rut.replace(/[^0-9kK]/g, '') === user.rut.replace(/[^0-9kK]/g, '')
      )
    : [];

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = login(emailInput, passInput);
    if (!res.success) {
      setLoginError(res.error || 'Credenciales inválidas.');
    }
  };

  if (!user) {
    return (
      <Container className="py-5" style={{ maxWidth: '480px' }}>
        <Card className="shadow border-0 p-4">
          <div className="text-center mb-4">
            <span className="fs-1">🔐</span>
            <h3 className="fw-bold mt-2">Iniciar Sesión</h3>
            <p className="text-muted small">Accede a tus beneficios y al historial de compras de la pastelería.</p>
          </div>

          {loginError && <Alert variant="danger" className="small py-2">{loginError}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="usuario@ejemplo.cl"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold">Contraseña</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button type="submit" variant="primary" size="lg" className="fw-bold">
                Ingresar
              </Button>
            </div>

            <div className="text-center small text-muted">
              ¿Aún no tienes cuenta? <Link to="/registro" className="fw-semibold">Regístrate aquí</Link>
            </div>
          </Form>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="fw-bold display-6 mb-0">Mi Perfil y Beneficios</h1>
          <p className="text-muted small mb-0">Gestión de datos de cliente y compras realizadas.</p>
        </div>
        <Button variant="outline-danger" size="sm" onClick={logout} className="fw-semibold">
          Cerrar Sesión
        </Button>
      </div>

      <Row className="g-4 mb-5">
        {/* DATOS DE USUARIO */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="fw-bold mb-0">Información Personal</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <small className="text-muted d-block">Nombre:</small>
                  <strong>{user.nombre}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <small className="text-muted d-block">RUN:</small>
                  <strong>{user.rut}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <small className="text-muted d-block">Correo Electrónico:</small>
                  <strong>{user.email}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <small className="text-muted d-block">Teléfono:</small>
                  <strong>{user.telefono}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <small className="text-muted d-block">Dirección Habitual:</small>
                  <strong>{user.direccion}, {user.comuna}</strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* BENEFICIOS ACTIVOS */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white py-3">
              <h5 className="fw-bold mb-0">Beneficios Club Mil Sabores</h5>
            </Card.Header>
            <Card.Body>
              {user.beneficios && user.beneficios.length > 0 ? (
                <div className="d-flex flex-column gap-2 mb-3">
                  {user.beneficios.map((b, idx) => (
                    <div key={idx} className="p-3 bg-light rounded border border-warning d-flex align-items-center gap-2">
                      <span className="fs-4">⭐</span>
                      <div>
                        <strong>{b}</strong>
                        <small className="text-muted d-block">Beneficio activo para todas tus compras conmemorativas.</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No cuentas con beneficios activos por edad o convenio institucional.</p>
              )}

              {user.porcentajeDescuento > 0 && (
                <div className="alert alert-success mt-3 mb-0">
                  🎉 Cuentas con un <strong>{(user.porcentajeDescuento * 100).toFixed(0)} % de descuento automático</strong> asignado a tu cuenta.
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* HISTORIAL DE PEDIDOS */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Mis Pedidos Realizados ({misOrdenes.length})</h5>
          <Link to="/catalogo" className="btn btn-primary btn-sm fw-semibold">
            Nuevo Pedido
          </Link>
        </Card.Header>
        <Card.Body>
          {misOrdenes.length === 0 ? (
            <div className="text-center py-4 text-muted">
              Aún no tienes pedidos registrados en tu cuenta.
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Fecha</th>
                  <th>Ítems</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {misOrdenes.map((o) => (
                  <tr key={o.orderCode}>
                    <td><strong>{o.orderCode}</strong></td>
                    <td>{new Date(o.fechaEmision).toLocaleDateString('es-CL')}</td>
                    <td>{o.items.length} producto(s)</td>
                    <td className="fw-semibold">{Validators.formatCLP(o.totales.total)}</td>
                    <td>
                      <Badge bg="warning" text="dark">
                        {o.estadoActual.nombre}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        as={Link}
                        to="/seguimiento"
                        variant="outline-primary"
                        size="sm"
                        className="me-2 fw-semibold"
                        onClick={() => localStorage.setItem('pms_active_order', JSON.stringify(o))}
                      >
                        Seguimiento
                      </Button>
                      <Button
                        as={Link}
                        to="/boleta"
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => localStorage.setItem('pms_active_order', JSON.stringify(o))}
                      >
                        Boleta
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Perfil;