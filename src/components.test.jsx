import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Componentes y utilidades a evaluar
import ProductCard from './components/ProductCard';
import Boleta from './pages/Boleta';
import Seguimiento from './pages/Seguimiento';
import { Validators } from './utils/validators';
import * as CartContextModule from './context/CartContext';
import * as AuthContextModule from './context/AuthContext';

/**
 * ==============================================================================
 * SUITE OFICIAL DE 10 PRUEBAS UNITARIAS (EVALUACIÓN PARCIAL 2 - DSY1104)
 * Estructurada conforme a las 5 categorías obligatorias del Anexo 1:
 *  1. Pruebas de Renderizado Correcto
 *  2. Pruebas de Renderizado Condicional
 *  3. Pruebas de Propiedades (Props) y Mocks
 *  4. Pruebas de Estado (State)
 *  5. Pruebas de Simulación de Eventos
 * ==============================================================================
 */

describe('Suite de Pruebas Unitarias - Frontend React (Pastelería Mil Sabores)', () => {
  const mockProducto = {
    codigo: 'TC001',
    nombre: 'Torta Circular de Chocolate',
    descripcionCorta: 'Bizcocho húmedo de cacao con ganache artesanal.',
    categoria: 'Tortas Circulares',
    precioNumero: 28000,
    imagen: '/img/pasteles/torta-chocolate.jpg'
  };

  const mockAgregarAlCarrito = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Simulación estándar de useCart para aislar el componente
    vi.spyOn(CartContextModule, 'useCart').mockReturnValue({
      agregarAlCarrito: mockAgregarAlCarrito,
      items: [],
      totalItems: 0,
      subtotal: 0,
      cupon: '',
      setCupon: vi.fn(),
      montoDescuento: 0,
      vaciarCarrito: vi.fn()
    });

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null
    });
  });

  // ----------------------------------------------------------------------------
  // CATEGORÍA 1: PRUEBAS DE RENDERIZADO (Renderizado Correcto de Datos)
  // ----------------------------------------------------------------------------
  it('1. [Renderizado] Debe renderizar correctamente los datos del producto (código, nombre y precio formateado)', () => {
    render(<ProductCard producto={mockProducto} />);

    expect(screen.getByText('Torta Circular de Chocolate')).toBeDefined();
    expect(screen.getByText('TC001')).toBeDefined();
    expect(screen.getByText('Tortas Circulares')).toBeDefined();
    expect(screen.getByText('$28 000')).toBeDefined();
  });

  it('2. [Renderizado] Debe renderizar la información fiscal en la Boleta Electrónica cuando existe una orden activa', () => {
    const mockOrden = {
      folio: 1054,
      orderCode: 'PMS-2026-1054',
      fechaEmision: new Date().toISOString(),
      cliente: {
        nombre: 'Fernando Barra',
        rut: '19.876.543-0',
        email: 'f.barra@alumnos.duoc.cl',
        telefono: '+56 9 1234 5678',
        direccion: 'Av. Providencia 1234',
        comuna: 'Santiago Centro'
      },
      entrega: {
        tipo: 'domicilio',
        fechaPreferida: '2026-10-05',
        franjaHoraria: '09:00 - 13:00 h',
        comuna: 'Santiago Centro'
      },
      items: [
        { id: 'TC001', name: 'Torta Circular de Chocolate', quantity: 2, price: 28000 }
      ],
      totales: {
        subtotal: 56000,
        descuento: 0,
        costoEnvio: 3000,
        neto: 49580,
        iva: 9420,
        total: 59000
      },
      metodoPago: 'Webpay Plus'
    };

    localStorage.setItem('pms_active_order', JSON.stringify(mockOrden));

    render(
      <BrowserRouter>
        <Boleta />
      </BrowserRouter>
    );

    expect(screen.getByText('BOLETA ELECTRÓNICA')).toBeDefined();
    expect(screen.getByText('N.° 1054')).toBeDefined();
    expect(screen.getByText(/Fernando Barra/i)).toBeDefined();
    expect(screen.getByText('R.U.T.: 76.543.210-K')).toBeDefined();
  });

  // ----------------------------------------------------------------------------
  // CATEGORÍA 2: PRUEBAS DE RENDERIZADO CONDICIONAL
  // ----------------------------------------------------------------------------
  it('3. [Renderizado Condicional] Debe mostrar mensaje de estado vacío cuando no hay boleta activa', () => {
    // LocalStorage sin órdenes
    render(
      <BrowserRouter>
        <Boleta />
      </BrowserRouter>
    );

    expect(screen.getByText('No hay ninguna boleta activa')).toBeDefined();
    expect(screen.getByText('Ver Catálogo')).toBeDefined();
  });

  it('4. [Renderizado Condicional] Debe renderizar alerta de advertencia en Seguimiento cuando no se encuentra un pedido', () => {
    render(<Seguimiento />);

    const input = screen.getByPlaceholderText(/Buscar por código/i);
    const botonBuscar = screen.getByRole('button', { name: /Rastrear/i });

    fireEvent.change(input, { target: { value: 'ORDEN-INEXISTENTE-999' } });
    fireEvent.click(botonBuscar);

    expect(screen.getByText(/No se encontró ningún pedido con el identificador/i)).toBeDefined();
  });

  // ----------------------------------------------------------------------------
  // CATEGORÍA 3: PRUEBAS DE PROPIEDADES (PROPS) Y MOCKS
  // ----------------------------------------------------------------------------
  it('5. [Props y Mocks] Debe recibir correctamente las propiedades del producto y ejecutar la función agregarAlCarrito al presionar "+ Añadir"', () => {
    render(<ProductCard producto={mockProducto} />);

    const botonAnadir = screen.getByRole('button', { name: /\+ Añadir/i });
    expect(botonAnadir).toBeDefined();

    fireEvent.click(botonAnadir);

    // Verifica que la función espía (mock) fue llamada con los props del componente
    expect(mockAgregarAlCarrito).toHaveBeenCalledTimes(1);
    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(mockProducto, 1, '');
  });

  it('6. [Props y Mocks] Debe validar que la dedicatoria personalizada se envíe a través de las props hacia agregarAlCarrito', () => {
    render(<ProductCard producto={mockProducto} />);

    // Abrir modal haciendo clic en la tarjeta
    const tarjeta = screen.getByText('Torta Circular de Chocolate');
    fireEvent.click(tarjeta);

    // Escribir dedicatoria en el modal
    const textarea = screen.getByPlaceholderText(/Ej: ¡Feliz cumpleaños, mamá!/i);
    fireEvent.change(textarea, { target: { value: 'Feliz Aniversario Duoc' } });

    // Confirmar modal
    const botonConfirmar = screen.getByRole('button', { name: /Agregar al Carrito/i });
    fireEvent.click(botonConfirmar);

    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(mockProducto, 1, 'Feliz Aniversario Duoc');
  });

  // ----------------------------------------------------------------------------
  // CATEGORÍA 4: PRUEBAS DE ESTADO (STATE)
  // ----------------------------------------------------------------------------
  it('7. [Estado - State] Debe actualizar el estado local de búsqueda en el componente Seguimiento al escribir', () => {
    render(<Seguimiento />);

    const input = screen.getByPlaceholderText(/Buscar por código/i);
    fireEvent.change(input, { target: { value: '19876543-0' } });

    expect(input.value).toBe('19876543-0');
  });

  it('8. [Estado - State] Debe actualizar el estado y abrir el modal al hacer clic en la tarjeta del componente ProductCard', () => {
    render(<ProductCard producto={mockProducto} />);

    // Estado inicial: modal no abierto
    expect(screen.queryByText('Elaboración Tradicional:')).toBeNull();

    // Clic en la tarjeta: el estado showModal cambia a true y renderiza el contenido del modal
    const titulo = screen.getByText('Torta Circular de Chocolate');
    fireEvent.click(titulo);

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Agregar al Carrito ($28 000)')).toBeDefined();
  });

  // ----------------------------------------------------------------------------
  // CATEGORÍA 5: PRUEBAS DE SIMULACIÓN DE EVENTOS Y LÓGICA DE NEGOCIO
  // ----------------------------------------------------------------------------
  it('9. [Eventos y Validación] Debe validar correctamente el algoritmo Módulo 11 para RUN chileno', () => {
    // Casos válidos
    expect(Validators.validarRut('19876543-0')).toBe(true);
    expect(Validators.validarRut('12345678-5')).toBe(true);
    expect(Validators.validarRut('11111111-1')).toBe(true);
    // Casos inválidos
    expect(Validators.validarRut('19876543-9')).toBe(false);
    expect(Validators.validarRut('11111111-2')).toBe(false);
  });

  it('10. [Eventos y Negocio] Debe calcular correctamente el beneficio institucional Duoc UC y descuentos por edad', () => {
    const beneficioDuoc = Validators.calcularBeneficios({
      email: 'f.barra@alumnos.duoc.cl'
    });
    expect(beneficioDuoc.tortaGratisDuoc).toBe(true);

    const beneficioTerceraEdad = Validators.calcularBeneficios({
      fechaNacimiento: '1965-05-15',
      email: 'cliente@gmail.com'
    });
    expect(beneficioTerceraEdad.porcentajeDescuentoEdad).toBe(0.50);
  });
});
