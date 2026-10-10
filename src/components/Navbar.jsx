import React from 'react';

export const Navbar = ({ usuario, carritoCount, onOpenCarrito, vistaActual, setVistaActual }) => {
  const esInvitado = usuario?.esInvitado;

  return (
    <header className="navbar-exacta">
      <div className="nav-container">
        <a 
          href="#inicio" 
          className="brand-wrapper" 
          onClick={(e) => { e.preventDefault(); setVistaActual('inicio'); }}
        >
          <div className="brand-box">
            <h1 className="brand-logo-text">Mil Sabores</h1>
            <span className="brand-subtext">50 ANIVERSARIO</span>
          </div>
        </a>

        <nav>
          <ul className="nav-links">
            <li>
              <button 
                type="button"
                className={`nav-btn-exact ${vistaActual === 'inicio' ? 'active' : ''}`}
                onClick={() => setVistaActual('inicio')}
              >
                Inicio
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-btn-exact ${vistaActual === 'catalogo' ? 'active' : ''}`}
                onClick={() => setVistaActual('catalogo')}
              >
                Catálogo
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-btn-exact ${vistaActual === 'seguimiento' ? 'active' : ''}`}
                onClick={() => setVistaActual('seguimiento')}
              >
                Seguimiento
              </button>
            </li>
            
            <li>
              <button 
                type="button"
                className={`nav-btn-exact ${vistaActual === 'perfil' ? 'active' : ''}`}
                onClick={() => setVistaActual('perfil')}
              >
                {esInvitado ? 'Registrate' : 'Mi perfil'}
              </button>
            </li>

            <li>
              <button 
                type="button"
                className="nav-carrito-badge-btn" 
                onClick={onOpenCarrito}
                title="Ver carrito de compras"
              >
                🛒 <span className="carrito-badge-num">{carritoCount}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};