//Simulación de Base de Datos para Usuarios utilizando localStorage
//Pastelería Mil Sabores
import { validarRut, validarEmail, calcularBeneficios } from '../utils/validations';
import { normalizarEmail, limpiarRut, leerLista, guardarLista } from '../utils/storage';

const STORAGE_KEY = 'usuarios_mil_sabores';

// Usuario demo institucional por defecto para pruebas y evaluación
const USUARIO_DEMO_INICIAL = [
  {
    rut: '19.876.543-0',
    nombre: 'Fernando Barra',
    email: 'f.barra@alumnos.duoc.cl',
    password: 'admin',
    fechaNacimiento: '1998-05-15',
    telefono: '+56 9 8765 4321',
    direccion: 'Av. Providencia 1234, Depto 502',
    porcentajeDescuento: 0,
    tortaGratisDuoc: true,
    beneficios: ['Torta gratis en tu cumpleaños (Estudiante Duoc UC)']
  },
  {
    rut: '22.163.627-9',
    nombre: 'Magdalena Zúñiga',
    email: 'magd.zuniga@duocuc.cl',
    password: '1234',
    fechaNacimiento: '2001-08-20',
    telefono: '+56 9 2882 1422',
    direccion: 'Providencia 456',
    porcentajeDescuento: 0,
    tortaGratisDuoc: true,
    beneficios: ['Torta gratis en tu cumpleaños (Estudiante Duoc UC)']
  },

  {
    rut: '21.991.878-K',
    nombre: 'Benjamin Montanares',
    email: 'be.montanares@duocuc.cl',
    password: 'probando',
    fechaNacimiento: '2003-12-20',
    telefono: '+56 9 2712 1412',
    direccion: 'Blanco Encada 377',
    porcentajeDescuento: 0,
    tortaGratisDuoc: true,
    beneficios: ['Torta gratis en tu cumpleaños (Estudiante Duoc UC)']
  },

  // Cuenta de administrador (entra al Panel de Administración)
  {
    rut: '15.432.876-9',
    nombre: 'Administrador Mil Sabores',
    email: 'admin@milsabores.cl',
    password: 'admin1234',
    fechaNacimiento: '1990-01-01',
    telefono: '+56 2 2345 6789',
    direccion: 'Av. Providencia 1234, Providencia',
    porcentajeDescuento: 0,
    tortaGratisDuoc: false,
    beneficios: [],
    rol: 'admin'
  }
];

//Obtiene la lista completa de usuarios registrados desde localStorage
//(si falta alguna cuenta demo, como la del administrador, la agrega)
export const obtenerUsuarios = () => leerLista(STORAGE_KEY, USUARIO_DEMO_INICIAL, 'email');

//Guarda la lista de usuarios en localStorage
export const guardarUsuarios = (usuarios) => guardarLista(STORAGE_KEY, usuarios);

