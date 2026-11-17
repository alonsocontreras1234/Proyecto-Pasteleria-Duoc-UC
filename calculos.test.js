import { describe, it, expect } from 'vitest';

// Función helper de cálculo de totales
const calcularTotales = (subtotal, descuentoPorcentaje, costoDespacho) => {
  const descuentoMonto = Math.round((subtotal * descuentoPorcentaje) / 100);
  const totalPagar = subtotal - descuentoMonto + costoDespacho;
  const montoNeto = Math.round(totalPagar / 1.19);
  const iva = totalPagar - montoNeto;
  return { totalPagar, montoNeto, iva };
};

describe('Pruebas Unitarias - Cálculos de Facturación', () => {
  it('Debe calcular correctamente el Total, Neto e IVA (19%) para una compra estándar', () => {
    const subtotal = 40000;
    const descuento = 0;
    const despacho = 2500;

    const resultado = calcularTotales(subtotal, descuento, despacho);

    expect(resultado.totalPagar).toBe(42500);
    expect(resultado.montoNeto).toBe(35714);
    expect(resultado.iva).toBe(6786);
  });

  it('Debe aplicar correctamente el cupón de descuento del 10%', () => {
    const subtotal = 50000;
    const descuento = 10; // 10%
    const despacho = 0; // Retiro en tienda

    const resultado = calcularTotales(subtotal, descuento, despacho);

    expect(resultado.totalPagar).toBe(45000);
  });
});