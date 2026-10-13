import { describe, it, expect, beforeEach } from 'vitest';
import {
  obtenerProductos, obtenerProductoPorId, obtenerProductosPorCategoria,
  crearProducto, actualizarProducto, eliminarProducto
} from '../data/productosDB';
import {
  obtenerPedidos, crearPedido, buscarPedido, obtenerPedidosPorEmail,
  actualizarEstadoPedido, eliminarPedido
} from '../data/pedidosDB';
import {
  registrarUsuario, obtenerUsuarioPorEmail, actualizarUsuario, eliminarUsuario
} from '../data/db';

// Antes de cada prueba se limpia localStorage para partir desde cero
beforeEach(() => localStorage.clear());

describe('CRUD de Productos (productosDB.js)', () => {
  it('Debe cargar los 16 productos iniciales', () => {
    expect(obtenerProductos()).toHaveLength(16);
    expect(obtenerProductoPorId(1).codigo).toBe('TC001');
    expect(obtenerProductosPorCategoria('cuadradas')).toHaveLength(2);
  });

  it('Debe crear un producto con id nuevo', () => {
    const res = crearProducto({ codigo: 'tc003', nombre: 'Torta de Lúcuma', categoria: 'cuadradas', precio: 47000 });

    expect(res.ok).toBe(true);
    expect(res.producto.id).toBe(17);
    expect(res.producto.codigo).toBe('TC003');
    expect(obtenerProductos()).toHaveLength(17);
  });

  it('No debe crear productos con código repetido o precio inválido', () => {
    expect(crearProducto({ codigo: 'TC001', nombre: 'Otra', categoria: 'cuadradas', precio: 1000 }).ok).toBe(false);
    expect(crearProducto({ codigo: 'X01', nombre: 'Otra', categoria: 'cuadradas', precio: 0 }).ok).toBe(false);
    expect(obtenerProductos()).toHaveLength(16);
  });

  it('Debe actualizar el precio de un producto', () => {
    const res = actualizarProducto(1, { precio: 49990 });

    expect(res.ok).toBe(true);
    expect(obtenerProductoPorId(1).precio).toBe(49990);
    expect(obtenerProductoPorId(1).nombre).toBe('Torta Cuadrada de Chocolate');
  });

  it('Debe eliminar un producto', () => {
    expect(eliminarProducto(1).ok).toBe(true);
    expect(obtenerProductoPorId(1)).toBeNull();
    expect(obtenerProductos()).toHaveLength(15);
    expect(eliminarProducto(999).ok).toBe(false);
  });
});

describe('CRUD de Pedidos (pedidosDB.js)', () => {
  const datosPedido = {
    cliente: { nombre: 'Ana Pérez', rut: '12.345.678-5', email: 'ana@gmail.com', telefono: '+56 9 1111 2222', direccion: 'Calle 1' },
    tipoEntrega: 'despacho',
    items: [{ id: 1, nombre: 'Torta Cuadrada de Chocolate', precio: 45000, cantidad: 1 }],
    totalPagar: 47500
  };

  it('Debe crear un pedido con folio, fecha y etapa inicial', () => {
    const res = crearPedido(datosPedido);

    expect(res.ok).toBe(true);
    expect(res.pedido.folio).toBe(4891);
    expect(res.pedido.etapa).toBe(1);
    expect(res.pedido.codigoSeguimiento).toMatch(/^PMS-2026-\d{4}$/);
    expect(crearPedido(datosPedido).pedido.folio).toBe(4892);
  });

  it('No debe crear un pedido sin productos', () => {
    expect(crearPedido({ ...datosPedido, items: [] }).ok).toBe(false);
    expect(obtenerPedidos()).toHaveLength(0);
  });

  it('Debe encontrar el pedido por código o RUT y no inventar uno falso', () => {
    const { pedido } = crearPedido(datosPedido);

    expect(buscarPedido(pedido.codigoSeguimiento.toLowerCase()).folio).toBe(pedido.folio);
    expect(buscarPedido('123456785').folio).toBe(pedido.folio);
    expect(buscarPedido('PMS-0000-0000')).toBeNull();
    expect(obtenerPedidosPorEmail('ANA@gmail.com')).toHaveLength(1);
  });

  it('Debe actualizar la etapa del pedido y eliminarlo', () => {
    const { pedido } = crearPedido(datosPedido);

    expect(actualizarEstadoPedido(pedido.codigoSeguimiento, 3).pedido.etapa).toBe(3);
    expect(actualizarEstadoPedido(pedido.codigoSeguimiento, 9).ok).toBe(false);

    expect(eliminarPedido(pedido.codigoSeguimiento).ok).toBe(true);
    expect(obtenerPedidos()).toHaveLength(0);
  });
});

