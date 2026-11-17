import React, { useState, useEffect } from 'react';
import { obtenerProductos } from '../services/ProductoService';
import { ProductoModal } from './ProductoModal';

export const NuestrosPasteles = ({ onAgregarAlCarrito }) => {
  const [indiceActual, setIndiceActual] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // 1. Estado asíncrono para recibir los datos desde Spring Boot
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const TARJETAS_VISIBLES = 4;

  // 2. Carga inicial desde ProductoService
  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar pasteles destacados:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDestacados();
  }, []);

  const siguiente = () => {
    if (productos.length === 0) return;
    setIndiceActual((prev) => (prev + 1) % productos.length);
  };

  const anterior = () => {
    if (productos.length === 0) return;
    setIndiceActual((prev) => (prev === 0 ? productos.length - 1 : prev - 1));
  };

  // 3. Pausar rotación si el mouse está encima, hay modal abierto o hay 1 o menos productos
  useEffect(() => {
    if (estaPausado || productoSeleccionado || productos.length <= 1) return;

    const intervalo = setInterval(() => {
      siguiente();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [estaPausado, indiceActual, productoSeleccionado, productos.length]);

  // 4. Protección contra división por cero mientras responde el servidor
  if (cargando) {
    return (
      <section className="seccion-destacados-inicio">
        <div className="destacados-header-simple">
          <h2 className="titulo-nuestros-pasteles">Nuestros pasteles y recetas</h2>
          <p className="subtitulo-nuestros-pasteles">Cargando pasteles destacados...</p>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return null;
  }

  // 5. Evita duplicar tarjetas si en la BD hay menos de 4 productos registrados
  const cantidadMostrar = Math.min(TARJETAS_VISIBLES, productos.length);
  const productosVisibles = [];

  for (let i = 0; i < cantidadMostrar; i++) {
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
        {/* Flecha izquierda (solo se muestra si hay más de 4 productos para rotar) */}
        {productos.length > TARJETAS_VISIBLES && (
          <button
            className="btn-carrusel-flotante flecha-izquierda"
            onClick={anterior}
            title="Anterior pastel"
          >
            ❮
          </button>
        )}

        {/* Grilla de pasteles del carrusel */}
        <div className="carrusel-horizontal-grid">
          {productosVisibles.map((item) => (
            <article
              key={item.keyId}
              className="card-pastel-exacta animacion-desplazar-izq"
              onClick={() => setProductoSeleccionado(item)}
            >
              <div className="card-pastel-img">
                <img src={item.imagen || item.imagenUrl} alt={item.nombre} />
              </div>
              <div className="card-pastel-body">
                <span className="card-pastel-codigo">{item.codigo}</span>
                <h3 className="card-pastel-titulo">{item.nombre}</h3>
                <p className="card-pastel-desc">{item.descripcion}</p>
                <div className="card-pastel-precio">
                  ${Number(item.precio || 0).toLocaleString('es-CL')} CLP
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Flecha derecha */}
        {productos.length > TARJETAS_VISIBLES && (
          <button
            className="btn-carrusel-flotante flecha-derecha"
            onClick={siguiente}
            title="Siguiente pastel"
          >
            ❯
          </button>
        )}
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