import React, { useState } from 'react';

export const ProductoModal = ({ producto, onClose, onAgregarAlCarrito }) => {
  const [cantidad, setCantidad] = useState(1);
  const [dedicatoria, setDedicatoria] = useState('');

  if (!producto) return null;

  const handleAgregar = () => {
    onAgregarAlCarrito({
      ...producto,
      cantidad,
      dedicatoria
    });
    onClose();
  };

  // Receta paso a paso (si el producto no trae una, usa una por defecto)
  const recetaPasos = producto.receta || [
    `Preparar el bizcocho artesanal para la ${producto.nombre.toLowerCase()} y horneado en molde adecuado.`,
    'Dejar enfriar y nivelar las capas cuidadosamente.',
    'Rellenar con la crema, manjar o cobertura según la receta familiar.',
    'Cubrir, alisar y decorar los bordes con acabado pastelero tradicional.'
  ];

  return (
    <div className="modal-backdrop-exact" onClick={onClose}>
      <div className="modal-producto-box" onClick={(e) => e.stopPropagation()}>
        <button className="btn-cerrar-modal-exact" onClick={onClose} title="Cerrar">✕</button>

        <div className="modal-producto-grid">
          {/* COLUMNA IZQUIERDA: Imagen y Receta */}
          <div className="modal-col-izq">
            <div className="modal-img-container">
              <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <div className="modal-receta-box">
              <h4 className="titulo-receta-script">Receta</h4>
              <ol className="lista-pasos-receta">
                {recetaPasos.map((paso, idx) => (
                  <li key={idx}>{paso}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* COLUMNA DERECHA: Título, Código, Descripción, Cantidad, Dedicatoria y Botón */}
          <div className="modal-col-der">
            <h2 className="titulo-modal-script">
              [{producto.codigo}] {producto.nombre}
            </h2>

            <p className="desc-modal-texto">
              {producto.descripcion}
            </p>

            <hr className="divider-modal-soft" />

            {/* Selector de cantidad - 1 + */}
            <div className="selector-cantidad-exact">
              <button 
                type="button" 
                className="btn-cant-step" 
                onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="num-cant-display">{cantidad}</span>
              <button 
                type="button" 
                className="btn-cant-step" 
                onClick={() => setCantidad(prev => prev + 1)}
              >
                +
              </button>
            </div>

            <div className="total-precio-modal">
              Total: ${(producto.precio * cantidad).toLocaleString('es-CL')} CLP
            </div>

            {/* Campo Dedicatoria Opcional */}
            <div className="group-dedicatoria">
              <label>Dedicatoria (opcional)</label>
              <input
                type="text"
                placeholder="Ej: ¡Feliz cumpleaños!"
                value={dedicatoria}
                onChange={(e) => setDedicatoria(e.target.value)}
              />
            </div>

            {/* Botón de Agregar al Carrito */}
            <button className="btn-agregar-carrito-modal" onClick={handleAgregar}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};