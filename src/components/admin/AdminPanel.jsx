import { useState } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductos } from './AdminProductos';
import { AdminUsuarios } from './AdminUsuarios';
import { AdminOrdenes } from './AdminOrdenes';

// Secciones del menú lateral del panel
const SECCIONES = [
  { id: 'dashboard', nombre: '📊 Dashboard' },
  { id: 'productos', nombre: '🎂 Productos' },
  { id: 'usuarios', nombre: '👥 Usuarios' },
  { id: 'ordenes', nombre: '🧾 Órdenes y Boletas' }
];

// Panel de Administración: menú lateral + la sección elegida
// ADMIN accede a todo; VENDEDOR solo ve Productos y Órdenes
export const AdminPanel = ({ usuario }) => {
  const esVendedor = usuario?.rol === 'vendedor';
  const seccionesVisibles = esVendedor
    ? SECCIONES.filter((s) => s.id === 'productos' || s.id === 'ordenes')
    : SECCIONES;

  const [seccion, setSeccion] = useState(esVendedor ? 'productos' : 'dashboard');

  return (
    <section className="main-container admin-panel">
      <div className="admin-header">
        <h2>{esVendedor ? 'Panel de Vendedor' : 'Panel de Administración'}</h2>
        <p className="text-muted">
          {esVendedor
            ? 'Consulta y gestiona el catálogo de productos y las órdenes de Pastelería Mil Sabores.'
            : 'Gestiona los productos, usuarios y pedidos de Pastelería Mil Sabores.'}
        </p>
      </div>

      <Row className="g-4">
        {/* MENÚ LATERAL */}
        <Col xs={12} lg={3}>
          <Card className="admin-sidebar">
            <Card.Body>
              <div className="admin-sidebar-usuario">
                <div className="admin-avatar">👤</div>
                <strong>{usuario?.nombre}</strong>
                <small>{usuario?.email}</small>
              </div>

              <Nav variant="pills" className="flex-column" activeKey={seccion} onSelect={(clave) => setSeccion(clave)}>
                {seccionesVisibles.map((s) => (
                  <Nav.Item key={s.id}>
                    <Nav.Link eventKey={s.id}>{s.nombre}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* CONTENIDO DE LA SECCIÓN */}
        <Col xs={12} lg={9}>
          {!esVendedor && seccion === 'dashboard' && <AdminDashboard onIrA={setSeccion} />}
          {seccion === 'productos' && <AdminProductos />}
          {!esVendedor && seccion === 'usuarios' && <AdminUsuarios usuarioActual={usuario} />}
          {seccion === 'ordenes' && <AdminOrdenes esVendedor={esVendedor} />}
        </Col>
      </Row>
    </section>
  );
};
