import React from 'react';

export const Historia = () => {
  return (
    <section className="seccion-historia-contenedor">
      <div className="card-historia-caja">
        <div className="historia-grid">
          {/* Columna Izquierda: Textos e hitos */}
          <div className="historia-col-izq">
            <span className="badge-epoca">📜 HITO HISTÓRICO • 1995</span>
            <h2 className="titulo-nostalgico">Nuestra Historia de Tradición</h2>
            <p className="parrafo-destacado">
              En <strong>1995</strong>, Pastelería Mil Sabores hizo historia al colaborar en la elaboración de la <em>torta más grande del mundo</em>, un logro certificado por el <strong>Libro Guinness</strong> que selló nuestro nombre en la repostería nacional.
            </p>
            <p className="parrafo-cuerpo">
              Tres décadas después, esa misma pastelería que desafió los límites artesanales se renueva. Adaptamos nuestra plataforma digital para brindarte una compra rápida y moderna, manteniendo intactas las recetas familiares y el amor de siempre.
            </p>

            <div className="hitos-contador">
              <div className="hito-item">
                <span className="hito-numero">1995</span>
                <span className="hito-etiqueta">RÉCORD GUINNESS</span>
              </div>
              <div className="hito-separador"></div>
              <div className="hito-item">
                <span className="hito-numero">+30</span>
                <span className="hito-etiqueta">AÑOS DE RECETA</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Foto Polaroid */}
          <div className="historia-col-der">
            <div className="polaroid-frame">
              <div className="sello-guinness">OFICIAL GUINNESS</div>
              <div className="polaroid-foto">
                <img src="/images/torta-cuadrada-chocolate.jpg" alt="Torta Récord Guinness 1995" />
              </div>
              <p className="polaroid-pie">Santiago, Chile – 1995</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};