import { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import {
  CATEGORIAS,
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  mensajeDeError,
} from '../../services/ProductoService';
import { ProductoForm } from './ProductoForm';

// Administración de productos: listar, buscar, crear, editar y eliminar
// Usa la API REST del backend (/api/productos) a través de ProductoService
export const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }

  // Ventana modal para crear o editar un producto
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Pide la lista de productos al backend
  const cargarProductos = () =>
    listarProductos()
      .then((lista) => setProductos(lista))
      .catch((error) =>
        setMensaje({ tipo: 'danger', texto: mensajeDeError(error, 'No se pudieron cargar los productos.') })
      )
      .finally(() => setCargando(false));

  // Al abrir la pantalla, carga los productos
  useEffect(() => {
    listarProductos()
      .then((lista) => setProductos(lista))
      .catch((error) =>
        setMensaje({ tipo: 'danger', texto: mensajeDeError(error, 'No se pudieron cargar los productos.') })
      )
      .finally(() => setCargando(false));
  }, []);

  // Combina las categorías fijas con cualquier categoría extra que venga desde la BD
  const categorias = [...CATEGORIAS];
  productos.forEach((p) => {
    if (p.categoria && !categorias.some((c) => c.id === p.categoria)) {
      categorias.push({ id: p.categoria, nombre: p.categoriaNombre || p.categoria });
    }
  });

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

  // Revisa los datos antes de enviarlos. Devuelve un mensaje de error o null
  const validar = (datos) => {
    const codigo = String(datos.codigo || '').trim().toUpperCase();
    if (!codigo) return 'Debe ingresar el código del producto.';
    if (!String(datos.nombre || '').trim()) return 'Debe ingresar el nombre del producto.';
    if (!datos.categoria) return 'Debe seleccionar una categoría.';
    if (datos.precio === '' || isNaN(Number(datos.precio)) || Number(datos.precio) <= 0) {
      return 'El precio debe ser un número mayor a 0.';
    }
    if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
      return 'El stock debe ser un número entero mayor o igual a 0.';
    }
    const repetido = productos.some(
      (p) => (p.codigo || '').toUpperCase() === codigo && p.id !== productoEditando?.id
    );
    if (repetido) return `Ya existe un producto con el código ${codigo}.`;
    return null;
  };

  // Crea o actualiza en el backend; si hay error lo devuelve para que el formulario lo muestre
  const handleGuardar = async (datos) => {
    const error = validar(datos);
    if (error) return error;

    try {
      const guardado = productoEditando
        ? await actualizarProducto(productoEditando.id, datos)
        : await crearProducto(datos);

      await cargarProductos();
      setMostrarForm(false);
      setMensaje({
        tipo: 'success',
        texto: productoEditando
          ? `Producto "${guardado.nombre}" actualizado.`
          : `Producto "${guardado.nombre}" creado.`,
      });
      return null;
    } catch (err) {
      return mensajeDeError(err, 'No se pudo guardar el producto.');
    }
  };

  const handleEliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;

    try {
      await eliminarProducto(producto.id);
      await cargarProductos();
      setMensaje({ tipo: 'success', texto: `Producto "${producto.nombre}" eliminado.` });
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: mensajeDeError(err, 'No se pudo eliminar el producto.') });
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Productos ({productos.length})</h4>
          <Button variant="primary" onClick={abrirNuevo}>+ Nuevo producto</Button>
        </div>

        <Form.Control
          type="search"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="mb-3"
        />

        {mensaje && (
          <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
            {mensaje.texto}
          </Alert>
        )}

        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoriaNombre || p.categoria}</td>
                <td className="text-end">${Number(p.precio || 0).toLocaleString('es-CL')}</td>
                <td className="text-end">{p.stock}</td>
                <td className="text-end text-nowrap">
                  <Button variant="secondary" size="sm" className="me-2" onClick={() => abrirEditar(p)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(p)}>Eliminar</Button>
                </td>
              </tr>
            ))}
            {!cargando && productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">No se encontraron productos.</td>
              </tr>
            )}
            {cargando && (
              <tr>
                <td colSpan={6} className="text-center text-muted">Cargando productos...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

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
