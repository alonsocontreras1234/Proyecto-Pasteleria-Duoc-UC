/**
 * MOTOR DE PROCESAMIENTO DE PEDIDOS Y BOLETAS ELECTRÓNICAS
 * Módulo: Fernando - Pastelería Mil Sabores
 */

const OrdersManager = {
  // Comunas de cobertura con sus costos de despacho
  comunasTarifas: {
    "Santiago Centro": 2500,
    "Providencia": 2500,
    "Las Condes": 3500,
    "Ñuñoa": 3000,
    "La Reina": 3500,
    "Vitacura": 4000,
    "Lo Barnechea": 4500,
    "Maipú": 4000,
    "La Florida": 3500,
    "San Miguel": 3000,
    "Puente Alto": 4500
  },

  // Pedido por defecto de muestra si el carrito no tiene ítems
  sampleCart: [
    {
      id: "TC001",
      name: "Torta Cuadrada de Chocolate Tradicional",
      category: "Tortas Cuadradas",
      price: 24990,
      quantity: 1,
      dedication: "¡Feliz 50.º aniversario, familia Barra!"
    },
    {
      id: "PT001",
      name: "Brazo de Reina con Manjar Casero",
      category: "Pastelería Tradicional",
      price: 9990,
      quantity: 2,
      dedication: ""
    }
  ],

  /**
   * Obtiene los ítems del carrito actual o el de muestra
   */
  getCartItems() {
    try {
      let stored = localStorage.getItem('cart');
      if (!stored) {
        stored = localStorage.getItem('carrito');
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => ({
            id: item.id || item.codigo || 'P001',
            name: item.name || item.nombre || 'Producto Mil Sabores',
            category: item.category || item.categoria || 'Repostería',
            price: Number(item.price || item.precioNumero || item.precio || 0),
            quantity: Number(item.quantity || item.cantidad || 1),
            dedication: item.dedication || item.dedicatoria || ''
          }));
        }
      }
    } catch (e) {
      console.warn("No se pudo leer el carrito, usando muestra.", e);
    }
    return this.sampleCart;
  },

  /**
   * Obtiene todos los pedidos guardados
   */
  getAllOrders() {
    try {
      const stored = localStorage.getItem('pms_orders');
      if (stored) {
        const orders = JSON.parse(stored);
        if (Array.isArray(orders)) {
          return orders;
        }
      }
    } catch (e) {
      console.error("Error al leer pedidos de localStorage:", e);
    }
    return [];
  },

  /**
   * Genera un nuevo código de seguimiento único: PMS-2026-XXXX
   */
  generateOrderCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PMS-2026-${randomNum}`;
  },

  /**
   * Genera un número de folio correlativo de boleta
   */
  generateFolio() {
    const existing = this.getAllOrders();
    return 4890 + existing.length + 1;
  },

  /**
   * Procesa y guarda un nuevo pedido
   */
  createOrder(formData) {
    const items = this.getCartItems();
    
    // Cálculos económicos
    const subtotalBruto = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const costoEnvio = formData.tipoEntrega === 'retiro' ? 0 : (this.comunasTarifas[formData.comuna] || 3000);
    
    // Descuento cupón
    let descuento = 0;
    if (formData.cupon && formData.cupon.toUpperCase() === 'FELICES50') {
      descuento = Math.round(subtotalBruto * 0.10);
    }

    const totalFinal = (subtotalBruto - descuento) + costoEnvio;
    const neto = Math.round(totalFinal / 1.19);
    const iva = totalFinal - neto;

    const newOrder = {
      orderCode: this.generateOrderCode(),
      folio: this.generateFolio(),
      fechaEmision: new Date().toISOString(),
      cliente: {
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono
      },
      entrega: {
        tipo: formData.tipoEntrega, // 'domicilio' | 'retiro'
        direccion: formData.tipoEntrega === 'retiro' ? 'Taller Central - Av. Providencia 1234, Santiago' : formData.direccion,
        comuna: formData.tipoEntrega === 'retiro' ? 'Providencia' : formData.comuna,
        fechaPreferida: formData.fechaPreferida,
        franjaHoraria: formData.franjaHoraria, // '09:00 - 13:00' | '14:00 - 19:00'
        costoEnvio: costoEnvio
      },
      pago: {
        metodo: formData.metodoPago,
        estado: 'Aprobado'
      },
      items: items,
      totales: {
        subtotalBruto,
        descuento,
        costoEnvio,
        neto,
        iva,
        total: totalFinal
      },
      estadoActual: {
        fase: 1,
        nombre: 'Pedido Recibido y Confirmado',
        descripcion: 'Tu orden fue ingresada al sistema y el pago fue verificado.',
        horaActualizacion: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      },
      historialEstados: [
        {
          fase: 1,
          nombre: 'Pedido Recibido y Confirmado',
          fecha: new Date().toLocaleString('es-CL'),
          completado: true
        }
      ],
      repartidor: {
        nombre: 'Carlos Morales',
        vehiculo: 'Furgón Refrigerado Pastelería',
        patente: 'PSMS-26',
        telefono: '+56 9 8765 4321'
      }
    };

    // Guardar en listado de pedidos
    const orders = this.getAllOrders();
    orders.unshift(newOrder);
    localStorage.setItem('pms_orders', JSON.stringify(orders));
    localStorage.setItem('pms_active_order', JSON.stringify(newOrder));

    return newOrder;
  },

  /**
   * Obtiene el pedido activo actual
   */
  getActiveOrder() {
    try {
      const stored = localStorage.getItem('pms_active_order');
      if (stored) {
        const order = JSON.parse(stored);
        if (order && typeof order === 'object') {
          return order;
        }
      }
      const all = this.getAllOrders();
      if (all.length > 0) return all[0];
    } catch (e) {
      console.error("Error al leer pedido activo de localStorage:", e);
    }
    return null;
  }
};
