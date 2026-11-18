import { describe, it, expect, vi, beforeEach } from 'vitest';
import http from '../services/http';
import {
  listarPedidos,
  cambiarEstado,
  buscarPedidoEnBackend,
  crearPedidoCompleto,
  crearPedidoDesdeCarrito,
  pedidoAVista,
} from '../services/PedidoService';

vi.mock('../services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('PedidoService - conexión con la API de pedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debe listar los pedidos desde GET /api/pedidos', async () => {
    http.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

    const resultado = await listarPedidos();

    expect(http.get).toHaveBeenCalledWith('/api/pedidos');
    expect(resultado).toEqual([{ id: 1 }]);
  });

  it('Debe cambiar el estado con PATCH enviando el estado como query param', async () => {
    http.patch.mockResolvedValueOnce({ data: { id: 1, estado: 'ENTREGADO' } });

    await cambiarEstado(1, 'ENTREGADO');

    expect(http.patch).toHaveBeenCalledWith(
      '/api/pedidos/1/estado',
      null,
      { params: { estado: 'ENTREGADO' } }
    );
  });

  it('Debe adaptar la respuesta del backend al formato de las pantallas', () => {
    const vista = pedidoAVista(
      {
        id: 7,
        estado: 'LISTO_PARA_ENTREGA',
        total: 40500,
        descuentoAplicado: 10,
        direccionDespacho: 'Av. Providencia 1234',
        metodoPago: 'EFECTIVO',
        fechaPedido: '2026-11-16T10:00:00',
        usuario: {
          nombre: 'Marta',
          apellido: 'González',
          rut: '15.345.678-5',
          email: 'marta@correo.cl',
        },
      },
      [
        {
          producto: { nombre: 'Torta Mil Hojas Manjar' },
          dedicatoria: 'Feliz cumpleaños',
          cantidad: 2,
          precioUnitario: 22500,
          subtotal: 45000,
        },
      ]
    );

    expect(vista.codigoSeguimiento).toBe('PED-0007');
    expect(vista.etapa).toBe(3);
    expect(vista.cliente.nombre).toBe('Marta González');
    expect(vista.totalPagar).toBe(40500);
    expect(vista.items[0]).toEqual({
      nombre: 'Torta Mil Hojas Manjar',
      dedicatoria: 'Feliz cumpleaños',
      cantidad: 2,
      precio: 22500,
      subtotal: 45000,
    });
  });

  it('Debe buscar un pedido por ID numérico o por código PED-0007', async () => {
    http.get
      .mockResolvedValueOnce({ data: { id: 7 } })
      .mockResolvedValueOnce({ data: [] });

    const resultado = await buscarPedidoEnBackend('PED-0007');

    expect(http.get).toHaveBeenNthCalledWith(1, '/api/pedidos/7');
    expect(resultado.codigoSeguimiento).toBe('PED-0007');
  });

  it('No debe consultar el backend si el texto no es un ID', async () => {
    const resultado = await buscarPedidoEnBackend('PMS-2026-1234');

    expect(resultado).toBeNull();
    expect(http.get).not.toHaveBeenCalled();
  });

  it('No debe crear la cabecera si un producto no existe en el backend', async () => {
    await expect(
      crearPedidoCompleto({
        usuarioId: 1,
        carrito: [{ cantidad: 1 }],
        direccionDespacho: 'Av. Providencia 1234',
        metodoPago: 'EFECTIVO',
        resolverProductoId: () => null,
      })
    ).rejects.toThrow(/no existen en el catálogo/);

    expect(http.post).not.toHaveBeenCalled();
  });

  it('Debe crear el pedido del checkout resolviendo productos por nombre', async () => {
    // 1) catálogo, 2) pedido creado, 3) detalles finales
    http.get
      .mockResolvedValueOnce({
        data: [
          { id: 5, nombre: 'Torta Cuadrada de Chocolate' },
          { id: 9, nombre: 'Empanada de Manzana' },
        ],
      })
      .mockResolvedValueOnce({ data: { id: 21, estado: 'PENDIENTE', total: 93000 } })
      .mockResolvedValueOnce({ data: [] });

    http.post
      .mockResolvedValueOnce({ data: { id: 21 } }) // cabecera
      .mockResolvedValueOnce({ data: [{ id: 100 }, { id: 101 }] }); // lote de líneas

    const resultado = await crearPedidoDesdeCarrito({
      usuarioId: 2,
      carrito: [
        { nombre: 'torta cuadrada de chocolate', cantidad: 2, dedicatoria: 'Feliz cumpleaños' },
        { nombre: 'EMPANADA DE MANZANA', cantidad: 1 },
      ],
      direccionDespacho: 'Av. Providencia 1234',
      metodoPago: 'EFECTIVO',
      descuentoAplicado: 10,
    });

    expect(http.get).toHaveBeenNthCalledWith(1, '/api/productos');
    expect(http.post).toHaveBeenNthCalledWith(
      1,
      '/api/pedidos',
      expect.objectContaining({ usuarioId: 2, descuentoAplicado: 10, metodoPago: 'EFECTIVO' })
    );
    // Todo el carrito va en una sola llamada a /lote, con la dedicatoria de cada línea
    expect(http.post).toHaveBeenNthCalledWith(2, '/api/detalle-pedidos/lote', [
      { pedidoId: 21, productoId: 5, cantidad: 2, dedicatoria: 'Feliz cumpleaños' },
      { pedidoId: 21, productoId: 9, cantidad: 1, dedicatoria: null },
    ]);
    expect(http.post).toHaveBeenCalledTimes(2);
    expect(resultado.codigoSeguimiento).toBe('PED-0021');
  });

  it('Debe avisar qué productos del carrito faltan en el catálogo del backend', async () => {
    http.get.mockResolvedValueOnce({
      data: [{ id: 1, nombre: 'Torta Mil Hojas Manjar' }],
    });

    await expect(
      crearPedidoDesdeCarrito({
        usuarioId: 2,
        carrito: [{ nombre: 'Torta Cuadrada de Chocolate', cantidad: 1 }],
        direccionDespacho: 'Av. Providencia 1234',
        metodoPago: 'EFECTIVO',
      })
    ).rejects.toThrow(/Torta Cuadrada de Chocolate/);

    expect(http.post).not.toHaveBeenCalled();
  });

  it('Debe priorizar el código del producto sobre el nombre', async () => {
    http.get
      .mockResolvedValueOnce({
        data: [
          { id: 5, codigo: 'TC001', nombre: 'Torta Cuadrada de Chocolate', stock: 10 },
          { id: 8, codigo: 'TC009', nombre: 'Torta Cuadrada de Chocolate', stock: 10 },
        ],
      })
      .mockResolvedValueOnce({ data: { id: 30, estado: 'PENDIENTE', total: 45000 } })
      .mockResolvedValueOnce({ data: [] });

    http.post
      .mockResolvedValueOnce({ data: { id: 30 } })
      .mockResolvedValueOnce({ data: [{ id: 200 }] });

    await crearPedidoDesdeCarrito({
      usuarioId: 2,
      carrito: [{ codigo: 'tc001', nombre: 'otro nombre', cantidad: 1 }],
      direccionDespacho: 'Av. Providencia 1234',
      metodoPago: 'EFECTIVO',
    });

    expect(http.post).toHaveBeenNthCalledWith(2, '/api/detalle-pedidos/lote', [
      { pedidoId: 30, productoId: 5, cantidad: 1, dedicatoria: null },
    ]);
  });

  it('No debe crear el pedido si un producto no tiene stock suficiente', async () => {
    http.get.mockResolvedValueOnce({
      data: [{ id: 5, codigo: 'TC001', nombre: 'Torta Cuadrada de Chocolate', stock: 1 }],
    });

    await expect(
      crearPedidoDesdeCarrito({
        usuarioId: 2,
        carrito: [{ codigo: 'TC001', nombre: 'Torta Cuadrada de Chocolate', cantidad: 2 }],
        direccionDespacho: 'Av. Providencia 1234',
        metodoPago: 'EFECTIVO',
      })
    ).rejects.toThrow(/Sin stock/);

    expect(http.post).not.toHaveBeenCalled();
  });

  it('Debe borrar la cabecera si el lote falla (por ejemplo, sin stock en el servidor)', async () => {
    http.get.mockResolvedValueOnce({
      data: [{ id: 5, codigo: 'TC001', nombre: 'Torta Cuadrada de Chocolate', stock: 10 }],
    });
    http.post
      .mockResolvedValueOnce({ data: { id: 40 } })
      .mockRejectedValueOnce({ response: { status: 409, data: { error: 'Stock insuficiente' } } });
    http.delete.mockResolvedValueOnce({});

    await expect(
      crearPedidoDesdeCarrito({
        usuarioId: 2,
        carrito: [{ codigo: 'TC001', nombre: 'Torta Cuadrada de Chocolate', cantidad: 1 }],
        direccionDespacho: 'Av. Providencia 1234',
        metodoPago: 'EFECTIVO',
      })
    ).rejects.toMatchObject({ response: { status: 409 } });

    expect(http.delete).toHaveBeenCalledWith('/api/pedidos/40');
  });
});
