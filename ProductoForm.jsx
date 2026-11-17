import { useState } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

//Formulario para crear o editar un producto
//- productoInicial: el producto a editar (o null si es uno nuevo)
//- categorias: lista de { id, nombre } para el selector
//- onGuardar(datos): devuelve un mensaje de error, o null si se guardó bien
//- onCancelar(): cierra el formulario
export const ProductoForm = ({ productoInicial, categorias, onGuardar, onCancelar }) => {
  const [datos, setDatos] = useState({
    codigo: productoInicial?.codigo || '',
    nombre: productoInicial?.nombre || '',
    categoria: productoInicial?.categoria || categorias[0]?.id || '',
    precio: productoInicial?.precio ?? '',
    descripcion: productoInicial?.descripcion || '',
    imagen: productoInicial?.imagen || ''
  });
  const [error, setError] = useState('');

  // Actualiza un campo del formulario según su "name"
  const handleCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Nombre visible de la categoría elegida (ej: "Tortas Cuadradas")
    const categoriaNombre = categorias.find((c) => c.id === datos.categoria)?.nombre || datos.categoria;

    const mensajeError = onGuardar({ ...datos, categoriaNombre });
    setError(mensajeError || '');
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      <Row className="g-3">
        <Col xs={12} md={4}>
          <Form.Group controlId="producto-codigo">
            <Form.Label>Código *</Form.Label>
            <Form.Control name="codigo" value={datos.codigo} onChange={handleCambio} placeholder="Ej: TC003" />
          </Form.Group>
        </Col>
        <Col xs={12} md={8}>
          <Form.Group controlId="producto-nombre">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control name="nombre" value={datos.nombre} onChange={handleCambio} placeholder="Ej: Torta de Lúcuma" />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="producto-categoria">
            <Form.Label>Categoría *</Form.Label>
            <Form.Select name="categoria" value={datos.categoria} onChange={handleCambio}>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="producto-precio">
            <Form.Label>Precio (CLP) *</Form.Label>
            <Form.Control type="number" min="1" name="precio" value={datos.precio} onChange={handleCambio} placeholder="Ej: 45000" />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="producto-descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={2} name="descripcion" value={datos.descripcion} onChange={handleCambio} />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="producto-imagen">
            <Form.Label>Imagen (ruta o enlace)</Form.Label>
            <Form.Control name="imagen" value={datos.imagen} onChange={handleCambio} placeholder="Ej: /images/torta-lucuma.jpg" />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button variant="primary" type="submit">
          {productoInicial ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </Form>
  );
};
