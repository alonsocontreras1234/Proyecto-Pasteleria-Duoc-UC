import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Badge, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Validators } from '../utils/validators';

const Boleta = () => {
  const [orden, setOrden] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pms_active_order');
      if (stored) {
        setOrden(JSON.parse(stored));
      } else {
        const all = JSON.parse(localStorage.getItem('pms_orders')) || [];
        if (all.length > 0) setOrden(all[0]);
      }
    } catch (e) {
      console.error("Error al cargar la orden para la boleta:", e);
    }
  }, []);

  if (!orden) {
    return (
      <Container className="py-5 text-center">
        <h3 className="mt-3 fw-bold">No hay ninguna boleta activa</h3>
        <p className="text-muted">Realiza un pedido a través del checkout para generar tu comprobante fiscal.</p>
        <Button as={Link} to="/catalogo" variant="primary">
          Ver Catálogo
        </Button>
      </Container>
    );
  }

  const handleImprimir = () => {
    window.print();
  };

  const fechaFormateada = new Date(orden.fechaEmision).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Container className="py-4 boleta-container" style={{ maxWidth: '850px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <Link to="/seguimiento" className="btn btn-outline-primary fw-semibold">
          ← Ir a Seguimiento en Vivo
        </Link>
        <Button variant="dark" onClick={handleImprimir} className="fw-semibold">
          Imprimir / Guardar PDF
        </Button>
      </div>

      <Card className="shadow border p-4 p-md-5 bg-white boleta-paper">
        {/* ENCABEZADO TRIBUTARIO SII */}
        <div className="d-flex justify-content-between flex-wrap gap-3 pb-4 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h2 className="fw-bold mb-0 text-dark">Pastelería Mil Sabores SpA</h2>
            </div>
            <p className="text-muted small mb-0">
              Giro: Elaboración y Venta de Productos de Pastelería y Panadería<br />
              Casa Matriz: Av. Providencia 1234, Providencia, Santiago<br />
              Sitio Web: www.pasteleriamilsabores.cl | Tel: +56 2 2345 6789
            </p>
          </div>

          <div className="border border-danger border-2 p-3 text-center rounded" style={{ minWidth: '220px' }}>
            <div className="text-danger fw-bold small">R.U.T.: 76.543.210-K</div>
            <div className="text-danger fw-bold fs-5 my-1">BOLETA ELECTRÓNICA</div>
            <div className="text-danger fw-bold fs-5">N.° {orden.folio}</div>
            <small className="text-danger d-block mt-1" style={{ fontSize: '0.7rem' }}>S.I.I. - SANTIAGO ORIENTE</small>
          </div>
        </div>

        {/* METADATOS Y CLIENTE */}
        <Row className="my-4 g-3">
          <Col sm={6}>
            <div className="p-3 bg-light rounded">
              <h6 className="fw-bold text-uppercase small text-muted mb-2">Datos del Receptor</h6>
              <div><strong>Señor(a):</strong> {orden.cliente.nombre}</div>
              <div><strong>RUN:</strong> {orden.cliente.rut}</div>
              <div><strong>Email:</strong> {orden.cliente.email}</div>
              <div><strong>Teléfono:</strong> {orden.cliente.telefono}</div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="p-3 bg-light rounded">
              <h6 className="fw-bold text-uppercase small text-muted mb-2">Datos del Servicio</h6>
              <div><strong>Fecha de Emisión:</strong> {fechaFormateada}</div>
              <div><strong>Código Seguimiento:</strong> <Badge bg="primary">{orden.orderCode}</Badge></div>
              <div><strong>Modalidad:</strong> {orden.entrega.tipo === 'retiro' ? 'Retiro en Taller' : 'Despacho a Domicilio'}</div>
              <div><strong>Fecha Programada:</strong> {orden.entrega.fechaPreferida} ({orden.entrega.franjaHoraria})</div>
            </div>
          </Col>
        </Row>

        {/* TABLA DE DETALLE */}
        <Table responsive className="align-middle mb-4">
          <thead className="table-light">
            <tr>
              <th>Cant.</th>
              <th>Descripción del Producto</th>
              <th className="text-end">Precio Unit.</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {orden.items.map((it) => (
              <tr key={it.id}>
                <td><strong>{it.quantity}</strong></td>
                <td>
                  <div>{it.name}</div>
                  {it.dedication && (
                    <small className="text-primary d-block fst-italic">«{it.dedication}»</small>
                  )}
                </td>
                <td className="text-end">{Validators.formatCLP(it.price)}</td>
                <td className="text-end fw-semibold">{Validators.formatCLP(it.price * it.quantity)}</td>
              </tr>
            ))}
            {orden.totales.costoEnvio > 0 && (
              <tr>
                <td>1</td>
                <td>Servicio de Despacho Refrigerado ({orden.entrega.comuna})</td>
                <td className="text-end">{Validators.formatCLP(orden.totales.costoEnvio)}</td>
                <td className="text-end fw-semibold">{Validators.formatCLP(orden.totales.costoEnvio)}</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* LIQUIDACIÓN FISCAL */}
        <div className="d-flex justify-content-end">
          <div style={{ minWidth: '280px' }}>
            {orden.totales.descuento > 0 && (
              <div className="d-flex justify-content-between text-success small mb-1">
                <span>Descuento Promocional:</span>
                <span>- {Validators.formatCLP(orden.totales.descuento)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>Monto Neto:</span>
              <span>{Validators.formatCLP(orden.totales.neto)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>I.V.A. (19 %):</span>
              <span>{Validators.formatCLP(orden.totales.iva)}</span>
            </div>
            <div className="d-flex justify-content-between fs-4 fw-bold text-dark pt-2 border-top">
              <span>TOTAL:</span>
              <span className="text-primary">{Validators.formatCLP(orden.totales.total)}</span>
            </div>
          </div>
        </div>

        {/* TIMBRE ELECTRÓNICO SIMULADO */}
        <div className="text-center mt-5 pt-4 border-top">
          <div className="d-inline-block border p-2 bg-light font-monospace small">
            ||-- TIMBRE ELECTRÓNICO S.I.I. --||<br />
            Res. N.° 80 de 2026 - Verifique documento en www.sii.cl<br />
            HASH: {orden.orderCode}-MIL-SABORES-VERIFIED
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default Boleta;