document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkout-form");
  if (!checkoutForm) return;

  // Actualizar costo de envío al cambiar la comuna o tipo de entrega
  const selectComuna = document.getElementById("checkout_comuna");
  const selectEntrega = document.getElementById("checkout_entrega");

  function actualizarResumenEnvio() {
    const tipo = selectEntrega ? selectEntrega.value : 'domicilio';
    const comuna = selectComuna ? selectComuna.value : '';
    const costo = tipo === 'retiro' ? 0 : (OrdersManager.comunasTarifas[comuna] || 3000);
    
    const elemCosto = document.getElementById("resumen-costo-envio");
    if (elemCosto) elemCosto.textContent = `$${costo.toLocaleString("es-CL")} CLP`;
  }

  if (selectComuna) selectComuna.addEventListener("change", actualizarResumenEnvio);
  if (selectEntrega) selectEntrega.addEventListener("change", actualizarResumenEnvio);

  // Procesar envío del formulario
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      nombre: document.getElementById("checkout_nombre").value,
      rut: document.getElementById("checkout_rut").value,
      email: document.getElementById("checkout_email").value,
      telefono: document.getElementById("checkout_telefono").value,
      tipoEntrega: document.getElementById("checkout_entrega").value, // 'domicilio' o 'retiro'
      direccion: document.getElementById("checkout_direccion")?.value || "",
      comuna: document.getElementById("checkout_comuna")?.value || "Providencia",
      fechaPreferida: document.getElementById("checkout_fecha").value,
      franjaHoraria: document.getElementById("checkout_horario").value,
      metodoPago: document.querySelector('input[name="metodoPago"]:checked')?.value || "Tarjeta de Crédito/Débito",
      cupon: document.getElementById("checkout_cupon")?.value || ""
    };

    // Crear la orden en OrdersManager
    OrdersManager.createOrder(formData);

    // Vaciar el carrito de compras tras confirmar la transacción
    localStorage.removeItem("cart");

    // Redirigir a la pantalla de la boleta / seguimiento
    window.location.href = "boleta.html";
  });
});