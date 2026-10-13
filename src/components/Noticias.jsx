import React from 'react';

export const Noticias = () => {
  const noticias = [
    {
      id: 1,
      badge: '50 Aniversario',
      badgeClass: 'badge-aniversario',
      imagen: 'https://tse4.mm.bing.net/th/id/OIP.--s6qLaqNRCfmIIut4japQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      alt: 'Edición Especial 50 Años',
      fecha: '12 Octubre, 2026',
      autor: 'Por: Maestros Pasteleros',
      titulo: 'Lanzamiento Colección "Recetas de Antaño"',
      extracto: 'Revivimos los sabores icónicos de 1976. Descubre la Torta Holandesa Clásica y los Merengues de Lúcuma preparados con la receta original de la abuela.'
    },
    {
      id: 2,
      badge: 'Convenio Académico',
      badgeClass: 'badge-convenio',
      imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      alt: 'Convenio Duoc UC',
      fecha: '28 Septiembre, 2026',
      autor: 'Por: Comunidad Mil Sabores',
      titulo: 'Beneficio Exclusivo para Alumnos Duoc UC',
      extracto: (
        <>
          Al registrarte con tu correo institucional (<code>@duocuc.cl</code>), obtendrás un descuento especial en tus pedidos de cumpleaños durante todo el año escolar.
        </>
      )
    },
    {
      id: 3,
      badge: 'Masterclass',
      badgeClass: 'badge-taller',
      imagen: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80',
      alt: 'Masterclass Repostería',
      fecha: '15 Agosto, 2026',
      autor: 'Por: Chef Ejecutivo',
      titulo: 'Taller Abierto: Secretos del Hojaldre Artesanal',
      extracto: 'Abrimos las puertas de nuestro taller en Providencia para enseñarle a la comunidad los secretos para lograr mil hojas crujientes y perfectas.'
    }
  ];

  return (
    <section className="seccion-noticias">
      <div className="noticias-header">
        <span className="badge-subtitulo">Novedades y Eventos</span>
        <h2 className="titulo-seccion">Noticias de Mil Sabores</h2>
        <p className="descripcion-seccion">Entérate de nuestros últimos lanzamientos, actividades y descuentos exclusivos.</p>
      </div>

      <div className="noticias-grid">
        {noticias.map(n => (
          <article key={n.id} className="noticia-card">
            <div className="noticia-imagen">
              <span className={`noticia-badge ${n.badgeClass}`}>{n.badge}</span>
              <img src={n.imagen} alt={n.alt} />
            </div>
            <div className="noticia-contenido">
              <div className="noticia-meta">
                <span className="noticia-fecha">📅 {n.fecha}</span>
                <span className="noticia-autor">{n.autor}</span>
              </div>
              <h3 className="noticia-titulo">{n.titulo}</h3>
              <p className="noticia-extracto">{n.extracto}</p>
              <a href="#noticias" className="btn-leer-mas">Leer noticia completa ➔</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};