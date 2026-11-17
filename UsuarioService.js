import axios from 'axios';

/**
 * Servicio de comunicación HTTP cliente (Axios) para la API RESTful de Usuarios.
 * Conecta el frontend React con el backend Spring Boot en http://localhost:8080.
 * Conforme al estándar de la Guía 3.2.2 de DSY1104.
 */
const BASE_URL = 'http://localhost:8080/api/v1/usuarios';

// Interceptor para inyectar token JWT automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_mil_sabores');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class UsuarioService {
  async registrar(usuario) {
    try {
      const response = await axios.post(`${BASE_URL}/registro`, usuario);
      return { ok: true, usuario: response.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || 'Error al registrar' };
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      const { token, usuario } = response.data;
      localStorage.setItem('token_mil_sabores', token);
      // Normalizar rol a minúsculas para compatibilidad con código existente
      const usuarioNormalizado = { ...usuario, rol: usuario.rol.toLowerCase() };
      return { ok: true, usuario: usuarioNormalizado };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || 'Error en autenticación' };
    }
  }

  logout() {
    localStorage.removeItem('token_mil_sabores');
  }

  async obtenerTodos() {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (err) {
      return [];
    }
  }

  async obtenerPorId(id) {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async obtenerBeneficios(id, cupon = '') {
    try {
      const url = cupon ? `${BASE_URL}/${id}/beneficios?cupon=${encodeURIComponent(cupon)}` : `${BASE_URL}/${id}/beneficios`;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async actualizar(id, datos) {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, datos);
      return { ok: true, usuario: response.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || 'Error al actualizar' };
    }
  }

  async eliminar(id) {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'Error al eliminar' };
    }
  }
}

export default new UsuarioService();
