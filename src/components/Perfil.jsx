import React, { useState } from 'react';

export const Perfil = ({ usuario, onLogin, onLogout, onInvitado }) => {
  const [modo, setModo] = useState('registro'); // 'registro' | 'login'
  const [pestana, setPestana] = useState('datos'); // 'datos' | 'pedidos' | 'historial'

  // Estados para Registro e Iniciar Sesión
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  // Estados para Edición de Información Personal
  const [editNombre, setEditNombre] = useState(usuario?.nombre || '');
  const [editTelefono, setEditTelefono] = useState(usuario?.telefono || '');
  const [editDireccion, setEditDireccion] = useState(usuario?.direccion || '');
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');

  const handleSubmitAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    onLogin({
      nombre: modo === 'registro' ? (nombre || 'Usuario') : email.split('@')[0],
      email: email,
      rut: rut || '19011022K',
      fechaNacimiento: fechaNacimiento,
      esDuoc: email.toLowerCase().endsWith('@duocuc.cl'),
      esInvitado: false
    });
  };

  // =============================================================
  // VISTA DE PERFIL AUTENTICADO (CUANDO TIENE UNA CUENTA REGISTRADA)
  // =============================================================
  if (usuario && !usuario.esInvitado) {
    return (
      <section className="main-container">
        {/* ENCABEZADO PRINCIPAL DE LA SECCIÓN */}
        <div className="perfil-header-exact">
          <h2 className="titulo-perfil-script">Mi Cuenta y Compras</h2>
          <p className="subtitulo-perfil">
            Gestiona tu información personal, revisa tu carrito activo, haz seguimiento a tus envíos en tránsito y consulta tu historial.
          </p>
        </div>

        {/* LAYOUT DE 2 COLUMNAS (SIDEBAR + CONTENIDO) */}
        <div className="perfil-dashboard-grid">
          
          {/* COLUMNA IZQUIERDA: TARJETA DE PERFIL Y PESTAÑAS */}
          <div className="card-perfil-sidebar">
            <div className="avatar-circle-exact">👤</div>
            <h3 className="user-nombre-script">{usuario.nombre}</h3>
            <span className="badge-cliente-aniversario">Cliente Aniversario</span>
            <p className="user-email-text">{usuario.email}</p>

            <nav className="perfil-tabs-list">
              <button
                type="button"
                className={`btn-perfil-tab ${pestana === 'datos' ? 'active' : ''}`}
                onClick={() => setPestana('datos')}
              >
                📄 Datos Personales
              </button>

              <button
                type="button"
                className={`btn-perfil-tab ${pestana === 'pedidos' ? 'active' : ''}`}
                onClick={() => setPestana('pedidos')}
              >
                <span>🚚 Pedidos en Camino</span>
                <span className="badge-tab-num">0</span>
              </button>

              <button
                type="button"
                className={`btn-perfil-tab ${pestana === 'historial' ? 'active' : ''}`}
                onClick={() => setPestana('historial')}
              >
                📜 Historial de Compras
              </button>
            </nav>

            <hr className="divider-sidebar-dotted" />

            <button type="button" className="btn-cerrar-sesion-link" onClick={onLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>

          {/* COLUMNA DERECHA: PANEL PRINCIPAL CON EL FORMULARIO */}
          <div className="card-perfil-main">
            {pestana === 'datos' && (
              <div>
                <h3 className="subtitulo-seccion-serif">Información Personal</h3>
                <p className="desc-seccion-text">
                  Actualiza tus datos de contacto y clave de acceso.
                </p>

                <form className="form-info-personal" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-row-2col">
                    <div className="form-group-exact">
                      <label>Nombre Completo *</label>
                      <input
                        type="text"
                        value={editNombre || usuario.nombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                      />
                    </div>

                    <div className="form-group-exact">
                      <label>Teléfono de Contacto *</label>
                      <input
                        type="tel"
                        value={editTelefono}
                        onChange={(e) => setEditTelefono(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-exact">
                    <label>Correo Electrónico (Identificador Único)</label>
                    <input
                      type="email"
                      value={usuario.email}
                      readOnly
                      className="input-readonly"
                    />
                    <span className="form-hint-sub">
                      El correo no se puede modificar por motivos de seguridad.
                    </span>
                  </div>

                  <div className="form-group-exact">
                    <label>Dirección Predeterminada de Despacho</label>
                    <input
                      type="text"
                      placeholder="Ej. Av. Providencia 1234, Depto 502"
                      value={editDireccion}
                      onChange={(e) => setEditDireccion(e.target.value)}
                    />
                  </div>

                  <hr className="divider-modal-soft" style={{ margin: '25px 0' }} />

                  <h3 className="titulo-cambiar-pass-script">Cambiar Contraseña</h3>

                  <div className="form-row-2col">
                    <div className="form-group-exact">
                      <label>Contraseña Actual</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passActual}
                        onChange={(e) => setPassActual(e.target.value)}
                      />
                    </div>

                    <div className="form-group-exact">
                      <label>Nueva Contraseña</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passNueva}
                        onChange={(e) => setPassNueva(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-crear-cuenta" style={{ marginTop: '18px', maxWidth: '220px' }}>
                    Guardar Cambios
                  </button>
                </form>
              </div>
            )}

            {pestana === 'pedidos' && (
              <div>
                <h3 className="subtitulo-seccion-serif">Pedidos en Camino</h3>
                <p className="desc-seccion-text">Aquí verás los pedidos que actualmente están siendo preparados o enviados.</p>
                <div className="box-vacio-perfil">
                  No tienes pedidos activos en tránsito en este momento.
                </div>
              </div>
            )}

            {pestana === 'historial' && (
              <div>
                <h3 className="subtitulo-seccion-serif">Historial de Compras</h3>
                <p className="desc-seccion-text">Revisa las compras y boletas que has realizado previamente.</p>
                <div className="box-vacio-perfil">
                  Aún no registras compras pasadas en tu cuenta.
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    );
  }

  // =============================================================
  // VISTA FORMULARIO DE ACCESO / REGISTRO (SI ES INVITADO O NO AUTENTICADO)
  // =============================================================
  return (
    <div className="main-container">
      <div className="form-card-exact">
        <div className="form-header-exact">
          <h2 className="title-crea-cuenta">
            {modo === 'registro' ? 'CREA TU CUENTA EN' : 'INICIA SESIÓN EN'}
          </h2>
          <div className="title-mil-sabores">Mil Sabores</div>
          <p className="subtitle-50">
            {modo === 'registro' 
              ? 'Forma parte del 50° Aniversario y accede a promociones exclusivas'
              : 'Accede a tu cuenta para hacer tu proceso de compra más rápido'}
          </p>
        </div>

        <form className="auth-form-exact" onSubmit={handleSubmitAuth}>
          {modo === 'registro' && (
            <>
              <div className="form-group-exact">
                <label>RUT (Sin puntos ni guión)</label>
                <input 
                  type="text" 
                  placeholder="Ej: 19011022K" 
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group-exact">
                <label>NOMBRE COMPLETO</label>
                <input 
                  type="text" 
                  placeholder="Tu nombre y apellido" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group-exact">
            <label>E-MAIL</label>
            <input 
              type="email" 
              placeholder="ejemplo@duocuc.cl" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group-exact">
            <label>CONTRASENA</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {modo === 'registro' && (
            <div className="form-group-exact">
              <label>FECHA DE NACIMIENTO</label>
              <input 
                type="date" 
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required 
              />
            </div>
          )}

          <button type="submit" className="btn-crear-cuenta">
            {modo === 'registro' ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <hr className="divider-exact" />

        <div className="switch-section-exact">
          <h3 className="title-ya-tienes">
            {modo === 'registro' ? '¿ya tienes cuenta?' : '¿no tienes cuenta?'}
          </h3>
          <p className="subtitle-switch">
            {modo === 'registro' 
              ? 'Inicia sesión para hacer tu proceso de compra más rápido.'
              : 'Crea tu cuenta para acceder a ofertas y beneficios.'}
          </p>
          <button
            type="button"
            className="btn-iniciar-sesion-outline"
            onClick={() => setModo(modo === 'registro' ? 'login' : 'registro')}
          >
            {modo === 'registro' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
          </button>
        </div>

        {/* SECCIÓN CONTINUAR COMO INVITADO */}
        {onInvitado && (
          <div className="invitado-section-exact">
            <p className="subtitle-invitado">
              ¿Solo quieres mirar? Puedes comprar sin crear cuenta.
            </p>
            <button
              type="button"
              className="btn-invitado-beige"
              onClick={onInvitado}
            >
              CONTINUAR COMO INVITADO
            </button>
          </div>
        )}

      </div>
    </div>
  );
};