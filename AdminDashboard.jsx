import { Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { obtenerProductos } from '../../data/productosDB';
import { obtenerUsuarios } from '../../data/db';
import { obtenerPedidos } from '../../data/pedidosDB';

// Formato de precio chileno: 45000 → "$45.000"
const clp = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

//Dashboard: resumen general de la tienda y los últimos pedidos
export const AdminDashboard = ({ onIrA }) => {
  // Datos leídos desde los archivos de la carpeta data
  const productos = obtenerProductos();
  const usuarios = obtenerUsuarios();
  const pedidos = obtenerPedidos();

  const totalVentas = pedidos.reduce((suma, p) => suma + (p.totalPagar || 0), 0);
  const pedidosPendientes = pedidos.filter((p) => p.etapa < 4).length;

  // Tarjetas de resumen (cada una lleva a su sección)
  const tarjetas = [
    { titulo: 'Productos', valor: productos.length, detalle: 'en el catálogo', seccion: 'productos' },
    { titulo: 'Usuarios', valor: usuarios.length, detalle: 'cuentas registradas', seccion: 'usuarios' },
    { titulo: 'Pedidos', valor: pedidos.length, detalle: `${pedidosPendientes} por entregar`, seccion: 'ordenes' },
    { titulo: 'Ventas', valor: clp(totalVentas), detalle: 'total vendido', seccion: 'ordenes' }
  ];

  return (
    <div>
      <Row className="g-3 mb-4">
        {tarjetas.map((t) => (
          <Col key={t.titulo} xs={12} sm={6} xl={3}>
            <Card className="admin-stat h-100">
              <Card.Body>
                <div className="admin-stat-titulo">{t.titulo}</div>
                <div className="admin-stat-valor">{t.valor}</div>
                <small className="text-muted">{t.detalle}</small>
                <div>
                  <Button variant="secondary" size="sm" className="mt-2" onClick={() => onIrA(t.seccion)}>
                    Ver detalle
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Card.Body>
          <h4>Últimos pedidos</h4>
          {pedidos.length === 0 ? (
            <p className="text-muted mb-0">Todavía no hay pedidos registrados.</p>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th className="text-end">Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map((p) => (
                  <tr key={p.codigoSeguimiento}>
                    <td>{String(p.folio).padStart(6, '0')}</td>
                    <td>{p.cliente?.nombre}</td>
                    <td>{new Date(p.fecha).toLocaleDateString('es-CL')}</td>
                    <td className="text-end">{clp(p.totalPagar)}</td>
                    <td><Badge bg={p.etapa === 4 ? 'success' : 'warning'} text={p.etapa === 4 ? undefined : 'dark'}>{p.estadoNombre}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
