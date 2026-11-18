import { useCallback, useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Alert, Form, Spinner } from 'react-bootstrap';
import {
  ESTADOS,
  listarPedidosConDetalles,
  cambiarEstado,
  eliminarPedido,
} from '../../services/PedidoService';

// Formato de precio chileno: 45000 → "$45.000"
const clp = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

const fecha = (valor) => {
  if (!valor) return '—';
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('es-CL');
};

//Administración de órdenes y boletas: lee los pedidos desde el backend Spring Boot.
//Cambiar el estado o eliminar un pedido impacta directamente en la base de datos.
export const AdminOrdenes = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState('');
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }
  const [pedidoDetalle, setPedidoDetalle] = useState(null);

  const cargarPedidos = useCallback(async () => {
    setCargando(true);
    setErrorConexion('');
    try {
      setPedidos(await listarPedidosConDetalles());
    } catch {
      setErrorConexion(
        'No se pudo conectar con el backend de pedidos. Verifica que Spring Boot esté corriendo en http://localhost:8080.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    const cargarInicial = async () => {
      try {
        const datos = await listarPedidosConDetalles();
        if (activo) setPedidos(datos);
      } catch {
        if (activo) {
          setErrorConexion(
            'No se pudo conectar con el backend de pedidos. Verifica que Spring Boot esté corriendo en http://localhost:8080.'
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarInicial();
    return () => {
      activo = false;
    };
  }, []);

  const handleCambiarEstado = async (pedido, estado) => {
    try {
      await cambiarEstado(pedido.id, estado);
      setMensaje({
        tipo: 'success',
        texto: `Pedido ${pedido.codigoSeguimiento} ahora está "${ESTADOS[estado]?.etiqueta || estado}".`,
      });
      await cargarPedidos();
    } catch (err) {
      setMensaje({
        tipo: 'danger',
        texto: err.response?.data?.message || 'No se pudo actualizar el estado del pedido.',
      });
    }
  };

  const handleEliminar = async (pedido) => {
    if (!window.confirm(`¿Eliminar el pedido ${pedido.codigoSeguimiento}?`)) return;

    try {
      await eliminarPedido(pedido.id);
      setMensaje({ tipo: 'success', texto: `Pedido ${pedido.codigoSeguimiento} eliminado.` });
      setPedidoDetalle(null);
      await cargarPedidos();
    } catch {
      setMensaje({
        tipo: 'danger',
        texto:
          'No se pudo eliminar el pedido. Si tiene productos asociados, primero elimina sus líneas de detalle.',
      });
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Órdenes y Boletas ({pedidos.length})</h4>
          <Button variant="secondary" size="sm" onClick={cargarPedidos} disabled={cargando}>
            Actualizar
          </Button>
        </div>

        {errorConexion && (
          <Alert variant="danger" className="d-flex align-items-center justify-content-between">
            <span>{errorConexion}</span>
            <Button variant="outline-danger" size="sm" onClick={cargarPedidos}>
              Reintentar
            </Button>
          </Alert>
        )}

        {mensaje && (
          <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
            {mensaje.texto}
          </Alert>
        )}

        {cargando ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status" size="sm" className="me-2" />
            Cargando pedidos del backend...
          </div>
        ) : pedidos.length === 0 ? (
          <p className="text-muted mb-0">
            Todavía no hay pedidos registrados en el backend.
          </p>
        ) : (
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Código</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th className="text-end">Total</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>{String(p.folio).padStart(6, '0')}</td>
                  <td className="text-nowrap">{p.codigoSeguimiento}</td>
                  <td>{p.cliente?.nombre}</td>
                  <td className="text-nowrap">{fecha(p.fecha)}</td>
                  <td className="text-end">{clp(p.totalPagar)}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      aria-label={`Estado del pedido ${p.codigoSeguimiento}`}
                      value={p.estado}
                      onChange={(e) => handleCambiarEstado(p, e.target.value)}
                    >
                      {Object.entries(ESTADOS).map(([valor, meta]) => (
                        <option key={valor} value={valor}>{meta.etiqueta}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td className="text-end text-nowrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => setPedidoDetalle(p)}
                    >
                      Ver boleta
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleEliminar(p)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* VENTANA CON EL DETALLE DE LA BOLETA (datos del backend) */}
      <Modal show={!!pedidoDetalle} onHide={() => setPedidoDetalle(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Boleta N.º {pedidoDetalle && String(pedidoDetalle.folio).padStart(6, '0')}
          </Modal.Title>
        </Modal.Header>
        {pedidoDetalle && (
          <Modal.Body>
            <p className="mb-1">
              <strong>Cliente:</strong> {pedidoDetalle.cliente?.nombre} ({pedidoDetalle.cliente?.rut || 'sin RUT'})
            </p>
            <p className="mb-1">
              <strong>Correo:</strong> {pedidoDetalle.cliente?.email || '—'}
            </p>
            <p className="mb-1">
              <strong>Dirección de despacho:</strong> {pedidoDetalle.direccionDespacho || '—'}
            </p>
            <p className="mb-1">
              <strong>Método de pago:</strong> {pedidoDetalle.metodoPago || '—'}
            </p>
            <p className="mb-3">
              <strong>Fecha:</strong> {fecha(pedidoDetalle.fecha)}
            </p>

            {pedidoDetalle.items.length === 0 ? (
              <p className="text-muted">
                Este pedido no tiene líneas de detalle registradas en el backend.
              </p>
            ) : (
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio unit.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidoDetalle.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.nombre}</td>
                      <td className="text-center">{it.cantidad}</td>
                      <td className="text-end">{clp(it.precio)}</td>
                      <td className="text-end">{clp(it.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="text-end">
              <div>Descuento aplicado: {pedidoDetalle.descuentoAplicado || 0}%</div>
              <div className="fs-5">
                <strong>Total: {clp(pedidoDetalle.totalPagar)}</strong>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </Card>
  );
};
