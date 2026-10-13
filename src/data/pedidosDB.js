//Base de datos simulada de PEDIDOS (CRUD) usando localStorage
//Pastelería Mil Sabores
//
//Cada compra confirmada en el checkout se guarda aquí ("pedidos_mil_sabores").
//La usan: la boleta, el seguimiento y el historial de Mi Perfil.
import { normalizarEmail, limpiarRut, leerLista, guardarLista } from '../utils/storage';

const STORAGE_KEY = 'pedidos_mil_sabores';
const FOLIO_INICIAL = 4891;

// Etapas del seguimiento (las mismas 4 que muestra Seguimiento.jsx)
export const ETAPAS_PEDIDO = {
  1: 'Recibido 📝',
  2: 'En Preparación 👨‍🍳',
  3: 'En Camino 🚚',
  4: 'Entregado 🎁'
};

// Deja el código de seguimiento en mayúsculas y sin espacios
const limpiarCodigo = (codigo) => (codigo || '').trim().toUpperCase();

//Guarda la lista completa de pedidos en localStorage
const guardarPedidos = (pedidos) => guardarLista(STORAGE_KEY, pedidos);

//Genera un código de seguimiento que no esté repetido (PMS-2026-XXXX)
const generarCodigo = (pedidos) => {
  let codigo;
  do {
    codigo = `PMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (pedidos.some((p) => p.codigoSeguimiento === codigo));
  return codigo;
};

//Calcula el siguiente folio: el más alto + 1
//(así no se repite aunque se haya eliminado algún pedido)
const siguienteFolio = (pedidos) => {
  if (pedidos.length === 0) return FOLIO_INICIAL;
  return Math.max(...pedidos.map((p) => p.folio || 0)) + 1;
};

//=====================================================================
//READ (Leer)
//=====================================================================

//Devuelve todos los pedidos (del más nuevo al más antiguo)
export const obtenerPedidos = () => leerLista(STORAGE_KEY);

//Busca un pedido por su código de seguimiento. Devuelve el pedido o null
export const obtenerPedidoPorCodigo = (codigo) => {
  const codigoLimpio = limpiarCodigo(codigo);
  return obtenerPedidos().find((p) => p.codigoSeguimiento === codigoLimpio) || null;
};

//Busca un pedido por código de seguimiento o por RUT del cliente
//(lo usa el buscador de Seguimiento). Devuelve el pedido o null
export const buscarPedido = (texto) => {
  if (!texto || !texto.trim()) return null;

  const pedidos = obtenerPedidos();

  const porCodigo = pedidos.find((p) => p.codigoSeguimiento === limpiarCodigo(texto));
  if (porCodigo) return porCodigo;

  const rut = limpiarRut(texto);
  if (rut.length < 7) return null;
  return pedidos.find((p) => limpiarRut(p.cliente?.rut) === rut) || null;
};

//Devuelve los pedidos de un cliente según su correo (para Mi Perfil)
export const obtenerPedidosPorEmail = (email) => {
  const emailLimpio = normalizarEmail(email);
  if (!emailLimpio) return [];
  return obtenerPedidos().filter((p) => normalizarEmail(p.cliente?.email) === emailLimpio);
};

//=====================================================================
//CREATE (Crear)
//=====================================================================

//Guarda un pedido nuevo con su folio, fecha y etapa inicial
//Recibe los datos que arma Checkout.jsx y devuelve el pedido guardado
export const crearPedido = (datos) => {
  if (!datos || !datos.items || datos.items.length === 0) {
    return { ok: false, error: 'El pedido no tiene productos.' };
  }

  const pedidos = obtenerPedidos();

  // Usar el código que viene del checkout si no está repetido
  const codigoRecibido = limpiarCodigo(datos.codigoSeguimiento);
  const codigoLibre = codigoRecibido && !pedidos.some((p) => p.codigoSeguimiento === codigoRecibido);

  const nuevoPedido = {
    ...datos,
    codigoSeguimiento: codigoLibre ? codigoRecibido : generarCodigo(pedidos),
    folio: siguienteFolio(pedidos),
    fecha: new Date().toISOString(),
    etapa: 1,
    estadoNombre: ETAPAS_PEDIDO[1]
  };

  pedidos.unshift(nuevoPedido);
  if (!guardarPedidos(pedidos)) {
    return { ok: false, error: 'No se pudo guardar el pedido. Intente nuevamente.' };
  }

  return { ok: true, pedido: nuevoPedido };
};

//=====================================================================
//UPDATE (Actualizar)
//=====================================================================

//Cambia la etapa de un pedido (1 Recibido → 4 Entregado)
export const actualizarEstadoPedido = (codigo, etapa) => {
  const numEtapa = Number(etapa);
  if (!ETAPAS_PEDIDO[numEtapa]) {
    return { ok: false, error: 'La etapa debe ser un número entre 1 y 4.' };
  }

  const pedidos = obtenerPedidos();
  const indice = pedidos.findIndex((p) => p.codigoSeguimiento === limpiarCodigo(codigo));

  if (indice === -1) {
    return { ok: false, error: 'Pedido no encontrado.' };
  }

  pedidos[indice] = { ...pedidos[indice], etapa: numEtapa, estadoNombre: ETAPAS_PEDIDO[numEtapa] };
  guardarPedidos(pedidos);

  return { ok: true, pedido: pedidos[indice] };
};

//=====================================================================
//DELETE (Eliminar)
//=====================================================================

//Elimina un pedido por su código de seguimiento
export const eliminarPedido = (codigo) => {
  const pedidos = obtenerPedidos();
  const restantes = pedidos.filter((p) => p.codigoSeguimiento !== limpiarCodigo(codigo));

  if (restantes.length === pedidos.length) {
    return { ok: false, error: 'Pedido no encontrado.' };
  }

  guardarPedidos(restantes);
  return { ok: true };
};
