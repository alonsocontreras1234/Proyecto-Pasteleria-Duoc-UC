/**
 * Simulación de Base de Datos para Usuarios utilizando localStorage
 * Pastelería Mil Sabores
 */
import { validarRut, validarEmail, calcularBeneficios } from './validations';

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
  }

  
 
];

/**
 * Obtiene la lista completa de usuarios registrados desde localStorage
 */
export const obtenerUsuarios = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(USUARIO_DEMO_INICIAL));
      return USUARIO_DEMO_INICIAL;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer usuarios de localStorage:', err);
    return USUARIO_DEMO_INICIAL;
  }
};

/**
 * Guarda la lista de usuarios en localStorage
 */
export const guardarUsuarios = (usuarios) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
  } catch (err) {
    console.error('Error al guardar usuarios en localStorage:', err);
  }
};

/**
 * Registra un nuevo usuario con validaciones estrictas y cálculo de beneficios
 */
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
  const emailLimpio = email.trim().toLowerCase();
  const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  const existeEmail = usuarios.some((u) => u.email.trim().toLowerCase() === emailLimpio);
  if (existeEmail) {
    return { ok: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
  }

  const existeRut = usuarios.some((u) => u.rut.replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio);
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

/**
 * Autentica las credenciales de un usuario contra la base de datos simulada
 */
export const iniciarSesion = (email, password) => {
  if (!email || !password) {
    return { ok: false, error: 'Debe ingresar su correo electrónico y contraseña.' };
  }

  const usuarios = obtenerUsuarios();
  const emailLimpio = email.trim().toLowerCase();

  const usuarioEncontrado = usuarios.find(
    (u) => u.email.trim().toLowerCase() === emailLimpio && u.password === password
  );

  if (!usuarioEncontrado) {
    return {
      ok: false,
      error: 'Correo o contraseña incorrectos. Usuario no registrado o credenciales erróneas.'
    };
  }

  return { ok: true, usuario: usuarioEncontrado };
};

/**
 * Actualiza los datos personales de un usuario existente
 */
export const actualizarUsuario = (email, datosActualizados) => {
  const usuarios = obtenerUsuarios();
  const emailLimpio = email.trim().toLowerCase();
  const indice = usuarios.findIndex((u) => u.email.trim().toLowerCase() === emailLimpio);

  if (indice === -1) {
    return { ok: false, error: 'Usuario no encontrado en la base de datos.' };
  }

  usuarios[indice] = { ...usuarios[indice], ...datosActualizados };
  guardarUsuarios(usuarios);

  return { ok: true, usuario: usuarios[indice] };
};
