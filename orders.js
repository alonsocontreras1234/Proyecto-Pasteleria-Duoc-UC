export const comunasTarifas = {
  "Santiago Centro": 2500,
  "Providencia": 2500,
  "Las Condes": 3500,
  "Ñuñoa": 3000,
  "La Reina": 3500,
  "Vitacura": 4000,
  "Maipú": 4000,
  "La Florida": 3500
};

export const calcularTotales = (carrito, costoEnvio = 0, porcentajeDescuento = 0) => {
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const descuento = Math.round(subtotal * porcentajeDescuento);
  const subtotalConDescuento = subtotal - descuento;
  
  const total = subtotalConDescuento + costoEnvio;
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  return { subtotal, descuento, neto, iva, costoEnvio, total };
};