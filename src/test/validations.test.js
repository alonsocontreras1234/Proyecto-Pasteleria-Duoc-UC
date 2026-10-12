import { describe, it, expect } from 'vitest';
import { validarRut, validarEmail, calcularBeneficios } from '../utils/validations';

describe('Pruebas Unitarias - Módulo de Validaciones', () => {
  it('Debe validar un RUT chileno correcto con o sin formato', () => {
    expect(validarRut('22163627-9')).toBe(true);
    expect(validarRut('22.163.627-9')).toBe(true);
    expect(validarRut('19011029K')).toBe(true);
    expect(validarRut('19.876.543-0')).toBe(true);
  });

  it('Debe rechazar un RUT con dígito verificador incorrecto', () => {
    expect(validarRut('22163627-0')).toBe(false);
    expect(validarRut('19876543-9')).toBe(false);
  });

  it('Debe rechazar RUTs sintéticos o de prueba ingresados por el profesor (11.111.111-1 y 00.000.000-0)', () => {
    expect(validarRut('11.111.111-1')).toBe(false);
    expect(validarRut('11111111-1')).toBe(false);
    expect(validarRut('00.000.000-0')).toBe(false);
    expect(validarRut('00000000-0')).toBe(false);
  });

  it('Debe rechazar entradas nulas, vacías o con largo insuficiente', () => {
    expect(validarRut('')).toBe(false);
    expect(validarRut(null)).toBe(false);
    expect(validarRut('123')).toBe(false);
  });

  it('Debe validar correos electrónicos correctamente', () => {
    expect(validarEmail('magd.zuniga@duocuc.cl')).toBe(true);
    expect(validarEmail('f.barra@alumnos.duoc.cl')).toBe(true);
    expect(validarEmail('correo-invalido@')).toBe(false);
    expect(validarEmail('sin_arroba.com')).toBe(false);
  });

  it('Debe calcular beneficio de 50% de descuento para mayores de 50 años', () => {
    const beneficio = calcularBeneficios({
      fechaNacimiento: '1960-05-10',
      email: 'cliente@gmail.com'
    });
    expect(beneficio.porcentajeDescuento).toBe(50);
    expect(beneficio.descuentoEdad).toBe(50);
  });

  it('Debe calcular beneficio de 10% de por vida para código FELICES50', () => {
    const beneficio = calcularBeneficios({
      fechaNacimiento: '2000-01-01',
      email: 'cliente@gmail.com',
      codigoPromo: 'FELICES50'
    });
    expect(beneficio.porcentajeDescuento).toBe(10);
    expect(beneficio.descuentoCodigo).toBe(10);
  });

  it('Debe otorgar torta gratis de cumpleaños para estudiantes de Duoc UC', () => {
    const beneficio = calcularBeneficios({
      fechaNacimiento: '2002-03-15',
      email: 'alumno@alumnos.duoc.cl'
    });
    expect(beneficio.tortaGratisDuoc).toBe(true);
  });
});