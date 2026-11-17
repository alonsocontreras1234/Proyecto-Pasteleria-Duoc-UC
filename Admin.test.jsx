import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminProductos } from '../components/admin/AdminProductos';
import { AdminOrdenes } from '../components/admin/AdminOrdenes';
import { AdminUsuarios } from '../components/admin/AdminUsuarios';
import { obtenerProductoPorId, obtenerProductos } from '../data/productosDB';
import { crearPedido, obtenerPedidos } from '../data/pedidosDB';

// Antes de cada prueba se limpia localStorage y se acepta cualquier confirm()
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

// Busca la fila de la tabla que contiene un texto
const fila = (texto) => screen.getByText(texto).closest('tr');

describe('Panel de Administración - Productos', () => {
  it('Debe renderizar los 16 productos del catálogo', () => {
    render(<AdminProductos />);

    expect(screen.getByText('Productos (16)')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(16);
  });

  it('Debe filtrar la tabla al escribir en el buscador', () => {
    render(<AdminProductos />);

    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre o código/i), { target: { value: 'brownie' } });

    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(1);
    expect(screen.getByText('Brownie Sin Gluten')).toBeInTheDocument();
  });

  it('Debe crear un producto nuevo desde el formulario', () => {
    render(<AdminProductos />);

    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }));
    fireEvent.change(screen.getByLabelText('Código *'), { target: { value: 'TC003' } });
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Torta de Lúcuma' } });
    fireEvent.change(screen.getByLabelText('Precio (CLP) *'), { target: { value: '47000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(screen.getByText('Productos (17)')).toBeInTheDocument();
    expect(obtenerProductos().some((p) => p.codigo === 'TC003')).toBe(true);
  });

  it('Debe mostrar un error si el código ya existe', () => {
    render(<AdminProductos />);

    fireEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }));
    fireEvent.change(screen.getByLabelText('Código *'), { target: { value: 'TC001' } });
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Repetida' } });
    fireEvent.change(screen.getByLabelText('Precio (CLP) *'), { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/Ya existe un producto con el código TC001/);
    expect(obtenerProductos()).toHaveLength(16);
  });

  it('Debe editar el precio de un producto', () => {
    render(<AdminProductos />);

    fireEvent.click(within(fila('Torta Cuadrada de Chocolate')).getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByLabelText('Precio (CLP) *'), { target: { value: '49990' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(obtenerProductoPorId(1).precio).toBe(49990);
    expect(within(fila('Torta Cuadrada de Chocolate')).getByText('$49.990')).toBeInTheDocument();
  });

  it('Debe eliminar un producto después de confirmar', () => {
    render(<AdminProductos />);

    fireEvent.click(within(fila('Pan Sin Gluten')).getByRole('button', { name: 'Eliminar' }));

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText('Pan Sin Gluten')).not.toBeInTheDocument();
    expect(screen.getByText('Productos (15)')).toBeInTheDocument();
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
  it('Debe cambiar la etapa de un pedido', () => {
    const { pedido } = crearPedido({
      cliente: { nombre: 'Ana Pérez', rut: '12.345.678-5', email: 'ana@gmail.com' },
      items: [{ nombre: 'Torta Cuadrada de Chocolate', precio: 45000, cantidad: 1 }],
      totalPagar: 47500
    });

    render(<AdminOrdenes />);

    fireEvent.change(screen.getByLabelText(`Estado del pedido ${pedido.codigoSeguimiento}`), { target: { value: '3' } });

    expect(obtenerPedidos()[0].etapa).toBe(3);
    expect(screen.getByText(/ahora está "En Camino/)).toBeInTheDocument();
  });
});
