document.addEventListener("DOMContentLoaded", () => {
  cargarDatosUsuario();
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
    // ESTADO: USUARIO REGISTRADO
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
    // ESTADO: INVITADO
    nombreEl.textContent = "Invitado";
    correoEl.textContent = "Sin sesión activa";
    
    if (badgeEl) {
      badgeEl.textContent = "Modo Invitado";
      badgeEl.style.backgroundColor = "#7f8c8d"; // Color gris para invitado
    }

    // Limpiar campos del formulario
    document.getElementById("perfil_nombre").value = "";
    document.getElementById("perfil_telefono").value = "";
    document.getElementById("perfil_email").value = "";
    document.getElementById("perfil_direccion").value = "";
  }
}

/**
 * Elimina la sesión activa de LocalStorage y actualiza la vista a Invitado.
 */
function cerrarSesion() {
  const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
  if (confirmar) {
    localStorage.removeItem("usuarioActual");
    cargarDatosUsuario();
    
    if (typeof TrackingManager !== 'undefined') {
      TrackingManager.showToast('Sesión Cerrada', 'Ahora estás navegando como invitado.', 'info');
    } else {
      alert("Has cerrado sesión. Ahora estás navegando como Invitado.");
    }
  }
}