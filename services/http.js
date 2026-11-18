import axios from 'axios';

/**
 * Cliente HTTP centralizado del frontend.
 * La URL base se configura en el archivo .env (VITE_API_URL).
 * Si no existe, se usa http://localhost:8080 por defecto.
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// El backend integrado protege pedidos, detalles y usuarios con JWT.
// El token se guarda al iniciar sesión (UsuarioService) y aquí se adjunta
// automáticamente a cada petición. Las rutas públicas (productos, login,
// registro) ignoran la cabecera.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_mil_sabores');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
