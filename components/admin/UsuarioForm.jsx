import { useState } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

//Formulario para crear o editar un usuario
//- usuarioInicial: el usuario a editar (o null si es uno nuevo)
//- onGuardar(datos): devuelve un mensaje de error, o null si se guardó bien
//- onCancelar(): cierra el formulario
//Al editar no se cambian el RUT, el correo ni la fecha de nacimiento
export const UsuarioForm = ({ usuarioInicial, onGuardar, onCancelar }) => {
  const esNuevo = !usuarioInicial;

  const [datos, setDatos] = useState({
    rut: usuarioInicial?.rut || '',
    nombre: usuarioInicial?.nombre || '',
    email: usuarioInicial?.email || '',
    fechaNacimiento: usuarioInicial?.fechaNacimiento || '',
    telefono: usuarioInicial?.telefono || '',
    direccion: usuarioInicial?.direccion || '',
    password: '',
    codigoPromo: ''
  });
  const [error, setError] = useState('');

  // Actualiza un campo del formulario según su "name"
  const handleCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mensajeError = onGuardar(datos);
    setError(mensajeError || '');
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      <Row className="g-3">
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-rut">
            <Form.Label>RUT *</Form.Label>
            <Form.Control name="rut" value={datos.rut} onChange={handleCambio} disabled={!esNuevo} placeholder="Ej: 12.345.678-5" />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-nombre">
            <Form.Label>Nombre completo *</Form.Label>
            <Form.Control name="nombre" value={datos.nombre} onChange={handleCambio} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-email">
            <Form.Label>Correo *</Form.Label>
            <Form.Control type="email" name="email" value={datos.email} onChange={handleCambio} disabled={!esNuevo} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-fecha">
            <Form.Label>Fecha de nacimiento *</Form.Label>
            <Form.Control type="date" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={handleCambio} disabled={!esNuevo} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-telefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control name="telefono" value={datos.telefono} onChange={handleCambio} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-direccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control name="direccion" value={datos.direccion} onChange={handleCambio} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="usuario-password">
            <Form.Label>{esNuevo ? 'Contraseña *' : 'Nueva contraseña (opcional)'}</Form.Label>
            <Form.Control type="password" name="password" value={datos.password} onChange={handleCambio} />
          </Form.Group>
        </Col>
        {esNuevo && (
          <Col xs={12} md={6}>
            <Form.Group controlId="usuario-codigo">
              <Form.Label>Código promocional</Form.Label>
              <Form.Control name="codigoPromo" value={datos.codigoPromo} onChange={handleCambio} placeholder="Ej: FELICES50" />
            </Form.Group>
          </Col>
        )}
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button variant="primary" type="submit">{esNuevo ? 'Crear usuario' : 'Guardar cambios'}</Button>
      </div>
    </Form>
  );
};
