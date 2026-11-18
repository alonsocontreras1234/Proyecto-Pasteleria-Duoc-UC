import { vi } from 'vitest';
import { productos as PRODUCTOS_LOCALES } from '../data/productos';

// productoAVista llega desde el ProductoService real (ver usar()), para no
// importar aquí el módulo que se está reemplazando con vi.mock
let productoAVista = (p) => p;

/**
 * API de productos falsa para las pruebas.
 * Reemplaza las llamadas al backend (/api/productos) por una lista en memoria
 * con los 16 productos de data/productos.js, así los tests no necesitan Spring Boot.
 */
const productosIniciales = () =>
  PRODUCTOS_LOCALES.map((p) =>
    productoAVista({ ...p, imagenUrl: p.imagen, stock: 20 })
  );

let lista = productosIniciales();

export const apiFalsa = {
  reiniciar: () => {
    lista = productosIniciales();
  },
  obtener: () => lista,
  listarProductos: vi.fn(async () => lista.map((p) => ({ ...p }))),
  crearProducto: vi.fn(async (datos) => {
    const nuevo = productoAVista({
      ...datos,
      id: Math.max(0, ...lista.map((p) => p.id)) + 1,
      codigo: String(datos.codigo).trim().toUpperCase(),
      imagenUrl: datos.imagen,
    });
    lista = [...lista, nuevo];
    return nuevo;
  }),
  actualizarProducto: vi.fn(async (id, datos) => {
    const actualizado = productoAVista({
      ...datos,
      id,
      codigo: String(datos.codigo).trim().toUpperCase(),
      imagenUrl: datos.imagen,
    });
    lista = lista.map((p) => (p.id === id ? actualizado : p));
    return actualizado;
  }),
  eliminarProducto: vi.fn(async (id) => {
    lista = lista.filter((p) => p.id !== id);
  }),
};

// Se llama desde vi.mock con el módulo real; devuelve las funciones que reemplazan a las de la API
export const usar = (moduloReal) => {
  productoAVista = moduloReal.productoAVista;
  apiFalsa.reiniciar();
  return funcionesFalsas;
};

const funcionesFalsas = {
  listarProductos: (...a) => apiFalsa.listarProductos(...a),
  obtenerProductos: (...a) => apiFalsa.listarProductos(...a),
  crearProducto: (...a) => apiFalsa.crearProducto(...a),
  actualizarProducto: (...a) => apiFalsa.actualizarProducto(...a),
  eliminarProducto: (...a) => apiFalsa.eliminarProducto(...a),
};
