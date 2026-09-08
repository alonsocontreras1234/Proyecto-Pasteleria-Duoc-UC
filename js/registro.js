document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registro-form");
    const perfilForm = document.getElementById("perfil-form");
    const registroSection = document.getElementById("registro-section");
    const perfilSection = document.getElementById("perfil-section");

    // Verificar sesión iniciada
    if (localStorage.getItem("usuarioActual")) {
        mostrarPerfil();
    }

    // --- LÓGICA DE REGISTRO ---
    registroForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const rut = document.getElementById("rut").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
        const codigoPromo = document.getElementById("codigo_promo").value.trim().toUpperCase();
        const mensajesDiv = document.getElementById("registro-mensajes");

        // 1. Validar RUT (Integración con Validators o fallback local)
        const rutValido = (typeof Validators !== 'undefined' && Validators.validarRut) 
            ? Validators.validarRut(rut) 
            : validarRutLocal(rut);

        if (!rutValido) {
            mensajesDiv.innerHTML = `<div class="mensaje-error" style="color: #d32f2f; background-color: #ffebee; padding: 10px; border-radius: 4px; margin-bottom: 10px;">El RUT ingresado no es válido. Ingrésalo sin puntos ni guión.</div>`;
            return;
        }

        // 2. Evaluador de Beneficios
        let porcentajeDescuento = 0;
        let listaBeneficiosText = [];
        let tieneTortaGratis = false;

        const edad = calcularEdad(fechaNacimiento);

        // Regla A: 50% descuento mayores de 50 años
        if (edad >= 50) {
            porcentajeDescuento = Math.max(porcentajeDescuento, 0.50);
            listaBeneficiosText.push("50% de descuento en todos los productos por ser mayor de 50 años.");
        }

        // Regla B: 10% descuento por código FELICES50
        if (codigoPromo === "FELICES50") {
            porcentajeDescuento = Math.max(porcentajeDescuento, 0.10);
            listaBeneficiosText.push("10% de descuento vitalicio por código FELICES50.");
        }

        // Regla C: Torta gratis de cumpleaños para estudiantes Duoc UC
        if (esCorreoDuoc(correo)) {
            tieneTortaGratis = true;
            listaBeneficiosText.push("Torta gratis en tu cumpleaños por ser estudiante Duoc UC.");
        }

        // 3. Objeto Usuario Persistente
        const usuario = {
            rut: rut,
            nombre: nombre,
            correo: correo,
            fechaNacimiento: fechaNacimiento,
            preferencia: "Sin preferencia",
            porcentajeDescuento: porcentajeDescuento, // Atributo numérico clave para Checkout y Boleta
            tortaGratisCumpleanos: tieneTortaGratis,
            beneficios: listaBeneficiosText
        };

        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        mensajesDiv.innerHTML = `<div class="mensaje-exito" style="color: #2e7d32; background-color: #e8f5e9; padding: 10px; border-radius: 4px; margin-bottom: 10px;">¡Registro exitoso! Bienvenido ${nombre}.</div>`;

        setTimeout(() => {
            mostrarPerfil();
        }, 1200);
    });

    // --- LOGICA DE GESTIÓN DE PERFIL ---
    perfilForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let usuarioData = JSON.parse(localStorage.getItem("usuarioActual"));
        if (!usuarioData) return;

        usuarioData.nombre = document.getElementById("perfil_nombre").value.trim();
        usuarioData.preferencia = document.getElementById("perfil_preferencia").value;

        localStorage.setItem("usuarioActual", JSON.stringify(usuarioData));

        const perfilMensajes = document.getElementById("perfil-mensajes");
        perfilMensajes.innerHTML = `<div class="mensaje-exito" style="color: #2e7d32; background-color: #e8f5e9; padding: 10px; border-radius: 4px; margin-bottom: 10px;">Preferencias de compra actualizadas correctamente.</div>`;
    });

    // Cerrar sesión
    const btnCerrar = document.getElementById("btn-cerrar-sesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuarioActual");
            registroForm.reset();
            document.getElementById("registro-mensajes").innerHTML = "";
            document.getElementById("perfil-mensajes").innerHTML = "";
            perfilSection.style.display = "none";
            registroSection.style.display = "block";
        });
    }

    // --- FUNCIONES AUXILIARES ---
    function mostrarPerfil() {
        registroSection.style.display = "none";
        perfilSection.style.display = "block";

        const usuarioData = JSON.parse(localStorage.getItem("usuarioActual"));
        if (!usuarioData) return;

        document.getElementById("perfil_nombre").value = usuarioData.nombre || "";
        document.getElementById("perfil_preferencia").value = usuarioData.preferencia || "Sin preferencia";

        const listaBeneficios = document.getElementById("lista-beneficios");
        listaBeneficios.innerHTML = "";

        if (usuarioData.beneficios && usuarioData.beneficios.length > 0) {
            usuarioData.beneficios.forEach(beneficio => {
                const li = document.createElement("li");
                li.textContent = beneficio;
                listaBeneficios.appendChild(li);
            });
        } else {
            listaBeneficios.innerHTML = "<li>No tienes beneficios activos actualmente.</li>";
        }
    }

    function calcularEdad(fecha) {
        if (!fecha) return 0;
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function esCorreoDuoc(correo) {
        if (!correo) return false;
        const dominio = correo.split("@")[1]?.toLowerCase() || "";
        return dominio === "duocuc.cl" || dominio === "alumnos.duoc.cl" || dominio === "duoc.cl";
    }

    function validarRutLocal(rut) {
        if (!rut) return false;
        let rutLimpio = rut.replace(/[^0-9kK]+/g, '').toUpperCase();
        if (rutLimpio.length < 7 || rutLimpio.length > 9) return false;

        let cuerpo = rutLimpio.slice(0, -1);
        let dv = rutLimpio.slice(-1);

        let suma = 0;
        let multiplo = 2;

        for (let i = 1; i <= cuerpo.length; i++) {
            suma += parseInt(cuerpo.charAt(cuerpo.length - i), 10) * multiplo;
            multiplo = (multiplo < 7) ? multiplo + 1 : 2;
        }

        let dvEsperado = 11 - (suma % 11);
        dvEsperado = (dvEsperado === 11) ? "0" : (dvEsperado === 10) ? "K" : dvEsperado.toString();

        return dv === dvEsperado;
    }
});