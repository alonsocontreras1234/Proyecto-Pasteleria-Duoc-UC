import axios from 'axios';
import {
  crearPedido as crearPedidoLocal,
  obtenerPedidos as obtenerPedidosLocales,
  obtenerPedidoPorCodigo as obtenerPedidoLocalPorCodigo,
  buscarPedido as buscarPedidoLocal,
  actualizarEstadoPedido as actualizarEstadoLocal,
  eliminarPedido as eliminarPedidoLocal,
  ETAPAS_PEDIDO
} from '../data/pedidosDB';

const PEDIDOS_URL = 'http://localhost:8080/api/v1/pedidos';
const DETALLES_URL = 'http://localhost:8080/api/v1/detalle-pedidos';

const ETAPA_A_ESTADO = {
  1: 'PENDIENTE',
  2: 'EN_PREPARACION',
  3: 'LISTO_PARA_ENTREGA',
  4: 'ENTREGADO'
};

const ESTADO_A_ETAPA = {
  PENDIENTE: 1,
  EN_PREPARACION: 2,
  LISTO_PARA_ENTREGA: 3,
  ENTREGADO: 4,
  CANCELADO: 4
};

const NOMBRE_POR_ESTADO = {
  PENDIENTE: ETAPAS_PEDIDO[1],
  EN_PREPARACION: ETAPAS_PEDIDO[2],
  LISTO_PARA_ENTREGA: ETAPAS_PEDIDO[3],
  ENTREGADO: ETAPAS_PEDIDO[4],
  CANCELADO: 'Cancelado'
};

function tieneSesionToken() {
  return Boolean(localStorage.getItem('token_mil_sabores'));
}

function normalizarPedidoBackend(p, detalles = []) {
  const etapa = ESTADO_A_ETAPA[p.estado] || 1;
  const nombreCliente = p.usuario
    ? `${p.usuario.nombre || ''} ${p.usuario.apellido || ''}`.trim()
    : 'Cliente';

  return {
    id: p.id,
    folio: p.id,
    codigoSeguimiento: `PMS-${p.id}`,
    cliente: {
      nombre: nombreCliente || 'Cliente',
      rut: p.usuario?.rut || '-',
      email: p.usuario?.email || '-',
      direccion: p.direccionDespacho || '-'
    },
    tipoEntrega: (p.direccionDespacho || '').toLowerCase().includes('retiro') ? 'retiro' : 'despacho',
    totalPagar: p.total ?? 0,
    descuentoAplicado: p.descuentoAplicado ?? 0,
    fecha: p.fechaPedido || new Date().toISOString(),
    etapa,
    estadoBackend: p.estado,
    estadoNombre: NOMBRE_POR_ESTADO[p.estado] || ETAPAS_PEDIDO[etapa],
    items: detalles.map((d) => ({
      id: d.producto?.id,
      nombre: d.producto?.nombre || 'Producto',
      cantidad: d.cantidad || 1,
      precio: d.precioUnitario ?? d.producto?.precio ?? 0
    }))
  };
}

export async function crearPedidoCompleto(datosPedido, usuarioActual) {
  if (usuarioActual?.id && tieneSesionToken()) {
    try {
      const payloadPedido = {
        usuarioId: usuarioActual.id,
        total: Math.round(datosPedido.totalPagar || 0),
        descuentoAplicado: datosPedido.porcentajeDescuento || 0,
        direccionDespacho:
          datosPedido.tipoEntrega === 'retiro'
            ? 'Retiro en tienda'
            : datosPedido.cliente?.direccion || 'Sin dirección',
        metodoPago: 'WEBPAY'
      };

      const { data: pedidoCreado } = await axios.post(PEDIDOS_URL, payloadPedido);

      for (const item of datosPedido.items || []) {
        if (typeof item.id === 'number') {
          await axios.post(DETALLES_URL, {
            pedidoId: pedidoCreado.id,
            productoId: item.id,
            cantidad: Number(item.cantidad) || 1
          });
        }
      }

      const copiaLocal = crearPedidoLocal({
        ...datosPedido,
        backendId: pedidoCreado.id
      });

      const pedidoFinal = copiaLocal.ok
        ? { ...copiaLocal.pedido, id: pedidoCreado.id }
        : { ...datosPedido, id: pedidoCreado.id, folio: pedidoCreado.id, fecha: new Date().toISOString(), etapa: 1, estadoNombre: ETAPAS_PEDIDO[1] };

      return { ok: true, pedido: pedidoFinal };
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        const msg = error.response?.data?.error;
        if (msg) return { ok: false, error: msg };
      }
    }
  }

  return crearPedidoLocal(datosPedido);
}

export async function obtenerPedidos() {
  if (tieneSesionToken()) {
    try {
      const { data } = await axios.get(PEDIDOS_URL);
      if (Array.isArray(data)) {
        return data.map((p) => normalizarPedidoBackend(p));
      }
    } catch {
      // Respaldo local si el backend está apagado o en pruebas
    }
  }
  return obtenerPedidosLocales();
}

export async function obtenerDetallesPorPedido(pedidoId) {
  if (!pedidoId || !tieneSesionToken()) return [];
  try {
    const { data } = await axios.get(`${DETALLES_URL}/pedido/${pedidoId}`);
    return Array.isArray(data)
      ? data.map((d) => ({
          id: d.producto?.id,
          nombre: d.producto?.nombre || 'Producto',
          cantidad: d.cantidad || 1,
          precio: d.precioUnitario ?? d.producto?.precio ?? 0
        }))
      : [];
  } catch {
    return [];
  }
}

export async function actualizarEstadoPedido(pedido, nuevaEtapa) {
  const etapaNum = Number(nuevaEtapa);
  const estadoBackend = ETAPA_A_ESTADO[etapaNum] || 'PENDIENTE';

  if (pedido?.id && tieneSesionToken()) {
    try {
      const { data } = await axios.patch(`${PEDIDOS_URL}/${pedido.id}/estado`, null, {
        params: { estado: estadoBackend }
      });
      actualizarEstadoLocal(pedido.codigoSeguimiento, etapaNum);
      return { ok: true, pedido: normalizarPedidoBackend(data, pedido.items || []) };
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        return { ok: false, error: error.response?.data?.error || 'No se pudo actualizar el estado' };
      }
    }
  }

  return actualizarEstadoLocal(pedido.codigoSeguimiento, etapaNum);
}

export async function eliminarPedido(pedido) {
  if (pedido?.id && tieneSesionToken()) {
    try {
      await axios.delete(`${PEDIDOS_URL}/${pedido.id}`);
      eliminarPedidoLocal(pedido.codigoSeguimiento);
      return { ok: true };
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        return { ok: false, error: error.response?.data?.error || 'No se pudo eliminar el pedido' };
      }
    }
  }

  return eliminarPedidoLocal(pedido.codigoSeguimiento);
}

export async function buscarPedidoIntegrado(termino) {
  const limpio = (termino || '').trim();
  if (!limpio) return null;

  const local = buscarPedidoLocal(limpio);
  if (local) return local;

  const idNumerico = limpio.replace(/^PMS-/i, '');
  if (/^\d+$/.test(idNumerico) && tieneSesionToken()) {
    try {
      const { data } = await axios.get(`${PEDIDOS_URL}/${idNumerico}`);
      const detalles = await obtenerDetallesPorPedido(data.id);
      return normalizarPedidoBackend(data, detalles);
    } catch {
      return null;
    }
  }

  return null;
}

export { obtenerPedidoLocalPorCodigo, ETAPAS_PEDIDO };
