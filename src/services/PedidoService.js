import http from './http';

/**
 * Servicio de comunicación con la API de Pedidos del backend Spring Boot.
 * Endpoints utilizados:
 *   GET    /api/pedidos
 *   GET    /api/pedidos/{id}
 *   GET    /api/pedidos/usuario/{usuarioId}
 *   POST   /api/pedidos
 *   PATCH  /api/pedidos/{id}/estado?estado=...
 *   DELETE /api/pedidos/{id}
 *   POST   /api/detalle-pedidos/lote   (todo el carrito en una sola llamada)
 *   GET    /api/detalle-pedidos/pedido/{pedidoId}
 */

const PEDIDOS = '/api/pedidos';
const DETALLES = '/api/detalle-pedidos';

/**
 * Equivalencia entre los estados del backend y las 4 etapas del frontend.
 * "CANCELADO" se considera una etapa final para que no aparezca como pedido en camino.
 */
export const ESTADOS = {
  PENDIENTE: { etiqueta: 'Recibido 📝', etapa: 1 },
  EN_PREPARACION: { etiqueta: 'En Preparación 👨‍🍳', etapa: 2 },
  LISTO_PARA_ENTREGA: { etiqueta: 'En Camino 🚚', etapa: 3 },
  ENTREGADO: { etiqueta: 'Entregado 🎁', etapa: 4 },
  CANCELADO: { etiqueta: 'Cancelado ❌', etapa: 4 },
};

export const ETAPA_POR_ESTADO = Object.fromEntries(
  Object.entries(ESTADOS).map(([estado, meta]) => [estado, meta.etapa])
);

export const ESTADO_POR_ETAPA = {
  1: 'PENDIENTE',
  2: 'EN_PREPARACION',
  3: 'LISTO_PARA_ENTREGA',
  4: 'ENTREGADO',
};

// ---------------------------------------------------------------------------
// Llamadas a la API
// ---------------------------------------------------------------------------

export const listarPedidos = async () => (await http.get(PEDIDOS)).data;

export const obtenerPedido = async (id) => (await http.get(`${PEDIDOS}/${id}`)).data;

export const listarPedidosPorUsuario = async (usuarioId) =>
  (await http.get(`${PEDIDOS}/usuario/${usuarioId}`)).data;

export const crearPedido = async (datos) => (await http.post(PEDIDOS, datos)).data;

export const cambiarEstado = async (id, estado) =>
  (await http.patch(`${PEDIDOS}/${id}/estado`, null, { params: { estado } })).data;

export const eliminarPedido = async (id) => {
  await http.delete(`${PEDIDOS}/${id}`);
};

export const agregarDetalle = async ({ pedidoId, productoId, cantidad, dedicatoria }) =>
  (await http.post(DETALLES, { pedidoId, productoId, cantidad, dedicatoria })).data;

/**
 * Agrega todas las líneas del carrito de una vez.
 * El backend lo hace en una transacción: si una línea falla (por ejemplo,
 * sin stock), no se guarda ninguna y el stock queda como estaba.
 */
export const agregarDetallesEnLote = async (lineas) =>
  (await http.post(`${DETALLES}/lote`, lineas)).data;

export const listarDetalles = async (pedidoId) =>
  (await http.get(`${DETALLES}/pedido/${pedidoId}`)).data;

// ---------------------------------------------------------------------------
// Adaptadores: convierten la respuesta del backend al formato que usan
// las pantallas del frontend (boleta, seguimiento, perfil y panel admin).
// ---------------------------------------------------------------------------

