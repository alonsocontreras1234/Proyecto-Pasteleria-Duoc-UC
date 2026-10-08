import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, ProgressBar, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const FASES = [
  { fase: 1, nombre: 'Pedido Confirmado', desc: 'Pago verificado y orden ingresada en el sistema de producción.' },
  { fase: 2, nombre: 'En Preparación', desc: 'Nuestros maestros pasteleros están horneando y decorando tu pedido.' },
  { fase: 3, nombre: 'Control de Calidad', desc: 'Inspección de dedicatoria y empaque refrigerado para viaje seguro.' },
  { fase: 4, nombre: 'En Ruta de Despacho', desc: 'El repartidor se encuentra en camino con cadena de frío garantizada.' },
  { fase: 5, nombre: 'Entregado con Éxito', desc: 'Pedido entregado en la dirección indicada. ¡Que lo disfruten!' }
];

const Seguimiento = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [pedido, setPedido] = useState(null);
  const [alerta, setAlerta] = useState('');

  // Solo usuarios con rol o correo institucional docente/admin pueden simular cambios de despacho
  const esOperadorAutorizado = user && (user.email.includes('duoc') || user.email.includes('admin') || user.email === 'f.barra@alumnos.duoc.cl');

  useEffect(() => {
    try {
      const active = localStorage.getItem('pms_active_order');
      if (active) {
        setPedido(JSON.parse(active));
      } else {
        const all = JSON.parse(localStorage.getItem('pms_orders')) || [];
        if (all.length > 0) setPedido(all[0]);
      }
    } catch (e) {
      console.error("Error al cargar orden en seguimiento:", e);
    }
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    setAlerta('');

    if (!query.trim()) {
      setAlerta('Ingresa un código de pedido o RUT para buscar.');
      return;
    }

    const cleanQuery = query.trim().toUpperCase();
    const cleanRut = cleanQuery.replace(/[^0-9kK]/g, '');

    const all = JSON.parse(localStorage.getItem('pms_orders')) || [];
    const encontrado = all.find(
      (o) =>
        o.orderCode.toUpperCase() === cleanQuery ||
        o.cliente.rut.replace(/[^0-9kK]/g, '').toUpperCase() === cleanRut
    );

    if (encontrado) {
      setPedido(encontrado);
    } else {
      setAlerta(`No se encontró ningún pedido con el identificador «${query}».`);
    }
  };

  // Simulación controlada por autorización
  const handleCambiarFase = (nuevaFase) => {
    if (!pedido) return;
    if (!esOperadorAutorizado) {
      alert('Acceso restringido: Solo personal operativo o docente acreditado puede modificar las etapas de despacho.');
      return;
    }

    const info = FASES[nuevaFase - 1];
    const horaActual = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const pedidoActualizado = {
      ...pedido,
      estadoActual: {
        fase: nuevaFase,
        nombre: info.nombre,
        descripcion: info.desc,
        horaActualizacion: horaActual
      }
    };

    if (!pedidoActualizado.historialEstados.some((h) => h.fase === nuevaFase)) {
      pedidoActualizado.historialEstados.push({
        fase: nuevaFase,
        nombre: info.nombre,
        fecha: new Date().toLocaleString('es-CL'),
        completado: true
      });
    }

    setPedido(pedidoActualizado);

    try {
      const all = JSON.parse(localStorage.getItem('pms_orders')) || [];
      const idx = all.findIndex((o) => o.orderCode === pedido.orderCode);
      if (idx !== -1) {
        all[idx] = pedidoActualizado;
        localStorage.setItem('pms_orders', JSON.stringify(all));
      }
      localStorage.setItem('pms_active_order', JSON.stringify(pedidoActualizado));
    } catch (err) {
      console.error("Error al guardar estado actualizado:", err);
    }
  };

  const faseActual = pedido?.estadoActual?.fase || 1;
  const progresoPorcentaje = (faseActual / 5) * 100;

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <Badge bg="warning" text="dark" className="px-3 py-2 fw-semibold mb-2">
          Monitoreo en Tiempo Real
        </Badge>
        <h1 className="fw-bold display-5">Seguimiento de Despacho</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Conoce en todo momento la etapa de preparación y la ruta de entrega de tus pasteles y postres.
        </p>
      </div>

      {/* FORMULARIO DE BÚSQUEDA */}
      <Card className="shadow-sm border-0 p-3 mb-5 mx-auto" style={{ maxWidth: '700px' }}>
        <Form onSubmit={handleBuscar}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              size="lg"
              placeholder="Buscar por código (PMS-2026-XXXX) o RUT..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="primary" size="lg" className="px-4 fw-semibold">
              Rastrear
            </Button>
          </div>
        </Form>
      </Card>

      {alerta && <Alert variant="warning" className="text-center mx-auto mb-4" style={{ maxWidth: '700px' }}>{alerta}</Alert>}

      {pedido && (
        <div className="mx-auto" style={{ maxWidth: '850px' }}>
          {/* TARJETA PRINCIPAL DE ESTADO */}
          <Card className="shadow border-0 mb-4 overflow-hidden">
            <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span className="text-white-50 small text-uppercase">Código de Envío</span>
                <h3 className="fw-bold mb-0">{pedido.orderCode}</h3>
              </div>
              <div className="text-end">
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
                  {pedido.estadoActual.nombre}
                </Badge>
                <div className="text-white-50 small mt-1">
                  Actualizado: {pedido.estadoActual.horaActualizacion || 'En curso'}
                </div>
              </div>
            </div>

            <Card.Body className="p-4 p-md-5">
              {/* LÍNEA DE PROGRESO */}
              <div className="mb-4">
                <ProgressBar now={progresoPorcentaje} variant="success" style={{ height: '10px' }} className="rounded-pill" />
              </div>

              {/* LAS 5 FASES */}
              <Row className="g-2 text-center mb-4">
                {FASES.map((f) => {
                  const completada = f.fase <= faseActual;
                  const activa = f.fase === faseActual;
                  return (
                    <Col key={f.fase} style={{ flex: '1 0 18%' }}>
                      <div
                        className={`p-2 rounded border h-100 ${
                          activa
                            ? 'bg-light border-primary shadow-sm'
                            : completada
                            ? 'bg-light border-success text-success'
                            : 'text-muted border-light'
                        }`}
                      >
                        <div className="fs-5 fw-bold mb-1">Paso {f.fase}</div>
                        <small className="fw-bold d-block" style={{ fontSize: '0.75rem' }}>
                          {f.nombre}
                        </small>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {/* DETALLES DE ENTREGA Y REPARTIDOR */}
              <Row className="g-3 mt-3 pt-3 border-top">
                <Col md={6}>
                  <h6 className="fw-bold text-muted small text-uppercase mb-2">Destino de Entrega</h6>
                  <div><strong>Destinatario:</strong> {pedido.cliente.nombre}</div>
                  <div><strong>Dirección:</strong> {pedido.entrega.direccion}, {pedido.entrega.comuna}</div>
                  <div><strong>Fecha Estimada:</strong> {pedido.entrega.fechaPreferida} ({pedido.entrega.franjaHoraria})</div>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold text-muted small text-uppercase mb-2">Transporte Asignado</h6>
                  <div><strong>Repartidor:</strong> {pedido.repartidor?.nombre || 'Carlos Morales'}</div>
                  <div><strong>Vehículo:</strong> {pedido.repartidor?.vehiculo || 'Furgón Refrigerado'}</div>
                  <div><strong>Patente:</strong> {pedido.repartidor?.patente || 'PSMS-26'}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* PANEL DE DEMOSTRACIÓN CONDICIONADO A AUTORIZACIÓN OPERATIVA */}
          {esOperadorAutorizado && (
            <Card className="border-warning bg-light shadow-sm p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold text-dark mb-0">Panel de Control de Despacho (Operador Acreditado)</h6>
                <Badge bg="success">Acceso Autorizado</Badge>
              </div>
              <p className="small text-muted mb-3">
                Herramienta protegida para actualizar el estado del despacho en tiempo real:
              </p>
              <div className="d-flex gap-2 flex-wrap">
                {FASES.map((f) => (
                  <Button
                    key={f.fase}
                    variant={faseActual === f.fase ? 'warning' : 'outline-secondary'}
                    size="sm"
                    className="fw-semibold"
                    onClick={() => handleCambiarFase(f.fase)}
                  >
                    Fase {f.fase}: {f.nombre}
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </Container>
  );
};

export default Seguimiento;