document.addEventListener("DOMContentLoaded", () => {
  const formBusqueda = document.getElementById("form-busqueda-tracking");
  const inputBusqueda = document.getElementById("input-busqueda");
  const contenedorResultado = document.getElementById("tracking-resultado");

  // 1. Cargar automáticamente si hay una orden activa reciente
  const ordenActiva = OrdersManager.getActiveOrder();
  if (ordenActiva) {
    renderizarSeguimiento(ordenActiva);
  }

  // 2. Evento de Búsqueda Manual (por RUT o Código PMS-2026-XXXX)
  if (formBusqueda) {
    formBusqueda.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = inputBusqueda.value.trim();
      const ordenEncontrada = TrackingManager.searchOrder(query);

      if (ordenEncontrada) {
        renderizarSeguimiento(ordenEncontrada);
      } else {
        TrackingManager.showToast(
          "Búsqueda sin resultados",
          "No se encontró ningún pedido asociado al código o RUT ingresado.",
          "error"
        );
      }
    });
  }
});

/**
 * Renderiza la interfaz de la orden y la línea de tiempo de 5 fases
 */
function renderizarSeguimiento(orden) {
  const contenedor = document.getElementById("tracking-resultado");
  if (!contenedor) return;

  const faseActual = orden.estadoActual.fase;

  contenedor.innerHTML = `
    <div class="tracking-card">
      <header class="tracking-header">
        <h3>Pedido #${orden.orderCode}</h3>
        <span class="badge-folio">Folio Boleta: ${orden.folio}</span>
      </header>

      <div class="tracking-info-grid">
        <p><strong>Cliente:</strong> ${orden.cliente.nombre}</p>
        <p><strong>RUT:</strong> ${orden.cliente.rut}</p>
        <p><strong>Destino:</strong> ${orden.entrega.direccion}, ${orden.entrega.comuna}</p>
        <p><strong>Franja Horaria:</strong> ${orden.entrega.fechaPreferida} (${orden.entrega.franjaHoraria})</p>
      </div>

      <!-- LÍNEA DE TIEMPO / STEPPER DE 5 FASES -->
      <div class="stepper-container" style="margin: 25px 0;">
        <div class="stepper-pasos" style="display: flex; justify-content: space-between; position: relative;">
          ${TrackingManager.fasesInfo.map(f => {
            const completado = f.fase <= faseActual;
            const activa = f.fase === faseActual;
            return `
              <div class="paso-item ${completado ? 'completado' : ''} ${activa ? 'activo' : ''}" style="text-align: center; flex: 1;">
                <div class="paso-icono" style="background-color: ${completado ? '#2e7d32' : '#ccc'}; color: #fff; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto; font-weight: bold;">
                  ${completado ? '✓' : f.fase}
                </div>
                <strong style="font-size: 0.85rem; display: block; color: ${activa ? '#2e7d32' : '#333'}">${f.nombre}</strong>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ESTADO ACTUAL -->
      <div class="estado-actual-box" style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #2e7d32; margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0;">${orden.estadoActual.nombre}</h4>
        <p style="margin: 0; font-size: 0.9rem; color: #555;">${orden.estadoActual.descripcion}</p>
        <small style="color: #888; display: block; margin-top: 5px;">Última actualización: ${orden.estadoActual.horaActualizacion} hrs</small>
      </div>

      <!-- BOTÓN DE SIMULACIÓN DE AVANCE -->
      ${faseActual < 5 ? `
        <button id="btn-avanzar-fase" onclick="simularSiguienteFase('${orden.orderCode}')" style="background-color: #0288d1; color: white; border: none; padding: 10px 18px; border-radius: 4px; cursor: pointer;">
          Simular Avance de Estado ➔
        </button>
      ` : `
        <p style="color: #2e7d32; font-weight: bold;">¡Este pedido ya ha sido entregado!</p>
      `}
    </div>
  `;
}

/**
 * Función global para simular el paso a la siguiente etapa de producción/entrega
 */
function simularSiguienteFase(orderCode) {
  const ordenActualizada = TrackingManager.advanceOrderStatus(orderCode);
  if (ordenActualizada) {
    renderizarSeguimiento(ordenActualizada);
  }
}