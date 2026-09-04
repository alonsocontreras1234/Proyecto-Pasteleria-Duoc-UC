document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.getElementById("registro-form");
    const perfilForm = document.getElementById("perfil-form");
    const registroSection = document.getElementById("registro-section");
    const perfilSection = document.getElementById("perfil-section");

    // Verificar si el usuario ya está registrado en LocalStorage
    if (localStorage.getItem("usuarioActual")) {
        mostrarPerfil();
    }

    // --- LÓGICA DE REGISTRO ---
    registroForm.addEventListener("submit", function(e) {
        e.preventDefault(); // Evitar que la página recargue

        const rut = document.getElementById("rut").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;
        const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
        const codigoPromo = document.getElementById("codigo_promo").value;
        const mensajesDiv = document.getElementById("registro-mensajes");

        // 0. Validar RUT (Formato y Dígito Verificador)
        if (!validarRut(rut)) {
            mensajesDiv.innerHTML = `<div class="mensaje-exito" style="color: #d32f2f; background-color: #ffebee;">El RUT ingresado no es válido. Recuerda: sin puntos ni guión.</div>`;
            return; // Detiene el registro si el RUT es inválido
        }

        let beneficios = [];

        // 1. Validar edad (> 50 años)
        const edad = calcularEdad(fechaNacimiento);
        if (edad >= 50) {
            beneficios.push("Descuento del 50% en todos los productos por ser mayor de 50 años.");
        }

        // 2. Validar código promocional
        if (codigoPromo.trim().toUpperCase() === "FELICES50") {
            beneficios.push("Descuento del 10% de por vida aplicado.");
        }

        // 3. Validar Estudiante + Cumpleaños
        if (esCorreoInstitucional(correo) && esCumpleanos(fechaNacimiento)) {
            beneficios.push("¡Felicidades en tu día! Tienes una torta gratis por usar tu correo institucional.");
        }

        // Guardar el usuario en LocalStorage (Ahora incluimos el RUT)
        const usuario = {
            rut: rut,
            nombre: nombre,
            correo: correo,
            fechaNacimiento: fechaNacimiento,
            preferencia: "Sin preferencia", 
            beneficios: beneficios
        };

        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        
        mensajesDiv.innerHTML = `<div class="mensaje-exito">Registro exitoso. ¡Bienvenido ${nombre}!</div>`;
        
        // Pasar a la vista de perfil después de un breve tiempo
        setTimeout(() => {
            mostrarPerfil();
        }, 1500);
    });

    // --- LOGICA DE GESTIÓN DE PERFIL ---
    perfilForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        let usuarioData = JSON.parse(localStorage.getItem("usuarioActual"));
        const nuevoNombre = document.getElementById("perfil_nombre").value;
        const nuevaPreferencia = document.getElementById("perfil_preferencia").value;

        // Actualizar datos
        usuarioData.nombre = nuevoNombre;
        usuarioData.preferencia = nuevaPreferencia;
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioData));

        const perfilMensajes = document.getElementById("perfil-mensajes");
        perfilMensajes.innerHTML = `<div class="mensaje-exito">Preferencias de compra actualizadas correctamente.</div>`;
    });

    // Boton para cerrar sesión (Limpiar LocalStorage para pruebas)
    document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
        localStorage.removeItem("usuarioActual");
        registroForm.reset();
        document.getElementById("registro-mensajes").innerHTML = "";
        document.getElementById("perfil-mensajes").innerHTML = "";
        perfilSection.style.display = "none";
        registroSection.style.display = "block";
    });

    // --- FUNCIONES AUXILIARES ---
    function mostrarPerfil() {
        registroSection.style.display = "none";
        perfilSection.style.display = "block";

        const usuarioData = JSON.parse(localStorage.getItem("usuarioActual"));
        
        // Cargar datos en los inputs del perfil
        document.getElementById("perfil_nombre").value = usuarioData.nombre;
        document.getElementById("perfil_preferencia").value = usuarioData.preferencia;

        // Renderizar beneficios
        const listaBeneficios = document.getElementById("lista-beneficios");
        listaBeneficios.innerHTML = "";
        if (usuarioData.beneficios.length > 0) {
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
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function esCumpleanos(fecha) {
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        return hoy.getDate() === nacimiento.getDate() && hoy.getMonth() === nacimiento.getMonth();
    }

    function esCorreoInstitucional(correo) {
        return correo.endsWith("@duocuc.cl") || correo.endsWith("@duoc.cl") || correo.endsWith("@profesor.duoc.cl");
    }

    // Algoritmo Módulo 11 para validar RUT Chileno
    function validarRut(rut) {
        // Verifica que contenga solo números y termine en número o K
        if (!/^[0-9]+[-|‐]{0,1}[0-9kK]{1}$/.test(rut)) return false;
        
        // Verifica el largo (entre 7 y 9 caracteres sin contar guiones)
        if (rut.length < 7 || rut.length > 9) return false;

        let rutLimpio = rut.replace(/[^0-9kK]+/g, '').toUpperCase();
        let cuerpo = rutLimpio.slice(0, -1);
        let dv = rutLimpio.slice(-1);
        
        let suma = 0;
        let multiplo = 2;
        
        for (let i = 1; i <= cuerpo.length; i++) {
            let index = multiplo * rutLimpio.charAt(cuerpo.length - i);
            suma = suma + index;
            if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
        }
        
        let dvEsperado = 11 - (suma % 11);
        dvEsperado = (dvEsperado === 11) ? "0" : (dvEsperado === 10) ? "K" : dvEsperado.toString();
        
        return dv === dvEsperado;
    }
});