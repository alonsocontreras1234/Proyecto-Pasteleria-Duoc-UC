import React, { useState, useEffect } from 'react';
import { productos } from '../data/productos';
import { ProductoModal } from './ProductoModal';

export const NuestrosPasteles = ({ onAgregarAlCarrito }) => {
  const [indiceActual, setIndiceActual] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const TARJETAS_VISIBLES = 4;

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % productos.length);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev === 0 ? productos.length - 1 : prev - 1));
  };

  // Pausar rotación si el mouse está encima o si hay un modal abierto
  useEffect(() => {
    if (estaPausado || productoSeleccionado) return;

    const intervalo = setInterval(() => {
      siguiente();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [estaPausado, indiceActual, productoSeleccionado]);

  const productosVisibles = [];
  for (let i = 0; i < TARJETAS_VISIBLES; i++) {
    const index = (indiceActual + i) % productos.length;
    productosVisibles.push({ 
      ...productos[index], 
      keyId: `${productos[index].id}-${indiceActual}-${i}` 
    });
  }

  return (
    <section className="seccion-destacados-inicio">
      <div className="destacados-header-simple">
        <h2 className="titulo-nuestros-pasteles">Nuestros pasteles y recetas</h2>
        <p className="subtitulo-nuestros-pasteles">
          Explora nuestra variedad exclusiva del 50° Aniversario
        </p>
      </div>

      <div 
        className="carrusel-contenedor-relativo"
        onMouseEnter={() => setEstaPausado(true)}
        onMouseLeave={() => setEstaPausado(false)}
      >
        {/* Flecha izquierda */}
        <button 
          className="btn-carrusel-flotante flecha-izquierda" 
          onClick={anterior} 
          title="Anterior pastel"
        >
          ❮
        </button>

        {/* Grilla de pasteles del carrusel */}
        <div className="carrusel-horizontal-grid">
          {productosVisibles.map((item) => (
            <article
              key={item.keyId}
              className="card-pastel-exacta animacion-desplazar-izq"
              onClick={() => setProductoSeleccionado(item)}
            >
              <div className="card-pastel-img">
                <img src={item.imagen} alt={item.nombre} />
              </div>
              <div className="card-pastel-body">
                <span className="card-pastel-codigo">{item.codigo}</span>
                <h3 className="card-pastel-titulo">{item.nombre}</h3>
                <p className="card-pastel-desc">{item.descripcion}</p>
                <div className="card-pastel-precio">
                  ${item.precio.toLocaleString('es-CL')} CLP
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Flecha derecha */}
        <button 
          className="btn-carrusel-flotante flecha-derecha" 
          onClick={siguiente} 
          title="Siguiente pastel"
        >
          ❯
        </button>
      </div>

      {/* Ventana flotante de detalle al seleccionar cualquier pastel */}
      {productoSeleccionado && (
        <ProductoModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          onAgregarAlCarrito={onAgregarAlCarrito}
        />
      )}
    </section>
  );
};