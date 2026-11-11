import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import usuarioService from '../services/UsuarioService';

vi.mock('axios');

describe('Pruebas Unitarias - Servicio HTTP de Usuarios (Axios)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debe registrar un usuario enviando un POST a /api/usuarios/registro', async () => {
    const usuarioMock = {
      id: 1,
      rut: '20.123.456-7',
      nombre: 'Fernando',
      apellido: 'Barra',
      email: 'f.barra@alumnos.duoc.cl'
    };

    axios.post.mockResolvedValueOnce({ data: usuarioMock });

    const resultado = await usuarioService.registrar(usuarioMock);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/usuarios/registro', expect.objectContaining({
      nombre: 'Fernando',
      email: 'f.barra@alumnos.duoc.cl'
    }));
    expect(resultado).toEqual({ ok: true, usuario: usuarioMock });
  });

  it('Debe iniciar sesión enviando un POST a /api/v1/usuarios/login con email y password', async () => {
    const credencialesMock = { email: 'f.barra@alumnos.duoc.cl', password: 'password123' };
    const respuestaMock = { token: 'jwt.token.valido', usuario: { id: 1, email: credencialesMock.email, nombre: 'Fernando', rol: 'cliente' } };

    axios.post.mockResolvedValueOnce({ data: respuestaMock });

    const resultado = await usuarioService.login(credencialesMock.email, credencialesMock.password);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/v1/usuarios/login', credencialesMock);
    expect(resultado.usuario.nombre).toEqual('Fernando');
  });

  it('Debe consultar beneficios comerciales en /api/v1/usuarios/:id/beneficios', async () => {
    const beneficiosMock = {
      usuarioId: 1,
      descuentoPorcentaje: 50,
      motivoDescuento: 'Beneficio 50 aniversario: Cliente con 50 años o más'
    };

    axios.get.mockResolvedValueOnce({ data: beneficiosMock });

    const resultado = await usuarioService.obtenerBeneficios(1, 'FELICES50');

    expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/usuarios/1/beneficios?cupon=FELICES50');
    expect(resultado.descuentoPorcentaje).toBe(50);
  });
});