describe('CRUD de Usuarios (db.js)', () => {
  it('Debe crear, leer, actualizar y eliminar un usuario', () => {
    const creado = registrarUsuario({
      rut: '12.345.678-5', nombre: 'Ana Pérez', email: 'ana@gmail.com',
      password: '1234', fechaNacimiento: '2000-01-01'
    });
    expect(creado.ok).toBe(true);

    expect(obtenerUsuarioPorEmail('ANA@gmail.com').nombre).toBe('Ana Pérez');

    expect(actualizarUsuario('ana@gmail.com', { telefono: '+56 9 3333 4444' }).ok).toBe(true);
    expect(obtenerUsuarioPorEmail('ana@gmail.com').telefono).toBe('+56 9 3333 4444');

    expect(eliminarUsuario('ana@gmail.com').ok).toBe(true);
    expect(obtenerUsuarioPorEmail('ana@gmail.com')).toBeNull();
    expect(eliminarUsuario('ana@gmail.com').ok).toBe(false);
  });
});

describe('Errores corregidos en los archivos de datos', () => {
  const pedido = { items: [{ nombre: 'Torta', precio: 1000, cantidad: 1 }], cliente: {} };

  it('No debe repetir un folio después de eliminar un pedido', () => {
    const primero = crearPedido(pedido).pedido;
    const segundo = crearPedido(pedido).pedido;
    eliminarPedido(primero.codigoSeguimiento);

    const tercero = crearPedido(pedido).pedido;
    expect(tercero.folio).toBe(segundo.folio + 1);
  });

  it('No debe modificar la lista de usuarios demo al registrar uno nuevo', () => {
    registrarUsuario({
      rut: '12.345.678-5', nombre: 'Ana Pérez', email: 'ana@gmail.com',
      password: '1234', fechaNacimiento: '2000-01-01'
    });
    localStorage.clear();

    expect(obtenerUsuarioPorEmail('ana@gmail.com')).toBeNull();
  });

  it('Debe validar los datos al actualizar un usuario', () => {
    expect(actualizarUsuario('magd.zuniga@duocuc.cl', { email: 'f.barra@alumnos.duoc.cl' }).ok).toBe(false);
    expect(actualizarUsuario('magd.zuniga@duocuc.cl', { rut: 'abc' }).ok).toBe(false);
    expect(actualizarUsuario('magd.zuniga@duocuc.cl', { password: '12' }).ok).toBe(false);
    expect(actualizarUsuario(undefined, {}).ok).toBe(false);
    expect(actualizarUsuario('magd.zuniga@duocuc.cl', { telefono: '+56 9 0000 0000' }).ok).toBe(true);
  });
});

describe('Cuentas demo siempre disponibles (storage.js)', () => {
  it('Debe agregar la cuenta del administrador aunque haya una lista vieja guardada', () => {
    // Lista guardada de antes, sin el administrador
    localStorage.setItem('usuarios_mil_sabores', JSON.stringify([
      { rut: '22.163.627-9', nombre: 'Magdalena Zúñiga', email: 'magd.zuniga@duocuc.cl', password: '1234' },
      { rut: '12.345.678-5', nombre: 'Ana Pérez', email: 'ana@gmail.com', password: '1234' }
    ]));

    expect(obtenerUsuarioPorEmail('admin@milsabores.cl')).not.toBeNull();
    expect(obtenerUsuarioPorEmail('ana@gmail.com')).not.toBeNull();
    expect(obtenerUsuarioPorEmail('magd.zuniga@duocuc.cl').nombre).toBe('Magdalena Zúñiga');
  });

  it('No debe volver a agregar una cuenta demo que se eliminó', () => {
    expect(eliminarUsuario('be.montanares@duocuc.cl').ok).toBe(true);
    expect(obtenerUsuarioPorEmail('be.montanares@duocuc.cl')).toBeNull();
  });
});