export const pedidoAVista = (pedido, detalles = []) => {
  const estado = pedido?.estado || 'PENDIENTE';
  const meta = ESTADOS[estado] || { etiqueta: estado, etapa: 1 };
  const usuario = pedido?.usuario || {};
  const nombreCliente = [usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || 'Cliente';

  return {
    backend: true,
    id: pedido?.id,
    codigoSeguimiento: `PED-${String(pedido?.id ?? 0).padStart(4, '0')}`,
    folio: pedido?.id,
    cliente: {
      nombre: nombreCliente,
      rut: usuario.rut || '',
      email: usuario.email || '',
      direccion: pedido?.direccionDespacho || '',
    },
    fecha: pedido?.fechaPedido,
    estado,
    estadoNombre: meta.etiqueta,
    etapa: meta.etapa,
    totalPagar: Number(pedido?.total) || 0,
    descuentoAplicado: Number(pedido?.descuentoAplicado) || 0,
    metodoPago: pedido?.metodoPago || '',
    direccionDespacho: pedido?.direccionDespacho || '',
    items: (detalles || []).map((detalle) => ({
      nombre: detalle?.producto?.nombre || 'Producto',
      dedicatoria: detalle?.dedicatoria || '',
      cantidad: detalle?.cantidad || 0,
      precio: Number(detalle?.precioUnitario) || 0,
      subtotal: Number(detalle?.subtotal) || 0,
    })),
  };
};

/**
 * Trae un pedido con sus líneas de detalle ya adaptadas para la interfaz.
 */
export const obtenerPedidoConDetalles = async (id) => {
  const [pedido, detalles] = await Promise.all([obtenerPedido(id), listarDetalles(id)]);
  return pedidoAVista(pedido, detalles);
};

/**
 * Trae todos los pedidos con sus líneas de detalle.
 * El backend no devuelve los detalles dentro del pedido, por eso se consultan aparte.
 */
export const listarPedidosConDetalles = async () => {
  const pedidos = await listarPedidos();
  const detalles = await Promise.all(
    pedidos.map((pedido) => listarDetalles(pedido.id).catch(() => []))
  );
  return pedidos.map((pedido, indice) => pedidoAVista(pedido, detalles[indice]));
};

/**
 * Trae los pedidos de un usuario con sus líneas de detalle.
 */
export const listarPedidosDeUsuarioConDetalles = async (usuarioId) => {
  const pedidos = await listarPedidosPorUsuario(usuarioId);
  const detalles = await Promise.all(
    pedidos.map((pedido) => listarDetalles(pedido.id).catch(() => []))
  );
  return pedidos.map((pedido, indice) => pedidoAVista(pedido, detalles[indice]));
};

/**
 * Busca un pedido en el backend usando su ID numérico o el código PED-0001.
 * Devuelve null si el texto no tiene formato de ID.
 */
export const buscarPedidoEnBackend = async (texto) => {
  const coincidencia = String(texto || '').trim().match(/^(?:PED-)?(\d+)$/i);
  if (!coincidencia) return null;
  return obtenerPedidoConDetalles(Number(coincidencia[1]));
};

// ---------------------------------------------------------------------------
// Catálogo del backend: permite traducir los productos del frontend
// (src/data/productos.js) a los IDs reales de la base de datos.
// ---------------------------------------------------------------------------

const PRODUCTOS = '/api/productos';

// Normaliza el nombre para comparar sin importar mayúsculas ni espacios extra
const normalizarNombre = (nombre) =>
  String(nombre || '').trim().toLowerCase().replace(/\s+/g, ' ');

// Normaliza el código del producto (TC001, pt001, ...)
const normalizarCodigo = (codigo) => String(codigo || '').trim().toUpperCase();

export const listarProductos = async () => (await http.get(PRODUCTOS)).data;

/**
 * Crea un índice de productos del backend.
 *
 * El backend integrado expone el campo "codigo", que coincide con
 * src/data/productos.js, por lo que se usa como clave principal. El nombre
 * queda como respaldo para catálogos antiguos que no lo tuvieran.
 */
export const indexarProductos = (productos) => {
  const indice = new Map();
  (productos || []).forEach((producto) => {
    if (producto?.codigo) {
      indice.set(`codigo:${normalizarCodigo(producto.codigo)}`, producto);
    }
  });
  (productos || []).forEach((producto) => {
    indice.set(`nombre:${normalizarNombre(producto?.nombre)}`, producto);
  });
  return indice;
};

/**
 * Devuelve el producto del backend que corresponde a un ítem del carrito.
 * Primero compara por código y, si no lo encuentra, por nombre.
 */
export const buscarProductoEnIndice = (indice, item) => {
  const porCodigo = item?.codigo
    ? indice.get(`codigo:${normalizarCodigo(item.codigo)}`)
    : null;
  if (porCodigo) return porCodigo;
  return indice.get(`nombre:${normalizarNombre(item?.nombre)}`) || null;
};

/**
 * Crea un pedido completo (cabecera + líneas) en el backend.
 *
 * Se resuelven todos los productoId antes de crear la cabecera para no dejar
 * pedidos huérfanos si algún producto no existe en la base de datos.
 */
export const crearPedidoCompleto = async ({
  usuarioId,
  carrito,
  direccionDespacho,
  metodoPago,
  descuentoAplicado = 0,
  resolverProductoId,
}) => {
  const lineas = (carrito || []).map((item) => ({
    productoId: resolverProductoId ? resolverProductoId(item) : item.productoId,
    cantidad: Number(item.cantidad) || 1,
    dedicatoria: item.dedicatoria ? String(item.dedicatoria).trim() : null,
  }));

  if (lineas.length === 0) {
    throw new Error('El pedido no tiene productos.');
  }

  if (lineas.some((linea) => !linea.productoId)) {
    throw new Error('Hay productos del carrito que no existen en el catálogo del backend.');
  }

  const pedido = await crearPedido({
    usuarioId,
    total: 0,
    descuentoAplicado,
    direccionDespacho,
    metodoPago,
  });

  try {
    await agregarDetallesEnLote(lineas.map((linea) => ({ pedidoId: pedido.id, ...linea })));
  } catch (error) {
    // El lote no guarda ninguna línea si una falla; se elimina también la cabecera creada.
    await eliminarPedido(pedido.id).catch(() => {});
    throw error;
  }

  return obtenerPedidoConDetalles(pedido.id);
};

/**
 * Crea un pedido desde el carrito del frontend resolviendo los productoId
 * por código (o nombre como respaldo) contra el catálogo real del backend.
 */
export const crearPedidoDesdeCarrito = async ({
  usuarioId,
  carrito,
  direccionDespacho,
  metodoPago,
  descuentoAplicado = 0,
}) => {
  const productos = await listarProductos();
  const indice = indexarProductos(productos);

  const faltantes = (carrito || [])
    .filter((item) => !buscarProductoEnIndice(indice, item))
    .map((item) => item?.nombre || 'Producto sin nombre');

  if (faltantes.length > 0) {
    throw new Error(
      `Estos productos no están en el catálogo del backend: ${faltantes.join(', ')}.`
    );
  }

  const sinStock = (carrito || []).filter((item) => {
    const producto = buscarProductoEnIndice(indice, item);
    const stock = Number(producto?.stock);
    const cantidad = Number(item?.cantidad) || 1;
    return Number.isFinite(stock) && stock < cantidad;
  });

  if (sinStock.length > 0) {
    throw new Error(
      `Sin stock suficiente para: ${sinStock
        .map((item) => `${item?.nombre || 'Producto'} (disponible: ${
          buscarProductoEnIndice(indice, item)?.stock ?? 0
        })`)
        .join(', ')}.`
    );
  }

  return crearPedidoCompleto({
    usuarioId,
    carrito,
    direccionDespacho,
    metodoPago,
    descuentoAplicado,
    resolverProductoId: (item) => buscarProductoEnIndice(indice, item)?.id,
  });
};
