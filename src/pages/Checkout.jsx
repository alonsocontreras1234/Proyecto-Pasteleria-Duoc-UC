import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Validators, COMUNAS_TARIFAS } from '../utils/validators';
import { products } from '../data/products';

const CATALOGO_MAP = new Map(products.map((p) => [p.codigo, p]));

const Checkout = () => {
  const { items, subtotal, cupon, setCupon, montoDescuento, vaciarCarrito } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: user ? user.nombre : '',
    rut: user ? user.rut : '',
    email: user ? user.email : '',
    telefono: user ? user.telefono : '+56 9 ',
    tipoEntrega: 'domicilio', // 'domicilio' | 'retiro'
    direccion: user ? user.direccion : '',
    comuna: user ? user.comuna : 'Santiago Centro',
    fechaEntrega: Validators.getMinDeliveryDate(),
    franjaHoraria: '09:00 - 13:00 h',
    metodoPago: 'Webpay Plus (Débito/Crédito)'
  });

  const [errorRut, setErrorRut] = useState('');
  const [errorFecha, setErrorFecha] = useState('');

  // Costo de despacho validado contra catálogo oficial de tarifas
  const costoEnvio = formData.tipoEntrega === 'retiro' ? 0 : (COMUNAS_TARIFAS[formData.comuna] || 3000);
  const totalConDescuento = subtotal - montoDescuento;
  const totalFinal = totalConDescuento + costoEnvio;

  // Desglose fiscal sustractivo
  const neto = Math.round(totalFinal / 1.19);
  const iva = totalFinal - neto;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'rut') {
      if (value && !Validators.validarRut(value)) {
        setErrorRut('RUN inválido. Debe ingresar formato con dígito verificador correcto (Módulo 11).');
      } else {
        setErrorRut('');
      }
    }

    if (name === 'fechaEntrega') {
      const minDate = Validators.getMinDeliveryDate();
      if (value < minDate) {
        setErrorFecha('Los pedidos deben programarse con un mínimo de 24 horas de anticipación.');
      } else {
        setErrorFecha('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Tu carrito no tiene productos para procesar el pago.');
      return;
    }

    if (!Validators.validarRut(formData.rut)) {
      setErrorRut('El RUN ingresado no supera la validación oficial del algoritmo Módulo 11.');
      return;
    }

    if (formData.fechaEntrega < Validators.getMinDeliveryDate()) {
      setErrorFecha('La fecha debe ser igual o superior a 24 horas a partir de hoy.');
      return;
    }

    // Blindaje de precios: reconstruir y recalcular cada ítem desde el catálogo oficial
    const verifiedItems = items.map((it) => {
      const oficial = CATALOGO_MAP.get(it.codigo);
      const precioVerificado = oficial ? oficial.precioNumero : Number(it.precioNumero || 0);
      return {
        id: it.codigo,
        name: oficial ? oficial.nombre : it.nombre,
        category: oficial ? oficial.categoria : it.categoria,
        price: precioVerificado,
        quantity: Math.max(1, parseInt(it.cantidad, 10) || 1),
        dedication: it.dedicatoria ? String(it.dedicatoria).slice(0, 100) : ''
      };
    });

    const subtotalVerificado = verifiedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const descuentoVerificado = (cupon && cupon.trim().toUpperCase() === 'FELICES50') ? Math.round(subtotalVerificado * 0.10) : 0;
    const envioVerificado = formData.tipoEntrega === 'retiro' ? 0 : (COMUNAS_TARIFAS[formData.comuna] || 3000);
    const totalVerificado = (subtotalVerificado - descuentoVerificado) + envioVerificado;
    const netoVerificado = Math.round(totalVerificado / 1.19);
    const ivaVerificado = totalVerificado - netoVerificado;

    // Construcción de la orden oficial inmutable
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `PMS-2026-${randomNum}`;
    const folio = Math.floor(4890 + Math.random() * 100);

    const nuevaOrden = {
      orderCode,
      folio,
      fechaEmision: new Date().toISOString(),
      cliente: {
        nombre: formData.nombre.trim(),
        rut: formData.rut.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim()
      },
      entrega: {
        tipo: formData.tipoEntrega,
        direccion: formData.tipoEntrega === 'retiro' ? 'Taller Central - Av. Providencia 1234, Santiago' : formData.direccion.trim(),
        comuna: formData.tipoEntrega === 'retiro' ? 'Providencia' : formData.comuna,
        fechaPreferida: formData.fechaEntrega,
        franjaHoraria: formData.franjaHoraria,
        costoEnvio: envioVerificado
      },
      pago: {
        metodo: formData.metodoPago,
        estado: 'Aprobado'
      },
      items: verifiedItems,
      totales: {
        subtotalBruto: subtotalVerificado,
        descuento: descuentoVerificado,
        costoEnvio: envioVerificado,
        neto: netoVerificado,
        iva: ivaVerificado,
        total: totalVerificado
      },
      estadoActual: {
        fase: 1,
        nombre: 'Pedido Recibido y Confirmado',
        descripcion: 'Tu orden fue ingresada al sistema y el pago fue verificado con éxito.',
        horaActualizacion: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      },
      historialEstados: [
        {
          fase: 1,
          nombre: 'Pedido Recibido y Confirmado',
          fecha: new Date().toLocaleString('es-CL'),
          completado: true
        }
      ],
      repartidor: {
        nombre: 'Carlos Morales',
        vehiculo: 'Furgón Refrigerado Pastelería',
        patente: 'PSMS-26',
        telefono: '+56 9 8765 4321'
      }
    };

    try {
      const pedidosPrevios = JSON.parse(localStorage.getItem('pms_orders')) || [];
      pedidosPrevios.unshift(nuevaOrden);
      localStorage.setItem('pms_orders', JSON.stringify(pedidosPrevios));
      localStorage.setItem('pms_active_order', JSON.stringify(nuevaOrden));
    } catch (err) {
      console.error('Error al guardar pedido:', err);
    }

    vaciarCarrito();
    navigate('/boleta');
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold display-6">Finalizar Compra y Despacho</h1>
        <p className="text-muted">
          Ingresa los datos para la emisión de tu boleta fiscal electrónica y la programación del despacho.
        </p>
      </div>

      {items.length === 0 && (
        <Alert variant="warning" className="d-flex align-items-center justify-content-between">
          <span>⚠️ Actualmente no tienes productos en tu carrito.</span>
          <Button variant="outline-dark" size="sm" onClick={() => navigate('/catalogo')}>
            Ir al Catálogo
          </Button>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <Col lg={7}>
            {/* DATOS DEL CLIENTE */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">1. Datos del Cliente (Boleta Electrónica)</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        required
                        placeholder="Ej: Fernando Barra"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">RUN (Sin puntos y con guion)</Form.Label>
                      <Form.Control
                        type="text"
                        name="rut"
                        required
                        placeholder="19876543-K"
                        value={formData.rut}
                        onChange={handleChange}
                        isInvalid={!!errorRut}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errorRut}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        required
                        placeholder="usuario@dominio.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Teléfono de Contacto</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        required
                        placeholder="+56 9 8765 4321"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* OPCIONES DE DESPACHO Y FECHA */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">2. Programación de Entrega (+24 h)</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Label className="small fw-semibold">Modalidad de Recepción</Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="radio"
                        id="entrega-domicilio"
                        name="tipoEntrega"
                        value="domicilio"
                        label="Despacho a Domicilio (Refrigerado)"
                        checked={formData.tipoEntrega === 'domicilio'}
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="radio"
                        id="entrega-retiro"
                        name="tipoEntrega"
                        value="retiro"
                        label="Retiro en Taller Central (Gratis)"
                        checked={formData.tipoEntrega === 'retiro'}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>

                  {formData.tipoEntrega === 'domicilio' && (
                    <>
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold">Dirección de Despacho</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion"
                            required
                            placeholder="Calle, Número, Depto/Casa"
                            value={formData.direccion}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold">Comuna de Entrega</Form.Label>
                          <Form.Select
                            name="comuna"
                            value={formData.comuna}
                            onChange={handleChange}
                          >
                            {Object.keys(COMUNAS_TARIFAS).map((c) => (
                              <option key={c} value={c}>
                                {c} ({Validators.formatCLP(COMUNAS_TARIFAS[c])})
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">
                        Fecha Programada (Mínimo +24 h)
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaEntrega"
                        min={Validators.getMinDeliveryDate()}
                        required
                        value={formData.fechaEntrega}
                        onChange={handleChange}
                        isInvalid={!!errorFecha}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errorFecha}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Franja Horaria</Form.Label>
                      <Form.Select
                        name="franjaHoraria"
                        value={formData.franjaHoraria}
                        onChange={handleChange}
                      >
                        <option value="09:00 - 13:00 h">Mañana (09:00 - 13:00 h)</option>
                        <option value="14:00 - 19:00 h">Tarde (14:00 - 19:00 h)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* MÉTODO DE PAGO */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">3. Método de Pago</h5>
              </Card.Header>
              <Card.Body>
                <Form.Select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  size="lg"
                >
                  <option value="Webpay Plus (Débito/Crédito)">💳 Webpay Plus (Débito / Crédito)</option>
                  <option value="Transferencia Electrónica Directa">🏦 Transferencia Bancaria Directa</option>
                  <option value="Mercado Pago">📱 Mercado Pago</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>

          {/* COLUMNA DERECHA: RESUMEN Y LIQUIDACIÓN */}
          <Col lg={5}>
            <Card className="shadow-sm border-0 sticky-top" style={{ top: '90px' }}>
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">Resumen de Liquidación</h5>
              </Card.Header>
              <Card.Body>
                {/* LISTA RESUMIDA */}
                <div className="mb-3 overflow-auto" style={{ maxHeight: '200px' }}>
                  <Table size="sm" borderless className="align-middle mb-0">
                    <tbody>
                      {items.map((it) => {
                        const precioOficial = CATALOGO_MAP.get(it.codigo)?.precioNumero ?? it.precioNumero;
                        return (
                          <tr key={it.codigo} className="border-bottom">
                            <td>
                              <strong>{it.nombre}</strong>
                              <div className="small text-muted">{it.cantidad} × {Validators.formatCLP(precioOficial)}</div>
                              {it.dedicatoria && <small className="d-block text-primary">«{it.dedicatoria}»</small>}
                            </td>
                            <td className="text-end fw-semibold">
                              {Validators.formatCLP(precioOficial * it.cantidad)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* CAMPO CUPÓN */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Cupón Promocional</Form.Label>
                  <div className="input-group input-group-sm">
                    <Form.Control
                      type="text"
                      placeholder="FELICES50"
                      value={cupon}
                      onChange={(e) => setCupon(e.target.value.toUpperCase())}
                    />
                    <span className="input-group-text bg-light">10 % OFF</span>
                  </div>
                  {cupon && cupon.trim().toUpperCase() === 'FELICES50' && (
                    <small className="text-success fw-semibold mt-1 d-block">
                      ✓ Descuento institucional verificado
                    </small>
                  )}
                </Form.Group>

                {/* DESGLOSE FISCAL */}
                <div className="border-top pt-2">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Subtotal Bruto:</span>
                    <span>{Validators.formatCLP(subtotal)}</span>
                  </div>

                  {montoDescuento > 0 && (
                    <div className="d-flex justify-content-between small text-success mb-1">
                      <span>Descuento Cupón:</span>
                      <span>- {Validators.formatCLP(montoDescuento)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Costo de Despacho:</span>
                    <span>{formData.tipoEntrega === 'retiro' ? 'GRATIS' : Validators.formatCLP(costoEnvio)}</span>
                  </div>

                  <hr className="my-2" />

                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Monto Neto (Base Imponible):</span>
                    <span>{Validators.formatCLP(neto)}</span>
                  </div>

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>IVA Débito Fiscal (19 %):</span>
                    <span>{Validators.formatCLP(iva)}</span>
                  </div>

                  <div className="d-flex justify-content-between fs-4 fw-bold text-dark pt-2 border-top">
                    <span>Total a Pagar:</span>
                    <span className="text-primary">{Validators.formatCLP(totalFinal)}</span>
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="fw-bold shadow"
                    disabled={items.length === 0}
                  >
                    Confirmar Pago y Generar Boleta
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Checkout;