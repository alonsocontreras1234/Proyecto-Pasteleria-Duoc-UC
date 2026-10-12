/**
 * Utilidades de validación y cálculo de beneficios para Pastelería Mil Sabores
 */

/**
 * Valida el formato y el dígito verificador del RUT chileno usando Módulo 11.
 * Rechaza RUTs con ceros (00.000.000-0) y secuencias repetitivas sintéticas (11.111.111-1).
 */
export const validarRut = (runStr) => {
  if (!runStr || typeof runStr !== 'string') return false;

  // Limpiar caracteres extraños dejando solo números y K
  const clean = runStr.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 7 || clean.length > 9) return false;

  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);

  // Rechazar números sintéticos con todos los dígitos idénticos (ej. 11.111.111 o 00.000.000)
  if (/^(\d)\1+$/.test(cuerpo)) return false;

  // Rechazar RUT menor a 1.000.000
  const cuerpoNum = parseInt(cuerpo, 10);
  if (isNaN(cuerpoNum) || cuerpoNum < 1000000) return false;

  // Algoritmo Módulo 11
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperadoNum = 11 - (suma % 11);
  let dvEsperado = '';
  if (dvEsperadoNum === 11) dvEsperado = '0';
  else if (dvEsperadoNum === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperadoNum.toString();

  return dv === dvEsperado;
};

/**
 * Valida formato estándar de correo electrónico
 */
export const validarEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Calcula los beneficios comerciales según las reglas del 50° Aniversario:
 * - 50 % de descuento en todos los productos para mayores de 50 años.
 * - 10 % de descuento vitalicio por código "FELICES50".
 * - Torta gratis de cumpleaños para estudiantes de Duoc UC (@duocuc.cl o @alumnos.duoc.cl).
 */
export const calcularBeneficios = (datos) => {
  const beneficios = {
    descuentoEdad: 0,
    descuentoCodigo: 0,
    porcentajeDescuento: 0,
    tortaGratisDuoc: false,
    detalles: []
  };

  if (!datos) return beneficios;

  // 1. Descuento por edad (mayor o igual a 50 años)
  if (datos.fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(datos.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad >= 50) {
      beneficios.descuentoEdad = 50;
      beneficios.detalles.push('50 % de descuento por ser mayor de 50 años');
    }
  }

  // 2. Descuento por código FELICES50
  if (datos.codigoPromo && datos.codigoPromo.trim().toUpperCase() === 'FELICES50') {
    beneficios.descuentoCodigo = 10;
    beneficios.detalles.push('10 % de descuento vitalicio por código FELICES50');
  }

  // 3. Beneficio Duoc UC
  if (datos.email) {
    const correoLower = datos.email.trim().toLowerCase();
    if (correoLower.endsWith('@duocuc.cl') || correoLower.endsWith('@alumnos.duoc.cl')) {
      beneficios.tortaGratisDuoc = true;
      beneficios.detalles.push('Torta gratis en tu cumpleaños (Estudiante Duoc UC)');
    }
  }

  // Se aplica el descuento más alto entre edad y código (o acumulado según convención)
  beneficios.porcentajeDescuento = Math.max(beneficios.descuentoEdad, beneficios.descuentoCodigo);

  return beneficios;
};