# Módulo: Pedidos, Boletas y Envíos (Fernando Barra)
## Pastelería Mil Sabores — Forma C (DSY1104)

Este módulo contiene la parte de **Procesamiento de Pedidos**, **Generación de Boletas** y **Gestión/Seguimiento de Envíos**.

---

### Archivos incluidos y qué hace cada uno:

1. **`checkout.html` (Confirmación de compra):**
   - Formulario de despacho con selección de **fecha preferida** (mínimo 24 h) y **franja horaria** (mañana/tarde).
   - Cálculo de tarifa de envío por comuna, cupón «FELICES50» (-10 %) y validación de RUN (módulo 11).

2. **`boleta.html` (Boleta electrónica oficial):**
   - Comprobante legal con folio correlativo (`PMS-2026-XXXX`).
   - Desglose tributario: subtotal, descuento, envío, monto neto, IVA (19 %) y total.
   - Botón directo para **Imprimir / Guardar en PDF**.

3. **`seguimiento.html` (Seguimiento en tiempo real):**
   - Buscador de pedido por código o RUN.
   - *Stepper* visual animado con las 5 fases (Recibido -> Taller -> Empaque -> En Ruta -> Entregado).
   - Notificaciones en vivo (*toasts*) y simulador de prueba para el profesor.

4. **`js/`:**
   - `orders.js`: Procesa la compra, calcula totales/IVA y guarda en `localStorage`.
   - `tracking.js`: Controla el avance de estados y las notificaciones en pantalla.
   - `validators.js`: Valida el RUN chileno y la fecha mínima de entrega.

5. **`css/styles.css`:**
   - Paleta corporativa oficial de 5 colores (`#E7C5B1`, `#C98025`, `#C64B0D`, `#A62522`, `#5A0609`).

---

### Cómo conectarlo al resto de la página:
* Desde el carrito (`carrito.html`): Vincular el botón «Pagar» a `checkout.html`.
* En la barra de navegación: Añadir el enlace a `seguimiento.html`.
