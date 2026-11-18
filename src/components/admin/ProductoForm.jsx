import { useState } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

// Formulario para crear o editar un producto
// - productoInicial: el producto a editar (o null si es uno nuevo)
// - categorias: lista de { id, nombre } para el selector
// - onGuardar(datos): función asíncrona que devuelve un mensaje de error, o null si se guardó bien
// - onCancelar(): cierra el formulario
export const ProductoForm = ({ productoInicial, categorias, onGuardar, onCancelar }) => {
  const [datos, setDatos] = useState({
    codigo: productoInicial?.codigo || '',
    nombre: productoInicial?.nombre || '',
    categoria: productoInicial?.categoria || categorias[0]?.id || '',
    precio: productoInicial?.precio ?? '',
    stock: productoInicial?.stock ?? '',
    descripcion: productoInicial?.descripcion || '',
    imagen: productoInicial?.imagen || productoInicial?.imagenUrl || ''
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleCambio = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      // Nombre visible de la categoría elegida (ej: "Tortas Cuadradas")
      const categoriaNombre = categorias.find((c) => c.id === datos.categoria)?.nombre || datos.categoria;
      const mensajeError = await onGuardar({ ...datos, categoriaNombre });
      if (mensajeError) {
        setError(mensajeError);
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

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
        <Col xs={12} md={3}>
          <Form.Group controlId="producto-precio">
            <Form.Label>Precio (CLP) *</Form.Label>
            <Form.Control type="number" min="1" name="precio" value={datos.precio} onChange={handleCambio} placeholder="Ej: 45000" />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group controlId="producto-stock">
            <Form.Label>Stock *</Form.Label>
            <Form.Control type="number" min="0" step="1" name="stock" value={datos.stock} onChange={handleCambio} placeholder="Ej: 10" />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="producto-imagen">
            <Form.Label>Ruta de imagen</Form.Label>
            <Form.Control name="imagen" value={datos.imagen} onChange={handleCambio} placeholder="/images/torta-cuadrada-chocolate.jpg" />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="producto-descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} name="descripcion" value={datos.descripcion} onChange={handleCambio} />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancelar} disabled={guardando}>Cancelar</Button>
        <Button variant="primary" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : productoInicial ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </Form>
  );
};
