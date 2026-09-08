/**
 * MÓDULO DE SEGUIMIENTO EN TIEMPO REAL Y NOTIFICACIONES DE ESTADO
 * Módulo: Fernando - Pastelería Mil Sabores
 */

const TrackingManager = {
  fasesInfo: [
    { fase: 1, nombre: 'Pedido Confirmado', desc: 'Pago aprobado y orden ingresada al sistema de producción.' },
    { fase: 2, nombre: 'En Preparación en Taller', desc: 'Nuestros maestros pasteleros están horneando y decorando tu pedido.' },
    { fase: 3, nombre: 'Control de Calidad y Empaque', desc: 'Inspección de dedicatoria y empaque en frío para transporte seguro.' },
    { fase: 4, nombre: 'En Ruta de Despacho', desc: 'El repartidor va camino a tu dirección con control de temperatura.' },
    { fase: 5, nombre: 'Entregado con Éxito', desc: 'Pedido entregado en la fecha y franja horaria programada. ¡Que lo disfrutes!' }
  ],

  /**
   * Muestra una notificación emergente tipo Toast
   */
  showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div>
        <strong style="display: block; font-size: 0.95rem; margin-bottom: 2px;">${title}</strong>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  /**
   * Busca un pedido por código (PMS-2026-XXXX) o RUT del cliente
   */
  searchOrder(query) {
    if (!query) return null;
    const cleanQuery = query.trim().toUpperCase();
    const orders = OrdersManager.getAllOrders();

    return orders.find(order => 
      order.orderCode.toUpperCase() === cleanQuery ||
      order.cliente.rut.replace(/[^0-9kK]/g, '').toUpperCase() === cleanQuery.replace(/[^0-9kK]/g, '')
    ) || null;
  },

  /**
   * Avanza la fase de un pedido (Simulación de Estado en Tiempo Real)
   */
  advanceOrderStatus(orderCode, targetFase = null) {
    const orders = OrdersManager.getAllOrders();
    const orderIndex = orders.findIndex(o => o.orderCode === orderCode);

    if (orderIndex === -1) return null;

    const order = orders[orderIndex];
    let nextFase = targetFase !== null ? targetFase : order.estadoActual.fase + 1;
    if (nextFase > 5) nextFase = 5;

    const info = this.fasesInfo[nextFase - 1];
    const horaActual = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    order.estadoActual = {
      fase: nextFase,
      nombre: info.nombre,
      descripcion: info.desc,
      horaActualizacion: horaActual
    };

    // Registrar en historial si no existe
    if (!order.historialEstados.some(h => h.fase === nextFase)) {
      order.historialEstados.push({
        fase: nextFase,
        nombre: info.nombre,
        fecha: new Date().toLocaleString('es-CL'),
        completado: true
      });
    }

    orders[orderIndex] = order;
    localStorage.setItem('pms_orders', JSON.stringify(orders));
    localStorage.setItem('pms_active_order', JSON.stringify(order));

    // Emitir notificación en vivo
    this.showToast(
      `Actualización de Pedido (${order.orderCode})`,
      `Estado actual: ${info.nombre}`,
      nextFase === 5 ? 'success' : 'info'
    );

    return order;
  }
};
