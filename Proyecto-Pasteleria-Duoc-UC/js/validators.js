/**
 * VALIDACIONES Y UTILIDADES DE ENTRADA
 * Módulo: Procesamiento de Pedidos y Envíos - Fernando
 */

const Validators = {
  /**
   * Valida el formato y el dígito verificador del RUN chileno usando algoritmo Módulo 11
   * @param {string} runStr - RUN sin puntos ni guion (7 a 9 caracteres)
   * @returns {boolean}
   */
  validarRut(runStr) {
    if (!runStr) return false;
    const clean = runStr.replace(/[^0-9kK]/g, '').toUpperCase();
    if (clean.length < 7 || clean.length > 9) return false;

    const cuerpo = clean.slice(0, -1);
    const dv = clean.slice(-1);

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
  },

  /**
   * Formatea un número como pesos chilenos con espacio como separador de miles ($42 973)
   * @param {number} amount
   * @returns {string}
   */
  formatCLP(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return '$0';
    const rounded = Math.round(Number(amount));
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `$${formatted}`;
  },

  /**
   * Retorna la fecha mínima válida para entrega (mínimo día siguiente / 24h anticipación)
   * @returns {string} YYYY-MM-DD
   */
  getMinDeliveryDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  /**
   * Valida correo electrónico institucional o comercial
   * @param {string} email
   * @returns {boolean}
   */
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
};
