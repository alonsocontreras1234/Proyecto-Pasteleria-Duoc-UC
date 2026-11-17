import axios from 'axios';
import { 
    obtenerProductos as obtenerLocales, 
    crearProducto as crearLocal,
    actualizarProducto as actualizarLocal,
    eliminarProducto as eliminarLocal 
} from '../data/productosDB';

const API_URL = 'http://localhost:8080/api/v1/productos';

// Función para obtener el token que ya guarda UsuarioService
const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token_mil_sabores')}` }
});

export const obtenerProductos = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        console.warn("Usando datos locales (Backend apagado o en test)");
        return obtenerLocales();
    }
};

export const crearProducto = async (producto) => {
    try {
        const res = await axios.post(API_URL, producto, getAuthHeaders());
        return res.data;
    } catch (error) {
        if (error.code === 'ERR_NETWORK') return crearLocal(producto);
        throw error;
    }
};

export const actualizarProducto = async (id, producto) => {
    try {
        const res = await axios.put(`${API_URL}/${id}`, producto, getAuthHeaders());
        return res.data;
    } catch (error) {
        if (error.code === 'ERR_NETWORK') return actualizarLocal(id, producto);
        throw error;
    }
};

export const eliminarProducto = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return id;
    } catch (error) {
        if (error.code === 'ERR_NETWORK') return eliminarLocal(id);
        throw error;
    }
};