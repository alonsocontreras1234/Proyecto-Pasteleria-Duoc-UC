import { useState } from 'react';
import { Card, Table, Button, Modal, Alert, Form } from 'react-bootstrap';
import { obtenerPedidos, actualizarEstadoPedido, eliminarPedido, ETAPAS_PEDIDO } from '../../data/pedidosDB';

// Formato de precio chileno: 45000 → "$45.000"
const clp = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

//Administración de órdenes y boletas: ver el detalle, cambiar la etapa y eliminar
//Usa el CRUD de data/pedidosDB.js (el cambio de etapa se ve en Seguimiento)
export const AdminOrdenes = () => {
  const [pedidos, setPedidos] = useState(() => obtenerPedidos());
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }
  const [pedidoDetalle, setPedidoDetalle] = useState(null);

  const handleCambiarEtapa = (pedido, etapa) => {
    const res = actualizarEstadoPedido(pedido.codigoSeguimiento, etapa);
    if (res.ok) {
      setPedidos(obtenerPedidos());
      setMensaje({ tipo: 'success', texto: `Pedido ${pedido.codigoSeguimiento} ahora está "${res.pedido.estadoNombre}".` });
    } else {
      setMensaje({ tipo: 'danger', texto: res.error });
    }
  };

  const handleEliminar = (pedido) => {
    if (!window.confirm(`¿Eliminar el pedido ${pedido.codigoSeguimiento}?`)) return;

    const res = eliminarPedido(pedido.codigoSeguimiento);
    if (res.ok) {
      setPedidos(obtenerPedidos());
      setMensaje({ tipo: 'success', texto: `Pedido ${pedido.codigoSeguimiento} eliminado.` });
    } else {
      setMensaje({ tipo: 'danger', texto: res.error });
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-3">Órdenes y Boletas ({pedidos.length})</h4>

        {mensaje && (
          <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
            {mensaje.texto}
          </Alert>
        )}

        {pedidos.length === 0 ? (
          <p className="text-muted mb-0">Todavía no hay pedidos registrados.</p>
        ) : (
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Código</th>
                <th>Cliente</th>
                <th className="text-end">Total</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.codigoSeguimiento}>
                  <td>{String(p.folio).padStart(6, '0')}</td>
                  <td className="text-nowrap">{p.codigoSeguimiento}</td>
                  <td>{p.cliente?.nombre}</td>
                  <td className="text-end">{clp(p.totalPagar)}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      aria-label={`Estado del pedido ${p.codigoSeguimiento}`}
                      value={p.etapa}
                      onChange={(e) => handleCambiarEtapa(p, e.target.value)}
                    >
                      {Object.entries(ETAPAS_PEDIDO).map(([numero, nombre]) => (
                        <option key={numero} value={numero}>{nombre}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td className="text-end text-nowrap">
                    <Button variant="secondary" size="sm" className="me-2" onClick={() => setPedidoDetalle(p)}>Ver boleta</Button>
                    <Button variant="danger" size="sm" onClick={() => handleEliminar(p)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* VENTANA CON EL DETALLE DE LA BOLETA */}
      <Modal show={!!pedidoDetalle} onHide={() => setPedidoDetalle(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Boleta N.º {pedidoDetalle && String(pedidoDetalle.folio).padStart(6, '0')}</Modal.Title>
        </Modal.Header>
        {pedidoDetalle && (
          <Modal.Body>
            <p className="mb-1"><strong>Cliente:</strong> {pedidoDetalle.cliente?.nombre} ({pedidoDetalle.cliente?.rut})</p>
            <p className="mb-1"><strong>Correo:</strong> {pedidoDetalle.cliente?.email}</p>
            <p className="mb-1"><strong>Entrega:</strong> {pedidoDetalle.tipoEntrega === 'retiro' ? 'Retiro en tienda' : pedidoDetalle.cliente?.direccion}</p>
            <p className="mb-3"><strong>Fecha:</strong> {new Date(pedidoDetalle.fecha).toLocaleString('es-CL')}</p>

            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedidoDetalle.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.nombre}</td>
                    <td className="text-center">{it.cantidad}</td>
                    <td className="text-end">{clp(it.precio * it.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-end">
              {pedidoDetalle.descuentoTorta > 0 && <div>Torta gratis Duoc UC: -{clp(pedidoDetalle.descuentoTorta)}</div>}
              <div>Descuento: -{clp(pedidoDetalle.descuentoMonto)}</div>
              <div>Despacho: {clp(pedidoDetalle.costoDespacho)}</div>
              <div className="fs-5"><strong>Total: {clp(pedidoDetalle.totalPagar)}</strong></div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </Card>
  );
};
