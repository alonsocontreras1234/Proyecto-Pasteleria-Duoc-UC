import http from './http';
import { productos as PRODUCTOS_LOCALES } from '../data/productos';

/**
 * Servicio de comunicación con la API de Productos del backend Spring Boot.
 * Endpoints utilizados:
 *   GET    /api/productos
 *   POST   /api/productos       (solo administrador)
 *   PUT    /api/productos/{id}  (solo administrador)
 *   DELETE /api/productos/{id}  (solo administrador)
 */

const PRODUCTOS = '/api/productos';

// Nombre visible de cada categoría. En la base de datos se guarda el id (ej: "cuadradas").
export const CATEGORIAS = [
  { id: 'cuadradas', nombre: 'Tortas Cuadradas' },
  { id: 'circulares', nombre: 'Tortas Circulares' },
  { id: 'postres', nombre: 'Postres' },
  { id: 'sin-azucar', nombre: 'Sin Azúcar' },
  { id: 'tradicional', nombre: 'Tradicional' },
  { id: 'sin-gluten', nombre: 'Sin Gluten' },
  { id: 'vegana', nombre: 'Veganas' },
  { id: 'especiales', nombre: 'Especiales' },
];

const nombreCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre || id || '';

// Busca el mismo producto en data/productos.js para reutilizar su imagen y receta
const productoLocal = (codigo) =>
  PRODUCTOS_LOCALES.find(
    (p) => p.codigo.toUpperCase() === String(codigo || '').toUpperCase()
  );

/**
 * Convierte un producto del backend al formato que usan las pantallas.
 * Backend: { id, codigo, nombre, descripcion, precio, stock, categoria, imagenUrl }
 */
export const productoAVista = (producto) => {
  const local = productoLocal(producto?.codigo);
  return {
    id: producto?.id,
    codigo: producto?.codigo || '',
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: Number(producto?.precio) || 0,
    stock: Number(producto?.stock) || 0,
    categoria: producto?.categoria || '',
    categoriaNombre: nombreCategoria(producto?.categoria),
    imagen: producto?.imagenUrl || local?.imagen || '',
    receta: local?.receta,
  };
};

/**
 * Convierte los datos del formulario al formato que espera el backend.
 */
export const vistaAProducto = (datos) => ({
  codigo: String(datos.codigo || '').trim().toUpperCase(),
  nombre: String(datos.nombre || '').trim(),
  descripcion: String(datos.descripcion || '').trim(),
  precio: Number(datos.precio),
  stock: Number(datos.stock),
  categoria: datos.categoria,
  imagenUrl: String(datos.imagen || '').trim(),
});

// Saca el mensaje de error que envía el backend (texto plano o { error })
export const mensajeDeError = (error, porDefecto) => {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.error) return data.error;
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return 'No tienes permiso para esta acción. Inicia sesión como administrador.';
  }
  if (!error?.response) {
    return 'No se pudo conectar con el backend. Verifica que Spring Boot esté corriendo.';
  }
  return porDefecto;
};

// ---------------------------------------------------------------------------
// Llamadas a la API
// ---------------------------------------------------------------------------

export const listarProductos = async () =>
  (await http.get(PRODUCTOS)).data.map(productoAVista);

export const crearProducto = async (datos) =>
  productoAVista((await http.post(PRODUCTOS, vistaAProducto(datos))).data);

export const actualizarProducto = async (id, datos) =>
  productoAVista((await http.put(`${PRODUCTOS}/${id}`, vistaAProducto(datos))).data);

export const eliminarProducto = async (id) => {
  await http.delete(`${PRODUCTOS}/${id}`);
};
