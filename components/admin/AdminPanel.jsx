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

//Panel de Administración: menú lateral + la sección elegida
//Solo lo ve un usuario con rol "admin" (ver App.jsx)
export const AdminPanel = ({ usuario }) => {
  const [seccion, setSeccion] = useState('dashboard');

  return (
    <section className="main-container admin-panel">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <p className="text-muted">Gestiona los productos, usuarios y pedidos de Pastelería Mil Sabores.</p>
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
                {SECCIONES.map((s) => (
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
          {seccion === 'dashboard' && <AdminDashboard onIrA={setSeccion} />}
          {seccion === 'productos' && <AdminProductos />}
          {seccion === 'usuarios' && <AdminUsuarios usuarioActual={usuario} />}
          {seccion === 'ordenes' && <AdminOrdenes />}
        </Col>
      </Row>
    </section>
  );
};
