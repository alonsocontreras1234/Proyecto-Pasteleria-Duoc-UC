import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { obtenerProductos as obtenerProductosLocales } from '../../data/productosDB';
import { obtenerUsuarios as obtenerUsuariosLocales } from '../../data/db';
import { obtenerProductos } from '../../services/ProductoService';
import usuarioService from '../../services/UsuarioService';
import { listarPedidos, ESTADOS } from '../../services/PedidoService';

// Formato de precio chileno: 45000 → "$45.000"
const clp = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

const colorEstado = (estado) => {
  if (estado === 'ENTREGADO') return 'success';
  if (estado === 'CANCELADO') return 'danger';
  return 'warning';
};

// Dashboard: resumen general de la tienda y los últimos pedidos desde el backend
export const AdminDashboard = ({ onIrA }) => {
  const [productos, setProductos] = useState(() => obtenerProductosLocales());
  const [usuarios, setUsuarios] = useState(() => obtenerUsuariosLocales());
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState('');

  useEffect(() => {
    let activo = true;

    obtenerProductos().then((lista) => {
      if (activo && Array.isArray(lista)) setProductos(lista);
    });

    if (localStorage.getItem('token_mil_sabores')) {
      usuarioService.obtenerTodos().then((lista) => {
        if (activo && Array.isArray(lista) && lista.length > 0) setUsuarios(lista);
      });
    }

    const cargarPedidos = async () => {
      try {
        const datos = await listarPedidos();
        if (activo && Array.isArray(datos)) setPedidos(datos);
      } catch {
        if (activo) {
          setErrorConexion('No se pudieron cargar los pedidos desde el backend.');
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPedidos();
    return () => {
      activo = false;
    };
  }, []);

  const totalVentas = pedidos.reduce((suma, p) => suma + (Number(p.total ?? p.totalPagar) || 0), 0);
  const pedidosPendientes = pedidos.filter((p) => p.estado !== 'ENTREGADO' && p.estado !== 'CANCELADO').length;

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

          {errorConexion && <Alert variant="warning">{errorConexion}</Alert>}

          {cargando ? (
            <div className="text-center py-3">
              <Spinner animation="border" role="status" size="sm" className="me-2" />
              Cargando pedidos...
            </div>
          ) : pedidos.length === 0 ? (
            <p className="text-muted mb-0">Todavía no hay pedidos registrados en el backend.</p>
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
                  <tr key={p.id}>
                    <td>{String(p.id).padStart(6, '0')}</td>
                    <td>{[p.usuario?.nombre, p.usuario?.apellido].filter(Boolean).join(' ') || 'Cliente'}</td>
                    <td>{p.fechaPedido ? new Date(p.fechaPedido).toLocaleDateString('es-CL') : '—'}</td>
                    <td className="text-end">{clp(p.total)}</td>
                    <td>
                      <Badge bg={colorEstado(p.estado)} text={colorEstado(p.estado) === 'warning' ? 'dark' : undefined}>
                        {ESTADOS[p.estado]?.etiqueta || p.estado}
                      </Badge>
                    </td>
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
