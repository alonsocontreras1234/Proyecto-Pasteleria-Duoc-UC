import { describe, it, expect } from 'vitest';
import { validarRut, validarEmail } from '../utils/validations';

describe('Pruebas Unitarias - Módulo de Validaciones', () => {
  it('Debe validar un RUT chileno correcto con o sin formato', () => {
    expect(validarRut('22163627-9')).toBe(true);
    expect(validarRut('22.163.627-9')).toBe(true);
    expect(validarRut('19011022K')).toBe(true);
  });

  it('Debe rechazar un RUT con dígito verificador incorrecto', () => {
    expect(validarRut('22163627-0')).toBe(false);
  });

  it('Debe rechazar entradas nulas o con largo insuficiente', () => {
    expect(validarRut('')).toBe(false);
    expect(validarRut('123')).toBe(false);
  });

  it('Debe validar correos electrónicos correctamente', () => {
    expect(validarEmail('magd.zuniga@duocuc.cl')).toBe(true);
    expect(validarEmail('correo-invalido@')).toBe(false);
    expect(validarEmail('sin_arroba.com')).toBe(false);
  });
});