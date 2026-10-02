import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Validators } from '../utils/validators';

const Registro = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    email: '',
    password: '',
    telefono: '+56 9 ',
    fechaNacimiento: '',
    codigoPromo: ''
  });

  const [errorRut, setErrorRut] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'rut') {
      if (value && !Validators.validarRut(value)) {
        setErrorRut('RUN inválido según el algoritmo oficial de Módulo 11.');
      } else {
        setErrorRut('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Validators.validarRut(form.rut)) {
      setErrorRut('El RUN ingresado no es válido. Verifica el dígito verificador.');
      return;
    }

    register(form);
    setMensajeExito('¡Cuenta creada y beneficios calculados exitosamente! Redirigiendo a tu perfil...');

    setTimeout(() => {
      navigate('/perfil');
    }, 1500);
  };

  return (
    <Container className="py-4" style={{ maxWidth: '650px' }}>
      <Card className="shadow border-0 p-4 p-md-5">
        <div className="text-center mb-4">
          <span className="fs-1">🎂</span>
          <h2 className="fw-bold mt-2">Crear Cuenta de Cliente</h2>
          <p className="text-muted small">
            Regístrate en el Club Mil Sabores y accede a promociones por edad y beneficios para la comunidad Duoc UC.
          </p>
        </div>

        {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              required
              placeholder="Ej: Magdalena Zúñiga"
              value={form.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">RUN (Módulo 11)</Form.Label>
                <Form.Control
                  type="text"
                  name="rut"
                  required
                  placeholder="19876543-K"
                  value={form.rut}
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
                <Form.Label className="small fw-semibold">Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  required
                  value={form.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Correo Electrónico (Institucional o Personal)</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              placeholder="alumno@duocuc.cl"
              value={form.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Si usas correo @duocuc.cl o @alumnos.duoc.cl obtendrás torta gratis en tu cumpleaños.
            </Form.Text>
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  required
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Mayores de 50 años reciben 50 % de descuento.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Código Promocional (Opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="codigoPromo"
                  placeholder="FELICES50"
                  value={form.codigoPromo}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" size="lg" className="fw-bold shadow">
              Registrarme en Mil Sabores
            </Button>
          </div>

          <div className="text-center mt-3 small text-muted">
            ¿Ya tienes cuenta? <Link to="/perfil" className="fw-semibold">Iniciar sesión</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Registro;