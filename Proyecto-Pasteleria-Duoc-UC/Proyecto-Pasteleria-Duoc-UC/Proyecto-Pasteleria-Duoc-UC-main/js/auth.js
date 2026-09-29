document.addEventListener("DOMContentLoaded", () => {
  const formRegistro = document.getElementById("form-registro");
  const formLogin = document.getElementById("form-login");
  const modalLogin = document.getElementById("modal-login");
  const btnAbrirLogin = document.getElementById("btn-abrir-login");
  const btnCerrarLogin = document.getElementById("btn-cerrar-login");

  // Control de apertura y cierre del modal de Login
  if (btnAbrirLogin && modalLogin) {
    btnAbrirLogin.addEventListener("click", () => {
      modalLogin.style.display = "flex";
    });
  }
  if (btnCerrarLogin && modalLogin) {
    btnCerrarLogin.addEventListener("click", () => {
      modalLogin.style.display = "none";
    });
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

      // a) Validación de RUN chileno (Módulo 11)
      if (typeof Validators !== 'undefined' && !Validators.validarRut(rut)) {
        alert("Por favor ingrese un RUN chileno válido (sin puntos ni guion).");
        document.getElementById("reg_rut").focus();
        return;
      }

      // b) Validación de Formato de Email
      if (typeof Validators !== 'undefined' && !Validators.validarEmail(email)) {
        alert("Ingrese un correo electrónico válido (ejemplo: usuario@duocuc.cl).");
        document.getElementById("reg_email").focus();
        return;
      }

      const usuariosGuardados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

      // c) Verificar si el correo o RUN ya existen
      const existeUsuario = usuariosGuardados.some(u => u.email === email || u.rut === rut);
      if (existeUsuario) {
        alert("El correo o el RUN ingresado ya se encuentran registrados. Por favor, inicia sesión.");
        if (modalLogin) modalLogin.style.display = "flex";
        return;
      }

      // d) Calcular beneficios
      const beneficios = (typeof Validators !== 'undefined' && Validators.calcularBeneficios)
        ? Validators.calcularBeneficios({ fechaNacimiento, email })
        : { descuentoAplicable: 0, tortaGratisDuoc: false, detalles: [] };

      const nuevoUsuario = {
        rut: rut,
        nombre: nombre,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        telefono: "+56 9 1234 5678",
        direccion: "Dirección no registrada",
        porcentajeDescuento: beneficios.descuentoAplicable,
        tortaGratisCumpleanos: beneficios.tortaGratisDuoc,
        beneficios: beneficios.detalles
      };

      // Guardar en la base de usuarios y activar la sesión
      usuariosGuardados.push(nuevoUsuario);
      localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosGuardados));
      localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));

      alert("¡Cuenta creada exitosamente! Redirigiendo a tu perfil...");
      window.location.href = "perfil.html";
    });
  }

  // 2. INICIO DE SESIÓN ESTRICTO (SÓLO USUARIOS REGISTRADOS)
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login_email").value.trim();
      const pass = document.getElementById("login_pass").value;

      const usuariosGuardados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

      // Búsqueda exacta de usuario registrado por correo y contraseña
      const usuarioEncontrado = usuariosGuardados.find(u => u.email === email && u.password === pass);

      if (usuarioEncontrado) {
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
        alert(`¡Bienvenido de vuelta, ${usuarioEncontrado.nombre}!`);
        window.location.href = "perfil.html";
      } else {
        // Rechazar credenciales no válidas (sin sesión genérica ficticia)
        alert("Correo electrónico o contraseña incorrectos. Si no tienes cuenta, regístrate primero.");
      }
    });
  }
});