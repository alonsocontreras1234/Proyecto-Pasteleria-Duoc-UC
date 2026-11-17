import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Catalogo } from '../components/Catalogo';

describe('Pruebas de Componente - Catálogo y Modal', () => {
  it('Debe renderizar el título de la sección de productos', () => {
    render(<Catalogo onAgregarAlCarrito={vi.fn()} />);
    expect(screen.getByText(/Nuestros Productos/i)).toBeInTheDocument();
  });

  it('Debe abrir el modal de detalle al presionar "Ver Detalle / Pedir"', () => {
    render(<Catalogo onAgregarAlCarrito={vi.fn()} />);

    // Buscar todos los botones "Ver Detalle / Pedir" y presionar el primero
    const botonesDetalle = screen.getAllByText(/Ver Detalle \/ Pedir/i);
    expect(botonesDetalle.length).toBeGreaterThan(0);
    
    fireEvent.click(botonesDetalle[0]);

    // Verificar que el modal desplegó el encabezado de la receta
    expect(screen.getByRole('heading', { name: /Receta/i })).toBeInTheDocument();
  });
});