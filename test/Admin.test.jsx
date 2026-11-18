import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminProductos } from '../components/admin/AdminProductos';
import { AdminOrdenes } from '../components/admin/AdminOrdenes';
import { AdminUsuarios } from '../components/admin/AdminUsuarios';
import { apiFalsa } from './apiProductosFalsa';
import { listarPedidosConDetalles, cambiarEstado } from '../services/PedidoService';

// Productos: se usa una API falsa en memoria en vez del backend real
vi.mock('../services/ProductoService', async (importOriginal) => {
  const real = await importOriginal();
  const { usar } = await import('./apiProductosFalsa');
  return { ...real, ...usar(real) };
});

vi.mock('../services/PedidoService', () => ({
  ESTADOS: {
    PENDIENTE: { etiqueta: 'Recibido 📝', etapa: 1 },
    EN_PREPARACION: { etiqueta: 'En Preparación 👨‍🍳', etapa: 2 },
    LISTO_PARA_ENTREGA: { etiqueta: 'En Camino 🚚', etapa: 3 },
    ENTREGADO: { etiqueta: 'Entregado 🎁', etapa: 4 },
    CANCELADO: { etiqueta: 'Cancelado ❌', etapa: 4 },
  },
  listarPedidosConDetalles: vi.fn(),
  cambiarEstado: vi.fn(),
  eliminarPedido: vi.fn(),
}));

// Antes de cada prueba se limpia localStorage y se acepta cualquier confirm()
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  apiFalsa.reiniciar();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

// Busca la fila de la tabla que contiene un texto
const fila = (texto) => screen.getByText(texto).closest('tr');

describe('Panel de Administración - Productos', () => {
  // Espera a que lleguen los productos desde la API
  const renderAdmin = async () => {
    render(<AdminProductos />);
    await screen.findByText('Productos (16)');
  };

  // Llena los campos obligatorios del formulario
  const llenar = ({ codigo, nombre, precio, stock }) => {
    if (codigo !== undefined) fireEvent.change(screen.getByLabelText('Código *'), { target: { value: codigo } });
    if (nombre !== undefined) fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: nombre } });
    if (precio !== undefined) fireEvent.change(screen.getByLabelText('Precio (CLP) *'), { target: { value: precio } });
    if (stock !== undefined) fireEvent.change(screen.getByLabelText('Stock *'), { target: { value: stock } });
  };

  it('Debe renderizar los 16 productos que entrega la API', async () => {
    await renderAdmin();

    expect(apiFalsa.listarProductos).toHaveBeenCalled();
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(16);
  });

  it('Debe filtrar la tabla al escribir en el buscador', async () => {
    await renderAdmin();

    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre o código/i), { target: { value: 'brownie' } });

    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(1);
    expect(screen.getByText('Brownie Sin Gluten')).toBeInTheDocument();
  });

  it('Debe crear un producto nuevo en el backend desde el formulario', async () => {
    await renderAdmin();

    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }));
    llenar({ codigo: 'TC003', nombre: 'Torta de Lúcuma', precio: '47000', stock: '8' });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(await screen.findByText('Productos (17)')).toBeInTheDocument();
    expect(apiFalsa.crearProducto).toHaveBeenCalledWith(
      expect.objectContaining({ codigo: 'TC003', nombre: 'Torta de Lúcuma', precio: '47000', stock: '8' })
    );
    expect(apiFalsa.obtener().some((p) => p.codigo === 'TC003' && p.stock === 8)).toBe(true);
  });

  it('Debe mostrar un error si el código ya existe', async () => {
    await renderAdmin();

    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }));
    llenar({ codigo: 'TC001', nombre: 'Repetida', precio: '1000', stock: '5' });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/Ya existe un producto con el código TC001/);
    expect(apiFalsa.crearProducto).not.toHaveBeenCalled();
  });

  it('Debe pedir el stock antes de crear el producto', async () => {
    await renderAdmin();

    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }));
    llenar({ codigo: 'TC004', nombre: 'Sin stock', precio: '1000' });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/El stock debe ser un número entero/);
    expect(apiFalsa.crearProducto).not.toHaveBeenCalled();
  });

  it('Debe editar el precio de un producto', async () => {
    await renderAdmin();

    fireEvent.click(within(fila('Torta Cuadrada de Chocolate')).getByRole('button', { name: 'Editar' }));
    llenar({ precio: '49990' });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    await waitFor(() =>
      expect(within(fila('Torta Cuadrada de Chocolate')).getByText('$49.990')).toBeInTheDocument()
    );
    expect(apiFalsa.actualizarProducto).toHaveBeenCalledWith(1, expect.objectContaining({ precio: '49990' }));
  });

  it('Debe eliminar un producto después de confirmar', async () => {
    await renderAdmin();

    fireEvent.click(within(fila('Pan Sin Gluten')).getByRole('button', { name: 'Eliminar' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(await screen.findByText('Productos (15)')).toBeInTheDocument();
    expect(screen.queryByText('Pan Sin Gluten')).not.toBeInTheDocument();
  });
});

describe('Panel de Administración - Usuarios', () => {
  it('No debe permitir que el administrador se elimine a sí mismo', () => {
    render(<AdminUsuarios usuarioActual={{ email: 'admin@milsabores.cl' }} />);

    fireEvent.click(within(fila('Administrador Mil Sabores')).getByRole('button', { name: 'Eliminar' }));

    expect(screen.getByText(/No puedes eliminar tu propia cuenta/)).toBeInTheDocument();
    expect(window.confirm).not.toHaveBeenCalled();
  });
});

describe('Panel de Administración - Órdenes', () => {
  it('Debe listar los pedidos del backend y cambiar su estado', async () => {
    const pedidoMock = {
      id: 1,
      codigoSeguimiento: 'PED-0001',
      folio: 1,
      cliente: {
        nombre: 'Ana Pérez',
        rut: '12.345.678-5',
        email: 'ana@gmail.com',
        direccion: 'Av. Providencia 1234',
      },
      fecha: '2026-11-16T10:00:00',
      estado: 'PENDIENTE',
      estadoNombre: 'Recibido 📝',
      etapa: 1,
      totalPagar: 47500,
      descuentoAplicado: 0,
      direccionDespacho: 'Av. Providencia 1234',
      items: [{ nombre: 'Torta Cuadrada de Chocolate', cantidad: 1, precio: 45000, subtotal: 45000 }],
    };

    listarPedidosConDetalles.mockResolvedValue([pedidoMock]);
    cambiarEstado.mockResolvedValue({ ...pedidoMock, estado: 'LISTO_PARA_ENTREGA' });

    render(<AdminOrdenes />);

    const select = await screen.findByLabelText('Estado del pedido PED-0001');
    fireEvent.change(select, { target: { value: 'LISTO_PARA_ENTREGA' } });

    expect(cambiarEstado).toHaveBeenCalledWith(1, 'LISTO_PARA_ENTREGA');
    expect(await screen.findByText(/ahora está "En Camino/)).toBeInTheDocument();
  });
});
