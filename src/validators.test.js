import { describe, it, expect } from 'vitest';
import { Validators } from './utils/validators';

describe('Validators Unit Tests', () => {
  it('debe validar un RUN chileno correcto con Módulo 11', () => {
    // 19.876.543-0 y 12.345.678-5 son RUTs válidos matemáticamente
    expect(Validators.validarRut('19876543-0')).toBe(true);
    expect(Validators.validarRut('198765430')).toBe(true);
    expect(Validators.validarRut('12345678-5')).toBe(true);
  });

  it('debe rechazar un RUN chileno con dígito verificador erróneo', () => {
    expect(Validators.validarRut('19876543-9')).toBe(false);
    expect(Validators.validarRut('12345678-9')).toBe(false);
  });

  it('debe formatear montos en pesos chilenos correctamente', () => {
    expect(Validators.formatCLP(45000)).toBe('$45 000');
    expect(Validators.formatCLP(5500)).toBe('$5 500');
  });

  it('debe calcular beneficios de 50% para mayores de 50 años', () => {
    const res = Validators.calcularBeneficios({
      fechaNacimiento: '1960-01-01',
      email: 'usuario@gmail.com'
    });
    expect(res.porcentajeDescuentoEdad).toBe(0.50);
  });

  it('debe calcular beneficio de torta gratis para alumnos Duoc UC', () => {
    const res = Validators.calcularBeneficios({
      email: 'f.barra@alumnos.duoc.cl'
    });
    expect(res.tortaGratisDuoc).toBe(true);
  });
});