//Registra un nuevo usuario con validaciones estrictas y cálculo de beneficios
export const registrarUsuario = ({
  rut,
  nombre,
  email,
  password,
  fechaNacimiento,
  codigoPromo = '',
  telefono = '',
  direccion = ''
}) => {
  // 1. Validación de campos obligatorios
  if (!nombre || !nombre.trim()) {
    return { ok: false, error: 'Debe ingresar su nombre completo.' };
  }

  // 2. Validación de RUT
  if (!validarRut(rut)) {
    return {
      ok: false,
      error: 'El RUT ingresado no es válido. Verifique el formato y dígito verificador (no se aceptan números falsos o repetidos).'
    };
  }

  // 3. Validación de Correo
  if (!validarEmail(email)) {
    return { ok: false, error: 'Debe ingresar un correo electrónico válido.' };
  }

  // 4. Validación de Contraseña
  if (!password || password.length < 4) {
    return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  // 5. Validación de Fecha de Nacimiento
  if (!fechaNacimiento) {
    return { ok: false, error: 'Debe ingresar su fecha de nacimiento.' };
  }

  // 6. Verificar duplicados en la base de datos
  const usuarios = obtenerUsuarios();
  const emailLimpio = normalizarEmail(email);
  const rutLimpio = limpiarRut(rut);

  const existeEmail = usuarios.some((u) => normalizarEmail(u.email) === emailLimpio);
  if (existeEmail) {
    return { ok: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
  }

  const existeRut = usuarios.some((u) => limpiarRut(u.rut) === rutLimpio);
  if (existeRut) {
    return { ok: false, error: 'Ya existe una cuenta registrada con este RUT.' };
  }

  // 7. Calcular beneficios y descuentos
  const beneficiosCalculados = calcularBeneficios({
    fechaNacimiento,
    email: emailLimpio,
    codigoPromo
  });

  const nuevoUsuario = {
    rut: rut.trim(),
    nombre: nombre.trim(),
    email: emailLimpio,
    password, // En producción se aplicaría un hash criptográfico
    fechaNacimiento,
    codigoPromo: codigoPromo ? codigoPromo.trim().toUpperCase() : '',
    telefono: telefono.trim(),
    direccion: direccion.trim(),
    porcentajeDescuento: beneficiosCalculados.porcentajeDescuento,
    tortaGratisDuoc: beneficiosCalculados.tortaGratisDuoc,
    beneficios: beneficiosCalculados.detalles,
    esInvitado: false
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  return { ok: true, usuario: nuevoUsuario };
};

//Autentica las credenciales de un usuario contra la base de datos simulada
export const iniciarSesion = (email, password) => {
  if (!email || !password) {
    return { ok: false, error: 'Debe ingresar su correo electrónico y contraseña.' };
  }

  const emailLimpio = normalizarEmail(email);

  const usuarioEncontrado = obtenerUsuarios().find(
    (u) => normalizarEmail(u.email) === emailLimpio && u.password === password
  );

  if (!usuarioEncontrado) {
    return {
      ok: false,
      error: 'Correo o contraseña incorrectos. Usuario no registrado o credenciales erróneas.'
    };
  }

  return { ok: true, usuario: usuarioEncontrado };
};

//Busca un usuario por su correo (sin importar mayúsculas)
//Devuelve el usuario o null si no existe
export const obtenerUsuarioPorEmail = (email) => {
  const emailLimpio = normalizarEmail(email);
  if (!emailLimpio) return null;
  return obtenerUsuarios().find((u) => normalizarEmail(u.email) === emailLimpio) || null;
};

//Elimina un usuario de la base de datos por su correo
export const eliminarUsuario = (email) => {
  const usuarios = obtenerUsuarios();
  const emailLimpio = normalizarEmail(email);
  const restantes = usuarios.filter((u) => normalizarEmail(u.email) !== emailLimpio);

  if (restantes.length === usuarios.length) {
    return { ok: false, error: 'Usuario no encontrado en la base de datos.' };
  }

  guardarUsuarios(restantes);
  return { ok: true };
};

//Actualiza los datos personales de un usuario existente
//Revisa los datos nuevos igual que el registro (correo, RUT, nombre y contraseña)
export const actualizarUsuario = (email, datosActualizados = {}) => {
  const usuarios = obtenerUsuarios();
  const emailLimpio = normalizarEmail(email);
  const indice = usuarios.findIndex((u) => normalizarEmail(u.email) === emailLimpio);

  if (!emailLimpio || indice === -1) {
    return { ok: false, error: 'Usuario no encontrado en la base de datos.' };
  }

  const cambios = { ...datosActualizados };

  // Validar el nombre si se cambia
  if (cambios.nombre !== undefined && !cambios.nombre.trim()) {
    return { ok: false, error: 'Debe ingresar su nombre completo.' };
  }

  // Validar la contraseña si se cambia
  if (cambios.password !== undefined && cambios.password.length < 4) {
    return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  // Validar el correo si se cambia, y que no lo use otra cuenta
  if (cambios.email !== undefined) {
    if (!validarEmail(cambios.email)) {
      return { ok: false, error: 'Debe ingresar un correo electrónico válido.' };
    }
    cambios.email = normalizarEmail(cambios.email);
    const correoOcupado = usuarios.some((u, i) => i !== indice && normalizarEmail(u.email) === cambios.email);
    if (correoOcupado) {
      return { ok: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }
  }

  // Validar el RUT si se cambia, y que no lo use otra cuenta
  if (cambios.rut !== undefined) {
    if (!validarRut(cambios.rut)) {
      return { ok: false, error: 'El RUT ingresado no es válido.' };
    }
    const rutOcupado = usuarios.some((u, i) => i !== indice && limpiarRut(u.rut) === limpiarRut(cambios.rut));
    if (rutOcupado) {
      return { ok: false, error: 'Ya existe una cuenta registrada con este RUT.' };
    }
  }

  usuarios[indice] = { ...usuarios[indice], ...cambios };
  guardarUsuarios(usuarios);

  return { ok: true, usuario: usuarios[indice] };
};
