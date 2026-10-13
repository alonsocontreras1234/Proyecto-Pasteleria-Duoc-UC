import { useState } from 'react';
import { Card, Table, Button, Modal, Alert, Badge } from 'react-bootstrap';
import { obtenerUsuarios, registrarUsuario, actualizarUsuario, eliminarUsuario } from '../../data/db';
import { obtenerPedidosPorEmail } from '../../data/pedidosDB';
import { UsuarioForm } from './UsuarioForm';

//Administración de usuarios: listar, crear, editar, eliminar y ver su historial de compras
//Usa el CRUD de data/db.js
export const AdminUsuarios = ({ usuarioActual }) => {
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto }

  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioHistorial, setUsuarioHistorial] = useState(null);

  const abrirNuevo = () => {
    setUsuarioEditando(null);
    setMostrarForm(true);
  };

  const abrirEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarForm(true);
  };

  // Crea o actualiza; si hay error lo devuelve para que el formulario lo muestre
  const handleGuardar = (datos) => {
    let res;

    if (usuarioEditando) {
      const cambios = { nombre: datos.nombre, telefono: datos.telefono, direccion: datos.direccion };
      if (datos.password) cambios.password = datos.password;
      res = actualizarUsuario(usuarioEditando.email, cambios);
    } else {
      res = registrarUsuario(datos);
    }

    if (!res.ok) return res.error;

    setUsuarios(obtenerUsuarios());
    setMostrarForm(false);
    setMensaje({
      tipo: 'success',
      texto: usuarioEditando ? `Usuario "${res.usuario.nombre}" actualizado.` : `Usuario "${res.usuario.nombre}" creado.`
    });
    return null;
  };

  const handleEliminar = (usuario) => {
    // No permitir que el administrador se elimine a sí mismo
    if (usuario.email === usuarioActual?.email) {
      setMensaje({ tipo: 'danger', texto: 'No puedes eliminar tu propia cuenta mientras estás conectado.' });
      return;
    }

    if (!window.confirm(`¿Eliminar al usuario "${usuario.nombre}"?`)) return;

    const res = eliminarUsuario(usuario.email);
    if (res.ok) {
      setUsuarios(obtenerUsuarios());
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
