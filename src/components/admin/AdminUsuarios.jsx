import { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Alert, Badge } from 'react-bootstrap';
import { obtenerUsuarios as obtenerUsuariosLocales, registrarUsuario, actualizarUsuario, eliminarUsuario } from '../../data/db';
import { obtenerPedidosPorEmail } from '../../data/pedidosDB';
import usuarioService from '../../services/UsuarioService';
import { UsuarioForm } from './UsuarioForm';

function normalizarUsuarioLista(u) {
  return {
    ...u,
    rol: (u.rol || 'cliente').toLowerCase(),
    nombre: [u.nombre, u.apellido].filter(Boolean).join(' ').trim() || u.nombre
  };
}

// Administración de usuarios: conectado al backend con respaldo local
export const AdminUsuarios = ({ usuarioActual }) => {
  const [usuarios, setUsuarios] = useState(() => obtenerUsuariosLocales());
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }

  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioHistorial, setUsuarioHistorial] = useState(null);

  const cargarUsuarios = async () => {
    if (localStorage.getItem('token_mil_sabores')) {
      const remotos = await usuarioService.obtenerTodos();
      if (Array.isArray(remotos) && remotos.length > 0) {
        setUsuarios(remotos.map(normalizarUsuarioLista));
        return;
      }
    }
    setUsuarios(obtenerUsuariosLocales());
  };

  useEffect(() => {
    let activo = true;
    if (localStorage.getItem('token_mil_sabores')) {
      usuarioService.obtenerTodos().then((remotos) => {
        if (activo && Array.isArray(remotos) && remotos.length > 0) {
          setUsuarios(remotos.map(normalizarUsuarioLista));
        }
      });
    }
    return () => {
      activo = false;
    };
  }, []);

  const abrirNuevo = () => {
    setUsuarioEditando(null);
    setMostrarForm(true);
  };

  const abrirEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarForm(true);
  };

  // Crea o actualiza; si hay error lo devuelve para que el formulario lo muestre
  const handleGuardar = async (datos) => {
    let res;
    const tieneToken = Boolean(localStorage.getItem('token_mil_sabores'));

    if (usuarioEditando) {
      if (tieneToken && usuarioEditando.id) {
        const partes = (datos.nombre || '').trim().split(/\s+/);
        const cambios = {
          nombre: partes[0] || datos.nombre,
          apellido: partes.slice(1).join(' ') || usuarioEditando.apellido || 'Usuario',
          telefono: datos.telefono
        };
        if (datos.password) cambios.password = datos.password;
        res = await usuarioService.actualizar(usuarioEditando.id, cambios);
      } else {
        const cambios = { nombre: datos.nombre, telefono: datos.telefono, direccion: datos.direccion };
        if (datos.password) cambios.password = datos.password;
        res = actualizarUsuario(usuarioEditando.email, cambios);
      }
    } else if (tieneToken) {
      const partes = (datos.nombre || '').trim().split(/\s+/);
      res = await usuarioService.registrar({
        ...datos,
        nombre: partes[0] || datos.nombre,
        apellido: partes.slice(1).join(' ') || 'Usuario',
        fechaNacimiento: datos.fechaNacimiento || '1995-01-01'
      });
    } else {
      res = registrarUsuario(datos);
    }

    if (!res.ok) return res.error;

    await cargarUsuarios();
    setMostrarForm(false);
    setMensaje({
      tipo: 'success',
      texto: usuarioEditando ? `Usuario "${res.usuario.nombre}" actualizado.` : `Usuario "${res.usuario.nombre}" creado.`
    });
    return null;
  };

  const handleEliminar = async (usuario) => {
    // No permitir que el administrador se elimine a sí mismo
    if (usuario.email === usuarioActual?.email) {
      setMensaje({ tipo: 'danger', texto: 'No puedes eliminar tu propia cuenta mientras estás conectado.' });
      return;
    }

    if (!window.confirm(`¿Eliminar al usuario "${usuario.nombre}"?`)) return;

    const tieneToken = Boolean(localStorage.getItem('token_mil_sabores'));
    const res = tieneToken && usuario.id
      ? await usuarioService.eliminar(usuario.id)
      : eliminarUsuario(usuario.email);

    if (res.ok) {
      await cargarUsuarios();
      setMensaje({ tipo: 'success', texto: `Usuario "${usuario.nombre}" eliminado.` });
    } else {
      setMensaje({ tipo: 'danger', texto: res.error });
    }
  };

  // Compras del usuario elegido para la ventana de historial
  const historial = usuarioHistorial ? obtenerPedidosPorEmail(usuarioHistorial.email) : [];

  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h4 className="mb-0">Usuarios ({usuarios.length})</h4>
          <Button variant="primary" size="sm" onClick={abrirNuevo}>+ Nuevo usuario</Button>
        </div>

        {mensaje && (
          <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
            {mensaje.texto}
          </Alert>
        )}

        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Correo</th>
              <th>Beneficio</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.email}>
                <td>
                  {u.nombre} {u.rol === 'admin' && <Badge bg="dark">Admin</Badge>}
                </td>
                <td className="text-nowrap">{u.rut}</td>
                <td>{u.email}</td>
                <td>
                  {u.porcentajeDescuento > 0 && <Badge bg="success" className="me-1">{u.porcentajeDescuento} %</Badge>}
                  {u.tortaGratisDuoc && <Badge bg="info" text="dark">Torta Duoc</Badge>}
                </td>
                <td className="text-end text-nowrap">
                  <Button variant="secondary" size="sm" className="me-2" onClick={() => setUsuarioHistorial(u)}>Historial</Button>
                  <Button variant="secondary" size="sm" className="me-2" onClick={() => abrirEditar(u)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleEliminar(u)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      {/* VENTANA CON EL FORMULARIO (NUEVO / EDITAR) */}
      <Modal show={mostrarForm} onHide={() => setMostrarForm(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UsuarioForm
            key={usuarioEditando?.email || 'nuevo'}
            usuarioInicial={usuarioEditando}
            onGuardar={handleGuardar}
            onCancelar={() => setMostrarForm(false)}
          />
        </Modal.Body>
      </Modal>

      {/* VENTANA CON EL HISTORIAL DE COMPRAS */}
      <Modal show={!!usuarioHistorial} onHide={() => setUsuarioHistorial(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Historial de {usuarioHistorial?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {historial.length === 0 ? (
            <p className="text-muted mb-0">Este usuario todavía no tiene compras.</p>
          ) : (
            <Table responsive size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th className="text-end">Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((p) => (
                  <tr key={p.codigoSeguimiento}>
                    <td>{String(p.folio).padStart(6, '0')}</td>
                    <td>{new Date(p.fecha).toLocaleDateString('es-CL')}</td>
                    <td>{p.items.map((it) => `${it.cantidad}x ${it.nombre}`).join(', ')}</td>
                    <td className="text-end">${(p.totalPagar || 0).toLocaleString('es-CL')}</td>
                    <td>{p.estadoNombre}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};
