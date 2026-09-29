document.addEventListener("DOMContentLoaded", () => {
  cargarDatosUsuario();
  inicializarFormularioPerfil();
  actualizarPestañasContent();
});

/**
 * Carga la información del usuario en pantalla.
 * Si no hay sesión iniciada, muestra el perfil en modo "Invitado".
 */
function cargarDatosUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  const nombreEl = document.getElementById("sidebar-nombre-usuario");
  const correoEl = document.getElementById("sidebar-correo-usuario");
  const badgeEl = document.querySelector(".badge-aniversario");

  if (usuario && usuario.nombre) {
    nombreEl.textContent = usuario.nombre;
    correoEl.textContent = usuario.email || "correo@ejemplo.cl";
    
    if (badgeEl) {
      badgeEl.textContent = "Cliente Aniversario";
      badgeEl.style.backgroundColor = "#a04000";
    }

    document.getElementById("perfil_nombre").value = usuario.nombre || "";
    document.getElementById("perfil_telefono").value = usuario.telefono || "";
    document.getElementById("perfil_email").value = usuario.email || "";
    document.getElementById("perfil_direccion").value = usuario.direccion || "";
  } else {
    nombreEl.textContent = "Invitado";
    correoEl.textContent = "Sin sesión activa";
    
    if (badgeEl) {
      badgeEl.textContent = "Modo Invitado";
      badgeEl.style.backgroundColor = "#7f8c8d";
    }

    document.getElementById("perfil_nombre").value = "";
    document.getElementById("perfil_telefono").value = "";
    document.getElementById("perfil_email").value = "";
    document.getElementById("perfil_direccion").value = "";
  }
}

/**
 * Permite cambiar entre las pestañas de Datos Personales, Pedidos y Historial.
 */
function cambiarTab(tabId) {
  // Ocultar todos los paneles
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.style.display = "none";
    panel.classList.remove("active");
  });

  // Desactivar botones de tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Mostrar panel seleccionado
  const panelActual = document.getElementById(`tab-${tabId}`);
  if (panelActual) {
    panelActual.style.display = "block";
    panelActual.classList.add("active");
  }

  // Marcar botón activo
  const btnActivo = event ? event.currentTarget : null;
  if (btnActivo) {
    btnActivo.classList.add("active");
  }
}

/**
 * Renderiza los pedidos pendientes e historial del usuario activo
 */
function actualizarPestañasContent() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (typeof OrdersManager === "undefined") return;

  const ordenes = OrdersManager.getAllOrders();
  const misOrdenes = usuario 
    ? ordenes.filter(o => o.cliente && (o.cliente.email === usuario.email || o.cliente.rut === usuario.rut))
    : [];

  // Pedidos activos (fases 1 a 4)
  const pendientes = misOrdenes.filter(o => o.estadoActual && o.estadoActual.fase < 5);
  const entregados = misOrdenes.filter(o => o.estadoActual && o.estadoActual.fase === 5);

  // Actualizar badge de pendientes
  const badgeCount = document.getElementById("badge-pending-count");
  if (badgeCount) badgeCount.textContent = pendientes.length;

  // Renderizar Pedidos Pendientes
  const contPendientes = document.getElementById("contenedor-pendientes-perfil");
  if (contPendientes) {
    if (pendientes.length === 0) {
      contPendientes.innerHTML = `<p style="color: #777; padding: 15px 0;">No tienes pedidos activos en tránsito.</p>`;
    } else {
      contPendientes.innerHTML = pendientes.map(o => `
        <div style="border: 1px solid #e0d6cc; padding: 15px; border-radius: 8px; margin-bottom: 12px; background: #fff;">
          <div style="display:flex; justify-between; align-items:center;">
            <strong>Código: ${o.orderCode}</strong>
            <span style="color: var(--accent); font-weight: bold;">${o.estadoActual.nombre}</span>
          </div>
          <p style="font-size: 0.88rem; color: #555; margin-top: 6px;">
            Fecha estimada: ${o.entrega.fechaPreferida} (${o.entrega.franjaHoraria})
          </p>
          <a href="seguimiento.html" class="btn btn-secondary" style="margin-top: 8px; padding: 6px 12px; font-size: 0.85rem;">
            Ver en Seguimiento
          </a>
        </div>
      `).join("");
    }
  }

  // Renderizar Historial
  const contHistorial = document.getElementById("contenedor-historial-perfil");
  if (contHistorial) {
    if (entregados.length === 0) {
      contHistorial.innerHTML = `<p style="color: #777; padding: 15px 0;">No tienes compras pasadas registradas.</p>`;
    } else {
      contHistorial.innerHTML = entregados.map(o => `
        <div style="border: 1px solid #e0d6cc; padding: 15px; border-radius: 8px; margin-bottom: 12px; background: #fff;">
          <strong>Boleta Folio N.º ${o.folio} (${o.orderCode})</strong>
          <p style="font-size: 0.88rem; color: #555; margin-top: 4px;">Total Pagado: $${o.totales.total.toLocaleString("es-CL")}</p>
          <a href="boleta.html" class="btn btn-outline" style="margin-top: 8px; padding: 6px 12px; font-size: 0.85rem;">Ver Boleta</a>
        </div>
      `).join("");
    }
  }
}

/**
 * Procesa la actualización del formulario de datos personales
 */
function inicializarFormularioPerfil() {
  const form = document.getElementById("form-perfil-datos");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
      alert("Debes iniciar sesión para modificar tus datos.");
      return;
    }

    const nuevoNombre = document.getElementById("perfil_nombre").value.trim();
    const nuevoTel = document.getElementById("perfil_telefono").value.trim();
    const nuevaDir = document.getElementById("perfil_direccion").value.trim();
    const nuevaPass = document.getElementById("perfil_pass_nueva").value;
    const confirmPass = document.getElementById("perfil_pass_confirm").value;

    if (nuevaPass && nuevaPass !== confirmPass) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Actualizar objeto de sesión activa
    usuario.nombre = nuevoNombre;
    usuario.telefono = nuevoTel;
    usuario.direccion = nuevaDir;
    if (nuevaPass) usuario.password = nuevaPass;

    localStorage.setItem("usuarioActual", JSON.stringify(usuario));

    // Actualizar también en el arreglo de usuarios registrados
    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const index = usuariosRegistrados.findIndex(u => u.email === usuario.email);
    if (index !== -1) {
      usuariosRegistrados[index] = usuario;
      localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));
    }

    cargarDatosUsuario();

    if (typeof TrackingManager !== "undefined") {
      TrackingManager.showToast("Perfil Actualizado", "Tus datos personales se han guardado exitosamente.", "success");
    } else {
      alert("¡Datos actualizados con éxito!");
    }
  });
}

/**
 * Cerrar Sesión
 */
function cerrarSesion() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("usuarioActual");
    cargarDatosUsuario();
    actualizarPestañasContent();
    
    if (typeof TrackingManager !== "undefined") {
      TrackingManager.showToast("Sesión Cerrada", "Ahora estás navegando como invitado.", "info");
    } else {
      alert("Has cerrado sesión.");
    }
  }
}