import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { Catalogo } from '../components/Catalogo';
import { Checkout } from '../components/Checkout';
import { actualizarUsuario, obtenerUsuarioPorEmail } from '../data/db';

// El catálogo se lee desde el backend; en las pruebas se usa una API falsa en memoria
vi.mock('../services/ProductoService', async (importOriginal) => {
  const real = await importOriginal();
  const { usar } = await import('./apiProductosFalsa');
  return { ...real, ...usar(real) };
});

beforeEach(() => localStorage.clear());

// Cuenta Duoc de prueba (viene en los usuarios demo de db.js)
const usuarioDuoc = () => obtenerUsuarioPorEmail('magd.zuniga@duocuc.cl');

// Carrito con una torta de $45.000 y un mousse de $5.000
const carritoConTorta = [
  { id: 1, codigo: 'TC001', nombre: 'Torta Cuadrada de Chocolate', precio: 45000, cantidad: 1, dedicatoria: '' },
  { id: 5, codigo: 'P1001', nombre: 'Mousse de Chocolate', precio: 5000, cantidad: 1, dedicatoria: '' }
];

describe('Catálogo - filtro Tradicional y recetas', () => {
  it('Debe filtrar los productos de Pastelería Tradicional', async () => {
    render(<Catalogo onAgregarAlCarrito={vi.fn()} />);

    await screen.findByText('Empanada de Manzana');
    fireEvent.click(screen.getByRole('button', { name: 'Tradicional' }));

    expect(screen.getAllByText(/Ver Detalle \/ Pedir/i)).toHaveLength(2);
    expect(screen.getByText('Empanada de Manzana')).toBeInTheDocument();
    expect(screen.getByText('Tarta de Santiago')).toBeInTheDocument();
  });

  it('Debe mostrar la receta propia de cada producto en el modal', async () => {
    render(<Catalogo onAgregarAlCarrito={vi.fn()} />);

    const titulo = await screen.findByText('Tiramisú Clásico');
    const tarjeta = titulo.closest('article');
    fireEvent.click(within(tarjeta).getByText(/Ver Detalle \/ Pedir/i));

    expect(screen.getByText('Preparar el café y dejar enfriar.')).toBeInTheDocument();
  });
});

describe('Carrito - dedicatorias distintas', () => {
  it('Debe guardar en líneas separadas el mismo producto con distinta dedicatoria', async () => {
    localStorage.setItem('usuario_mil_sabores', JSON.stringify({ esInvitado: true, nombre: 'Invitado' }));
    render(<App />);

    // Agrega la misma torta dos veces, con dedicatorias distintas
    const agregar = async (dedicatoria) => {
      fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
      const titulo = await screen.findByText('Torta Circular de Vainilla');
      const tarjeta = titulo.closest('article');
      fireEvent.click(within(tarjeta).getByText(/Ver Detalle \/ Pedir/i));
      fireEvent.change(screen.getByPlaceholderText('Ej: ¡Feliz cumpleaños!'), { target: { value: dedicatoria } });
      fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    };
    await agregar('Feliz cumpleaños Ana');
    await agregar('Felicidades Pedro');

    fireEvent.click(screen.getByTitle('Ver carrito de compras'));
    const carrito = within(document.querySelector('.modal-carrito-box'));

    expect(carrito.getAllByText('Torta Circular de Vainilla')).toHaveLength(2);
    expect(carrito.getByText('"Feliz cumpleaños Ana"')).toBeInTheDocument();
    expect(carrito.getByText('"Felicidades Pedro"')).toBeInTheDocument();
  });
});

describe('Torta gratis Duoc UC - una vez por año', () => {
  it('Debe descontar la torta al marcar la casilla', () => {
    render(<Checkout carrito={carritoConTorta} usuario={usuarioDuoc()} onFinalizarPedido={vi.fn()} setVistaActual={vi.fn()} />);

    fireEvent.click(screen.getByLabelText(/Canjear mi torta gratis/));

    // $50.000 - $45.000 (torta) + $2.500 (despacho) = $7.500
    expect(screen.getByText('$7.500')).toBeInTheDocument();
  });

  it('No debe dejar canjearla si ya la canjeó este año', () => {
    actualizarUsuario('magd.zuniga@duocuc.cl', { tortaCanjeadaAnio: new Date().getFullYear() });

    render(<Checkout carrito={carritoConTorta} usuario={usuarioDuoc()} onFinalizarPedido={vi.fn()} setVistaActual={vi.fn()} />);

    expect(screen.getByText(/Ya canjeaste tu torta gratis/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Canjear mi torta gratis/)).not.toBeInTheDocument();
  });

  it('Debe anotar el canje en la cuenta al confirmar la compra', async () => {
    localStorage.setItem('usuario_mil_sabores', JSON.stringify(usuarioDuoc()));
    localStorage.setItem('carrito_mil_sabores', JSON.stringify(carritoConTorta));
    render(<App />);

    fireEvent.click(screen.getByTitle('Ver carrito de compras'));
    fireEvent.click(screen.getByRole('button', { name: /Ir a Pagar/ }));
    fireEvent.click(screen.getByLabelText(/Canjear mi torta gratis/));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y Pagar Pedido' }));

    expect(await screen.findByText('Comprobante Oficial de Compra')).toBeInTheDocument();
    expect(screen.getByText('Torta gratis Duoc UC:')).toBeInTheDocument();
    expect(usuarioDuoc().tortaCanjeadaAnio).toBe(new Date().getFullYear());
  });

  it('Debe rechazar un RUT inválido en Checkout', () => {
    const onFinalizar = vi.fn();
    render(<Checkout carrito={carritoConTorta} usuario={{ ...usuarioDuoc(), rut: '11.111.111-1' }} onFinalizarPedido={onFinalizar} setVistaActual={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y Pagar Pedido' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/RUN\/RUT ingresado no es válido/);
    expect(onFinalizar).not.toHaveBeenCalled();
  });
});
