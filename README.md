# Proyecto-Pasteleria-Duoc-UC
Evaluacion Parcial 1 HTML sobre una pastelería

<img width="407" height="140" alt="image" src="https://github.com/user-attachments/assets/6859941b-f920-4bfb-80fb-921354ccd971" />

Avances: Módulo de Registro y Autenticación

Se implementó toda la vista y lógica para la creación de cuentas de clientes y la gestión de sus perfiles, cumpliendo con las reglas de negocio de Pastelería Mil Sabores.

registro.html: Maquetación semántica del formulario de creación de cuenta y la vista interna del perfil (esta última aparece dinámicamente al iniciar sesión).

registro.css: Aplicación del diseño visual basado en el mockup, utilizando la paleta de colores corporativa (crema, rosa suave y chocolate).

registro.js: Integración de localStorage para simular el almacenamiento de datos del cliente sin necesidad de base de datos. Se incluyeron las siguientes validaciones en JavaScript:

Validación matemática real del RUT chileno mediante el algoritmo Módulo 11 (bloquea el formulario si el formato o dígito verificador son incorrectos).

Cálculo de edad dinámico con la fecha de nacimiento para asignar automáticamente el 50% de descuento a usuarios mayores de 50 años.

Validación del código promocional estático "FELICES50".

Filtro de dominio para detectar correos institucionales de Duoc UC, cruzado con la validación de la fecha de cumpleaños actual para habilitar la promoción de la torta gratis.
