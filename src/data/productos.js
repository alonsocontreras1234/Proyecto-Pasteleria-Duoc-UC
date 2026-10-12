export const productos = [
  { 
    id: 1, 
    codigo: "TC001", 
    categoria: "cuadradas", 
    categoriaNombre: "Tortas Cuadradas", 
    nombre: "Torta Cuadrada de Chocolate", 
    precio: 45000, 
    descripcion: "Bizcocho de chocolate húmedo y denso, relleno de ganache oscuro.", 
    imagen: "/images/torta-cuadrada-chocolate.jpg",
    receta: [
      "Preparar el bizcocho de chocolate y hornear en molde cuadrado.",
      "Dejar enfriar y nivelar las capas.",
      "Rellenar con ganache de chocolate semiamargo.",
      "Cubrir y alisar los bordes en formato cuadrado."
    ] 
  },
  { 
    id: 2, 
    codigo: "TC002", 
    categoria: "cuadradas", 
    categoriaNombre: "Tortas Cuadradas", 
    nombre: "Torta Cuadrada de Frutas", 
    precio: 50000, 
    descripcion: "Capas de bizcocho de vainilla rellenas con crema pastelera y frutas frescas.", 
    imagen: "/images/torta-cuadrada-frutas.jpg",
    receta: [
      "Hornear el bizcocho de vainilla en molde cuadrado.",
      "Preparar la crema pastelera y dejar enfriar.",
      "Rellenar el bizcocho con la crema.",
      "Decorar la superficie con frutas frescas de temporada."
    ] 
  },
  { 
    id: 3, 
    codigo: "TT001", 
    categoria: "circulares", 
    categoriaNombre: "Tortas Circulares", 
    nombre: "Torta Circular de Vainilla", 
    precio: 40000, 
    descripcion: "Bizcocho de vainilla suave y esponjoso, relleno con crema chantilly.", 
    imagen: "/images/torta-circular-vainilla.jpg",
    receta: [
      "Batir la mezcla de vainilla hasta lograr una textura aireada.",
      "Hornear en molde circular y dejar enfriar.",
      "Rellenar entre capas con crema chantilly.",
      "Cubrir con una capa final de crema y alisar."
    ] 
  },
  { 
    id: 4, 
    codigo: "TT002", 
    categoria: "circulares", 
    categoriaNombre: "Tortas Circulares", 
    nombre: "Torta Circular de Manjar", 
    precio: 42000, 
    descripcion: "Capas de bizcocho suave rellenas con manjar casero preparado a fuego lento.", 
    imagen: "/images/torta-circular-manjar.jpg",
    receta: [
      "Hornear las capas de bizcocho y dejar enfriar por completo.",
      "Preparar el manjar casero a fuego lento.",
      "Rellenar cada capa con manjar.",
      "Cubrir la torta y decorar los bordes."
    ] 
  },
  { 
    id: 5, 
    codigo: "P1001", 
    categoria: "postres", 
    categoriaNombre: "Postres Individuales", 
    nombre: "Mousse de Chocolate", 
    precio: 5000, 
    descripcion: "Postre individual cremoso elaboración con chocolate semi-amargo.", 
    imagen: "/images/mousse-chocolate.jpg",
    receta: [
      "Derretir el chocolate semi-amargo a baño maría.",
      "Batir la crema hasta punto de nieve.",
      "Incorporar el chocolate a la crema con movimientos envolventes.",
      "Refrigerar en copas individuales por al menos 3 horas."
    ] 
  },
  { 
    id: 6, 
    codigo: "P1002", 
    categoria: "postres", 
    categoriaNombre: "Postres Individuales", 
    nombre: "Tiramisú Clásico", 
    precio: 5500, 
    descripcion: "Versión clásica con capas de bizcocho remojado en café y mascarpone.", 
    imagen: "/images/tiramisu.jpg",
    receta: [
      "Preparar el café y dejar enfriar.",
      "Remojar los bizcochos en el café.",
      "Mezclar el mascarpone con huevo y azúcar.",
      "Armar capas alternando bizcocho y crema, espolvorear cacao."
    ] 
  },
  { 
    id: 7, 
    codigo: "PSA001", 
    categoria: "sin-azucar", 
    categoriaNombre: "Productos Sin Azúcar", 
    nombre: "Torta Sin Azúcar de Naranja", 
    precio: 48000, 
    descripcion: "Bizcocho húmedo sabor a naranja, endulzado naturalmente.", 
    imagen: "/images/torta-naranja-sin-azucar.jpg",
    receta: [
      "Rallar la cáscara de naranja y extraer el jugo.",
      "Preparar el bizcocho endulzado con edulcorante natural.",
      "Hornear y dejar enfriar por completo.",
      "Bañar con un glaseado ligero de naranja sin azúcar."
    ] 
  },
  { 
    id: 8, 
    codigo: "PSA002", 
    categoria: "sin-azucar", 
    categoriaNombre: "Productos Sin Azúcar", 
    nombre: "Cheesecake Sin Azúcar", 
    precio: 47000, 
    descripcion: "Cheesecake cremoso con base crocante, elaborado sin azúcar añadida.", 
    imagen: "/images/cheesecake-sin-azucar.jpg",
    receta: [
      "Preparar la base de galleta y prensar en el molde.",
      "Batir el queso crema con edulcorante hasta lograr una mezcla lisa.",
      "Hornear a baño maría a temperatura baja.",
      "Refrigerar por al menos 4 horas antes de servir."
    ] 
  },
  { 
    id: 9, 
    codigo: "PT001", 
    categoria: "tradicional", 
    categoriaNombre: "Pastelería Tradicional", 
    nombre: "Empanada de Manzana", 
    precio: 3000, 
    descripcion: "Masa hojaldrada crocante rellena de manzana especiada con canela.", 
    imagen: "/images/empanada-manzana.jpg",
    receta: [
      "Preparar el relleno de manzana con canela y especias.",
      "Estirar la masa hojaldrada.",
      "Rellenar y sellar cada empanada.",
      "Hornear hasta dorar."
    ] 
  },
  { 
    id: 10, 
    codigo: "PT002", 
    categoria: "tradicional", 
    categoriaNombre: "Pastelería Tradicional", 
    nombre: "Tarta de Santiago", 
    precio: 6000, 
    descripcion: "Receta tradicional española a base de almendra molida.", 
    imagen: "/images/tarta-santiago.jpg",
    receta: [
      "Moler las almendras hasta obtener una harina fina.",
      "Mezclar con azúcar, huevo y ralladura de limón.",
      "Hornear en molde circular sin base de masa.",
      "Decorar la superficie con azúcar flor formando la cruz de Santiago."
    ] 
  },
  { 
    id: 11, 
    codigo: "PG001", 
    categoria: "sin-gluten", 
    categoriaNombre: "Productos Sin Gluten", 
    nombre: "Brownie Sin Gluten", 
    precio: 4000, 
    descripcion: "Brownie denso y húmedo elaborado con harinas libres de gluten.", 
    imagen: "/images/brownie-sin-gluten.jpg",
    receta: [
      "Derretir el chocolate y la mantequilla juntos.",
      "Mezclar con huevo, azúcar y harina sin gluten.",
      "Verter en molde y hornear hasta lograr el punto húmedo.",
      "Dejar enfriar antes de cortar en cuadros."
    ] 
  },
  { 
    id: 12, 
    codigo: "PG002", 
    categoria: "sin-gluten", 
    categoriaNombre: "Productos Sin Gluten", 
    nombre: "Pan Sin Gluten", 
    precio: 3500, 
    descripcion: "Pan artesanal elaborado con mezcla de harinas sin gluten.", 
    imagen: "/images/pan-sin-gluten.jpg",
    receta: [
      "Mezclar las harinas sin gluten con la levadura.",
      "Amasar e integrar los líquidos hasta formar la masa.",
      "Dejar reposar hasta que duplique su tamaño.",
      "Hornear hasta dorar la corteza."
    ] 
  },
  { 
    id: 13, 
    codigo: "PV001", 
    categoria: "vegana", 
    categoriaNombre: "Productos Veganos", 
    nombre: "Torta Vegana de Chocolate", 
    precio: 50000, 
    descripcion: "Bizcocho 100% vegano, sin huevo ni lácteos.", 
    imagen: "/images/torta-vegana-chocolate.jpg",
    receta: [
      "Preparar el bizcocho de chocolate sin huevo ni lácteos.",
      "Hornear y dejar enfriar por completo.",
      "Preparar una cobertura vegana de chocolate.",
      "Rellenar y cubrir la torta."
    ] 
  },
  { 
    id: 14, 
    codigo: "PV002", 
    categoria: "vegana", 
    categoriaNombre: "Productos Veganos", 
    nombre: "Galletas Veganas de Avena", 
    precio: 4500, 
    descripcion: "Galletas crocantes por fuera y suaves por dentro sin ingredientes animales.", 
    imagen: "/images/galletas-veganas-avena.jpg",
    receta: [
      "Mezclar la avena con los ingredientes secos.",
      "Incorporar los líquidos sin usar huevo ni lácteos.",
      "Formar las galletas y disponer en la bandeja.",
      "Hornear hasta dorar los bordes."
    ] 
  },
  { 
    id: 15, 
    codigo: "TE001", 
    categoria: "especiales", 
    categoriaNombre: "Tortas Especiales", 
    nombre: "Torta Especial de Cumpleaños", 
    precio: 55000, 
    descripcion: "Torta a medida especialmente diseñada para celebraciones.", 
    imagen: "/images/torta-cumpleanos.jpg",
    receta: [
      "Elegir el sabor de bizcocho junto al cliente.",
      "Hornear y rellenar según la elección.",
      "Cubrir la torta con la base de decoración.",
      "Personalizar el diseño según el tema del cumpleaños."
    ] 
  },
  { 
    id: 16, 
    codigo: "TE002", 
    categoria: "especiales", 
    categoriaNombre: "Tortas Especiales", 
    nombre: "Torta Especial de Boda", 
    precio: 60000, 
    descripcion: "Torta de varios pisos elaborada a medida para matrimonios.", 
    imagen: "/images/torta-boda.jpg",
    receta: [
      "Coordinar el diseño y número de pisos con la pareja.",
      "Hornear cada piso por separado.",
      "Rellenar y cubrir cada nivel.",
      "Ensamblar y decorar la torta completa."
    ] 
  }
];