import { useState } from 'react';
import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from '../../data/productosDB';
import { ProductoForm } from './ProductoForm';

//Administración de productos: listar, buscar, crear, editar y eliminar
//Usa el CRUD de data/productosDB.js
export const AdminProductos = () => {
  const [productos, setProductos] = useState(() => obtenerProductos());
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }

  // Formulario: cerrado (false), producto nuevo (null) o el producto que se edita
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Categorías que existen en el catálogo, sin repetir (para el selector del formulario)
  const categorias = productos.reduce((lista, p) => {
    if (!lista.some((c) => c.id === p.categoria)) {
      lista.push({ id: p.categoria, nombre: p.categoriaNombre || p.categoria });
    }
    return lista;
  }, []);

  // Productos que coinciden con lo escrito en el buscador (nombre o código)
  const texto = busqueda.trim().toLowerCase();
  const productosFiltrados = productos.filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto)
  );

  const abrirNuevo = () => {
    setProductoEditando(null);
    setMostrarForm(true);
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarForm(true);
  };

  // Crea o actualiza; si hay error lo devuelve para que el formulario lo muestre
  const handleGuardar = (datos) => {
    const res = productoEditando
      ? actualizarProducto(productoEditando.id, datos)
      : crearProducto(datos);

    if (!res.ok) return res.error;

    setProductos(obtenerProductos());
    setMostrarForm(false);
    setMensaje({
      tipo: 'success',
      texto: productoEditando ? `Producto "${res.producto.nombre}" actualizado.` : `Producto "${res.producto.nombre}" creado.`
    });
    return null;
  };

  const handleEliminar = (producto) => {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;

    const res = eliminarProducto(producto.id);
    if (res.ok) {
      setProductos(obtenerProductos());
      setMensaje({ tipo: 'success', texto: `Producto "${producto.nombre}" eliminado.` });
    } else {
      setMensaje({ tipo: 'danger', texto: res.error });
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h4 className="mb-0">Productos ({productos.length})</h4>
          <Button variant="primary" size="sm" onClick={abrirNuevo}>+ Nuevo producto</Button>
        </div>

        {mensaje && (
          <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
            {mensaje.texto}
          </Alert>
        )}

        <Form.Control
          className="mb-3"
          placeholder="🔍 Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoriaNombre}</td>
                <td className="text-end">${p.precio.toLocaleString('es-CL')}</td>
                <td className="text-end text-nowrap">
                  <Button variant="secondary" size="sm" className="me-2" onClick={() => abrirEditar(p)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(p)}>Eliminar</Button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">No se encontraron productos.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      {/* VENTANA CON EL FORMULARIO (NUEVO / EDITAR) */}
      <Modal show={mostrarForm} onHide={() => setMostrarForm(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{productoEditando ? 'Editar producto' : 'Nuevo producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductoForm
            key={productoEditando?.id || 'nuevo'}
            productoInicial={productoEditando}
            categorias={categorias}
            onGuardar={handleGuardar}
            onCancelar={() => setMostrarForm(false)}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};
