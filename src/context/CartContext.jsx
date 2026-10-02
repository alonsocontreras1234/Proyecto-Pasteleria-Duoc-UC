import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMUNAS_TARIFAS } from '../utils/validators';
import { products } from '../data/products';

const CartContext = createContext();

// Mapa inmutable de catálogo para verificación estricta de precios
const CATALOGO_MAP = new Map(products.map((p) => [p.codigo, p]));

const MUESTRA_CARRITO_INICIAL = [
  {
    codigo: "TC001",
    nombre: "Torta Cuadrada de Chocolate",
    categoria: "Tortas Cuadradas",
    imagen: "/img/pasteles/torta-cuadrada-chocolate.jpg",
    precioNumero: 45000,
    cantidad: 1,
    dedicatoria: "¡Feliz 50.º aniversario, Pastelería Mil Sabores!"
  }
];

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('pms_react_cart');
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitización defensiva: re-vincular precio oficial inmutable del catálogo
          return parsed.map((item) => {
            const catalogoOficial = CATALOGO_MAP.get(item.codigo);
            return {
              ...item,
              precioNumero: catalogoOficial ? catalogoOficial.precioNumero : Number(item.precioNumero || 0),
              cantidad: Math.max(1, parseInt(item.cantidad, 10) || 1)
            };
          });
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar el carrito previo:", e);
    }
    return MUESTRA_CARRITO_INICIAL;
  });

  const [cupon, setCupon] = useState(() => {
    return localStorage.getItem('pms_cupon') || '';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pms_react_cart', JSON.stringify(items));
    } catch (e) {
      console.error("Error al guardar carrito:", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('pms_cupon', cupon);
    } catch (e) {
      console.error("Error al guardar cupón:", e);
    }
  }, [cupon]);

  const agregarAlCarrito = (producto, cantidad = 1, dedicatoria = '') => {
    // Asegurar precio oficial inmutable del catálogo
    const prodOficial = CATALOGO_MAP.get(producto.codigo) || producto;

    setItems((prevItems) => {
      const existe = prevItems.find((it) => it.codigo === prodOficial.codigo);
      if (existe) {
        return prevItems.map((it) =>
          it.codigo === prodOficial.codigo
            ? { ...it, cantidad: it.cantidad + cantidad, dedicatoria: dedicatoria || it.dedicatoria }
            : it
        );
      }
      return [
        ...prevItems,
        {
          codigo: prodOficial.codigo,
          nombre: prodOficial.nombre,
          categoria: prodOficial.categoria,
          imagen: prodOficial.imagen,
          precioNumero: prodOficial.precioNumero, // Inmutable
          cantidad: Math.max(1, cantidad),
          dedicatoria: dedicatoria
        }
      ];
    });
    setIsDrawerOpen(true);
  };

  const actualizarCantidad = (codigo, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(codigo);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.codigo === codigo ? { ...it, cantidad: Math.max(1, nuevaCantidad) } : it))
    );
  };

  const actualizarDedicatoria = (codigo, dedicatoria) => {
    setItems((prev) =>
      prev.map((it) => (it.codigo === codigo ? { ...it, dedicatoria } : it))
    );
  };

  const eliminarDelCarrito = (codigo) => {
    setItems((prev) => prev.filter((it) => it.codigo !== codigo));
  };

  const vaciarCarrito = () => {
    setItems([]);
    setCupon('');
  };

  // Cálculos económicos blindados contra manipulación de precios
  const subtotal = items.reduce((acc, it) => {
    const precioOficial = CATALOGO_MAP.get(it.codigo)?.precioNumero ?? it.precioNumero;
    return acc + (precioOficial * it.cantidad);
  }, 0);

  const totalItems = items.reduce((acc, it) => acc + it.cantidad, 0);

  // Validación estricta del cupón
  const cleanCupon = cupon ? cupon.trim().toUpperCase() : '';
  const porcentajeDescuento = cleanCupon === 'FELICES50' ? 0.10 : 0;
  const montoDescuento = Math.round(subtotal * porcentajeDescuento);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        cupon,
        setCupon,
        montoDescuento,
        porcentajeDescuento,
        isDrawerOpen,
        setIsDrawerOpen,
        agregarAlCarrito,
        actualizarCantidad,
        actualizarDedicatoria,
        eliminarDelCarrito,
        vaciarCarrito
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);