import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../../services/ProductoService';
import { ProductoForm } from './ProductoForm';

// Lista fija de categorías alineada con Catalogo.jsx y la base de datos
const CATEGORIAS_FIJAS = [
  { id: 'cuadradas', nombre: 'Tortas Cuadradas' },
  { id: 'circulares', nombre: 'Tortas Circulares' },
  { id: 'postres', nombre: 'Postres' },
  { id: 'sin-azucar', nombre: 'Sin Azúcar' },
  { id: 'tradicional', nombre: 'Tradicional' },
  { id: 'sin-gluten', nombre: 'Sin Gluten' },
  { id: 'vegana', nombre: 'Veganas' },
  { id: 'especiales', nombre: 'Especiales' },
];

// Administración de productos: listar, buscar, crear, editar y eliminar
export const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }

  // Formulario: cerrado (false), producto nuevo (null) o el producto que se edita
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Carga los productos desde Spring Boot (con respaldo local si el servidor está apagado)
  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: error.response?.data?.error || 'Error al cargar los productos desde el servidor.'
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Combina las categorías fijas con cualquier categoría extra que venga desde la BD
  const categorias = [...CATEGORIAS_FIJAS];
  productos.forEach((p) => {
    if (p.categoria && !categorias.some((c) => c.id === p.categoria)) {
      categorias.push({ id: p.categoria, nombre: p.categoriaNombre || p.categoria });
    }
  });

  // Resuelve el nombre legible de la categoría aunque el backend envíe solo la clave (ej: "circulares")
  const obtenerNombreCategoria = (producto) => {
    const encontrada = categorias.find((c) => c.id === producto.categoria);
    return encontrada ? encontrada.nombre : (producto.categoriaNombre || producto.categoria || 'Sin categoría');
  };

  // Productos que coinciden con lo escrito en el buscador (nombre o código)
  const texto = busqueda.trim().toLowerCase();
  const productosFiltrados = productos.filter(
    (p) =>
      (p.nombre || '').toLowerCase().includes(texto) ||
      (p.codigo || '').toLowerCase().includes(texto)
  );

  const abrirNuevo = () => {
    setProductoEditando(null);
    setMostrarForm(true);
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarForm(true);
  };

  // Crea o actualiza de forma asíncrona; devuelve el mensaje de error HTTP (400, 401, 403, 409) al formulario
  const handleGuardar = async (datos) => {
    try {
      const res = productoEditando
        ? await actualizarProducto(productoEditando.id, datos)
        : await crearProducto(datos);

      // Compatibilidad por si ProductoService usó el respaldo local (productosDB.js)
      if (res && res.ok === false) return res.error;

      const productoGuardado = res?.producto || res;
      await cargarProductos();
      setMostrarForm(false);
      setMensaje({
        tipo: 'success',
        texto: productoEditando
          ? `Producto "${productoGuardado.nombre}" actualizado.`
          : `Producto "${productoGuardado.nombre}" creado.`
      });
      return null;
    } catch (err) {
      return (
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Error al guardar el producto en el servidor.'
      );
    }
  };

  const handleEliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;

    try {
      const res = await eliminarProducto(producto.id);

      // Compatibilidad por si ProductoService usó el respaldo local (productosDB.js)
      if (res && res.ok === false) {
        setMensaje({ tipo: 'danger', texto: res.error });
        return;
      }

      await cargarProductos();
      setMensaje({ tipo: 'success', texto: `Producto "${producto.nombre}" eliminado.` });
    } catch (err) {
      setMensaje({
        tipo: 'danger',
        texto:
          err.response?.data?.error ||
          err.response?.data?.message ||
          'No tienes permisos o ocurrió un error al eliminar el producto.'
      });
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
            {cargando ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">Cargando productos...</td>
              </tr>
            ) : (
              <>
                {productosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{obtenerNombreCategoria(p)}</td>
                    <td className="text-end">${Number(p.precio || 0).toLocaleString('es-CL')}</td>
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
              </>
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