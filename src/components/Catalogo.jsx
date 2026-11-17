import React, { useState, useEffect } from 'react';
import { obtenerProductos } from '../services/ProductoService'; // <-- 1. Apuntamos al nuevo servicio HTTP
import { ProductoModal } from './ProductoModal';

export const Catalogo = ({ onAgregarAlCarrito }) => {
  const [categoria, setCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // 2. Iniciamos los productos como arreglo vacío y agregamos estado de carga
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 3. Llamamos al backend de Spring Boot de forma asíncrona al montar el componente
  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarCatalogo();
  }, []);

  const categorias = [
    { id: 'todas', nombre: 'Todas' },
    { id: 'cuadradas', nombre: 'Tortas Cuadradas' },
    { id: 'circulares', nombre: 'Tortas Circulares' },
    { id: 'postres', nombre: 'Postres' },
    { id: 'sin-azucar', nombre: 'Sin Azúcar' },
    { id: 'tradicional', nombre: 'Tradicional' },
    { id: 'sin-gluten', nombre: 'Sin Gluten' },
    { id: 'vegana', nombre: 'Veganas' },
    { id: 'especiales', nombre: 'Especiales' },
  ];

  // Protección con (valor || '') para evitar errores si algún campo viene nulo desde la BD
  const productosFiltrados = productos.filter(p => {
    const coincideCat = categoria === 'todas' || p.categoria === categoria;
    const coincideTexto =
      (p.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.codigo || '').toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideTexto;
  });

  return (
    <section className="main-container">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 className="titulo-nuestros-pasteles">Nuestros Productos</h2>
        <p className="subtitulo-nuestros-pasteles">
          Elaborados artesanalmente con recetas tradicionales transmitidas por generaciones.
        </p>
      </div>

      {/* Buscador y Filtros */}
      <div className="filtros-seccion">
        <input
          type="text"
          className="buscador-input"
          placeholder="🔍 Buscar por nombre o código (ej: TC001)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="botones-filtros-grid">
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`btn-filtro ${categoria === cat.id ? 'active' : ''}`}
              onClick={() => setCategoria(cat.id)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Renderizado condicional mientras responde el servidor Java */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="subtitulo-nuestros-pasteles">Cargando catálogo desde el servidor...</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="subtitulo-nuestros-pasteles">No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        /* Grilla de Tarjetas del Catálogo */
        <div className="catalogo-grid">
          {productosFiltrados.map(p => (
            <article key={p.id} className="card-pastel-catalogo">
              <div className="card-pastel-img">
                <img src={p.imagen || p.imagenUrl} alt={p.nombre} />
              </div>
              <div className="card-pastel-body-catalogo">
                <span className="badge-codigo-card">{p.codigo}</span>
                <h3 className="titulo-pastel-serif">{p.nombre}</h3>
                <div className="precio-pastel-bold">${Number(p.precio).toLocaleString('es-CL')}</div>
                <button
                  className="btn-ver-detalle-pedir"
                  onClick={() => setProductoSeleccionado(p)}
                >
                  Ver Detalle / Pedir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Ventana Modal de Detalle */}
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