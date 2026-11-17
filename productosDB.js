//Base de datos simulada de PRODUCTOS (CRUD) usando localStorage
//Pastelería Mil Sabores
//
//- La primera vez carga los 16 productos de data/productos.js
//- Desde ahí, todo se lee y se guarda en localStorage ("productos_mil_sabores")
import { productos as PRODUCTOS_INICIALES } from './productos';
import { leerLista, guardarLista } from '../utils/storage';

const STORAGE_KEY = 'productos_mil_sabores';

//Guarda la lista completa de productos en localStorage
const guardarProductos = (productos) => guardarLista(STORAGE_KEY, productos);

//Revisa que los datos de un producto estén completos y correctos
//Devuelve un mensaje de error, o null si todo está bien
const validarProducto = ({ codigo, nombre, categoria, precio }) => {
  if (!codigo || !codigo.trim()) return 'Debe ingresar el código del producto.';
  if (!nombre || !nombre.trim()) return 'Debe ingresar el nombre del producto.';
  if (!categoria || !categoria.trim()) return 'Debe seleccionar una categoría.';
  if (precio === undefined || precio === '' || isNaN(Number(precio)) || Number(precio) <= 0) {
    return 'El precio debe ser un número mayor a 0.';
  }
  return null;
};

// Revisa si otro producto (distinto al de la posición "indiceIgnorado") ya usa ese código
const codigoOcupado = (productos, codigo, indiceIgnorado = -1) =>
  productos.some((p, i) => i !== indiceIgnorado && p.codigo.toUpperCase() === codigo);

//=====================================================================
//READ (Leer)
//=====================================================================

//Devuelve todos los productos (la primera vez, carga los iniciales)
export const obtenerProductos = () => leerLista(STORAGE_KEY, PRODUCTOS_INICIALES);

//Busca un producto por su id. Devuelve el producto o null
export const obtenerProductoPorId = (id) => {
  return obtenerProductos().find((p) => p.id === Number(id)) || null;
};

//Devuelve los productos de una categoría (ej: "cuadradas")
export const obtenerProductosPorCategoria = (categoria) => {
  return obtenerProductos().filter((p) => p.categoria === categoria);
};

//=====================================================================
//CREATE (Crear)
//=====================================================================

//Agrega un producto nuevo. El id se genera solo (el mayor + 1)
export const crearProducto = (datos) => {
  const error = validarProducto(datos);
  if (error) return { ok: false, error };

  const productos = obtenerProductos();
  const codigo = datos.codigo.trim().toUpperCase();

  // No permitir dos productos con el mismo código
  if (codigoOcupado(productos, codigo)) {
    return { ok: false, error: `Ya existe un producto con el código ${codigo}.` };
  }

  const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;

  const nuevoProducto = {
    id: nuevoId,
    codigo,
    categoria: datos.categoria.trim(),
    categoriaNombre: datos.categoriaNombre || datos.categoria.trim(),
    nombre: datos.nombre.trim(),
    precio: Number(datos.precio),
    descripcion: datos.descripcion ? datos.descripcion.trim() : '',
    imagen: datos.imagen || ''
  };

  productos.push(nuevoProducto);
  if (!guardarProductos(productos)) {
    return { ok: false, error: 'No se pudo guardar el producto. Intente nuevamente.' };
  }

  return { ok: true, producto: nuevoProducto };
};

//=====================================================================
//UPDATE (Actualizar)
//=====================================================================

//Cambia los datos de un producto existente (solo los campos que se envían)
export const actualizarProducto = (id, cambios) => {
  const productos = obtenerProductos();
  const indice = productos.findIndex((p) => p.id === Number(id));

  if (indice === -1) {
    return { ok: false, error: 'Producto no encontrado.' };
  }

  const actualizado = { ...productos[indice], ...cambios, id: productos[indice].id };

  const error = validarProducto(actualizado);
  if (error) return { ok: false, error };

  // Si cambia el código, revisar que no lo tenga otro producto
  actualizado.codigo = actualizado.codigo.trim().toUpperCase();
  if (codigoOcupado(productos, actualizado.codigo, indice)) {
    return { ok: false, error: `Ya existe un producto con el código ${actualizado.codigo}.` };
  }

  actualizado.precio = Number(actualizado.precio);
  productos[indice] = actualizado;
  guardarProductos(productos);

  return { ok: true, producto: actualizado };
};

//=====================================================================
//DELETE (Eliminar)
//=====================================================================

//Elimina un producto por su id
export const eliminarProducto = (id) => {
  const productos = obtenerProductos();
  const restantes = productos.filter((p) => p.id !== Number(id));

  if (restantes.length === productos.length) {
    return { ok: false, error: 'Producto no encontrado.' };
  }

  guardarProductos(restantes);
  return { ok: true };
};

//Vuelve a dejar los 16 productos originales (útil para pruebas)
export const reiniciarProductos = () => {
  guardarProductos(PRODUCTOS_INICIALES);
};
