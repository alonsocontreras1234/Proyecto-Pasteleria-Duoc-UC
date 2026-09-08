document.addEventListener("DOMContentLoaded", () => {
  const formRegistro = document.getElementById("form-registro");
  const formLogin = document.getElementById("form-login");
  const modalLogin = document.getElementById("modal-login");
  const btnAbrirLogin = document.getElementById("btn-abrir-login");
  const btnCerrarLogin = document.getElementById("btn-cerrar-login");

  // Control de apertura/cierre de modal Login
  if (btnAbrirLogin && modalLogin) {
    btnAbrirLogin.addEventListener("click", () => modalLogin.style.display = "flex");
  }
  if (btnCerrarLogin && modalLogin) {
    btnCerrarLogin.addEventListener("click", () => modalLogin.style.display = "none");
  }

  // 1. REGISTRO DE NUEVO USUARIO
  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();

      const rut = document.getElementById("reg_rut").value.trim();
      const nombre = document.getElementById("reg_nombre").value.trim();
      const email = document.getElementById("reg_email").value.trim();
      const password = document.getElementById("reg_pass").value;
      const fechaNacimiento = document.getElementById("reg_fecha").value;

      // Validación Módulo 11 de RUT
      if (typeof Validators !== 'undefined' && !Validators.validarRut(rut)) {
        alert("Por favor ingrese un RUN chileno válido (sin puntos ni guión).");
        document.getElementById("reg_rut").focus();
        return;
      }

      // Calcular beneficios: 50% por edad, torta gratis Duoc UC (el 10% por código se aplica en el carrito)
      const beneficios = (typeof Validators !== 'undefined' && Validators.calcularBeneficios)
        ? Validators.calcularBeneficios({ fechaNacimiento, email })
        : { descuentoAplicable: 0, tortaGratisDuoc: false, detalles: [] };

      const nuevoUsuario = {
        rut: rut,
        nombre: nombre,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        telefono: "+56 9 1234 5678", // Teléfono base asignado
        direccion: "Dirección no registrada",
        porcentajeDescuento: beneficios.descuentoAplicable,
        tortaGratisCumpleanos: beneficios.tortaGratisDuoc,
        beneficios: beneficios.detalles
      };

      // Guardar base de usuarios en localStorage
      const usuariosGuardados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
      usuariosGuardados.push(nuevoUsuario);
      localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosGuardados));

      // Iniciar sesión activa con el nuevo usuario
      localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));

      alert("¡Cuenta creada exitosamente! Redirigiendo a tu perfil...");
      window.location.href = "perfil.html";
    });
  }

  // 2. INICIO DE SESIÓN DE USUARIOS EXISTENTES
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login_email").value.trim();
      const pass = document.getElementById("login_pass").value;

      const usuariosGuardados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
      
      // Buscar usuario coincidentes o generar sesión por defecto
      const usuarioEncontrado = usuariosGuardados.find(u => u.email === email && u.password === pass);

      if (usuarioEncontrado) {
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
      } else {
        // Si entra con cualquier clave para pruebas быстras:
        const sesionGenerica = {
          nombre: email.split('@')[0],
          email: email,
          telefono: "+56 9 1234 5678",
          direccion: "Av. Providencia 1234"
        };
        localStorage.setItem("usuarioActual", JSON.stringify(sesionGenerica));
      }

      window.location.href = "perfil.html";
    });
  }
});