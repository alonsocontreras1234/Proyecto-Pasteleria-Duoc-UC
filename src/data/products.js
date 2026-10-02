/**
 * Catálogo Oficial de Pastelería Mil Sabores - 50.° Aniversario
 * 16 productos categorizados para uso en la aplicación React.
 */
export const products = [
  {
    codigo: "TC001",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Chocolate",
    imagen: "/img/pasteles/torta-cuadrada-chocolate.jpg",
    precioNumero: 45000,
    descripcionCorta: "Bizcocho de chocolate en formato cuadrado",
    pasos: [
      "Preparar el bizcocho de chocolate y hornear en molde cuadrado.",
      "Dejar enfriar y nivelar las capas.",
      "Rellenar con ganache de chocolate semiamargo.",
      "Cubrir y alisar los bordes en formato cuadrado."
    ],
    descripcion: "Un bizcocho de chocolate húmedo y denso, relleno de ganache oscuro y con un acabado limpio en formato cuadrado. Rinde aproximadamente 16 porciones."
  },
  {
    codigo: "TC002",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Frutas",
    imagen: "/img/pasteles/torta-cuadrada-frutas.jpg",
    precioNumero: 50000,
    descripcionCorta: "Bizcocho relleno y decorado con frutas frescas",
    pasos: [
      "Hornear el bizcocho de vainilla en molde cuadrado.",
      "Preparar la crema pastelera y dejar enfriar.",
      "Rellenar el bizcocho con la crema.",
      "Decorar la superficie con frutas frescas de temporada."
    ],
    descripcion: "Capas suaves de bizcocho de vainilla rellenas con crema pastelera casera, coronadas con frutas frescas de temporada. Rinde aproximadamente 16 porciones."
  },
  {
    codigo: "TT001",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Vainilla",
    imagen: "/img/pasteles/torta-circular-vainilla.jpg",
    precioNumero: 40000,
    descripcionCorta: "Clásica torta redonda de vainilla",
    pasos: [
      "Batir la mezcla de vainilla hasta lograr una textura aireada.",
      "Hornear en molde circular y dejar enfriar.",
      "Rellenar entre capas con crema chantilly.",
      "Cubrir con una capa final de crema y alisar."
    ],
    descripcion: "Bizcocho de vainilla suave y esponjoso, relleno y cubierto con crema chantilly. Rinde aproximadamente 14 porciones."
  },
  {
    codigo: "TT002",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Manjar",
    imagen: "/img/pasteles/torta-circular-manjar.jpg",
    precioNumero: 42000,
    descripcionCorta: "Capas rellenas con manjar casero",
    pasos: [
      "Hornear las capas de bizcocho y dejar enfriar por completo.",
      "Preparar el manjar casero a fuego lento.",
      "Rellenar cada capa con manjar.",
      "Cubrir la torta y decorar los bordes."
    ],
    descripcion: "Capas de bizcocho suave rellenas con manjar casero preparado a fuego lento. Rinde aproximadamente 14 porciones."
  },
  {
    codigo: "P1001",
    categoria: "Postres Individuales",
    nombre: "Mousse de Chocolate",
    imagen: "/img/pasteles/mousse-chocolate.jpg",
    precioNumero: 5000,
    descripcionCorta: "Postre individual, cremoso e intenso",
    pasos: [
      "Derretir el chocolate semi-amargo a baño maría.",
      "Batir la crema hasta punto de nieve.",
      "Incorporar el chocolate a la crema con movimientos envolventes.",
      "Refrigerar en copas individuales por al menos 3 horas."
    ],
    descripcion: "Postre individual cremoso y aireado, elaborado con chocolate semi-amargo de alta calidad."
  },
  {
    codigo: "P1002",
    categoria: "Postres Individuales",
    nombre: "Tiramisú Clásico",
    imagen: "/img/pasteles/tiramisu.jpg",
    precioNumero: 5500,
    descripcionCorta: "Postre italiano con café y mascarpone",
    pasos: [
      "Preparar el café y dejar enfriar.",
      "Remojar los bizcochos en el café.",
      "Mezclar el mascarpone con huevo y azúcar.",
      "Armar capas alternando bizcocho y crema, espolvorear cacao."
    ],
    descripcion: "Versión clásica del postre italiano con capas de bizcocho remojado en café y crema suave de mascarpone."
  },
  {
    codigo: "PSA001",
    categoria: "Productos Sin Azúcar",
    nombre: "Torta Sin Azúcar de Naranja",
    imagen: "/img/pasteles/torta-naranja-sin-azucar.jpg",
    precioNumero: 48000,
    descripcionCorta: "Sin azúcar añadida, sabor a naranja",
    pasos: [
      "Rallar la cáscara de naranja y extraer el jugo.",
      "Preparar el bizcocho endulzado con edulcorante natural.",
      "Hornear y dejar enfriar por completo.",
      "Bañar con un glaseado ligero de naranja sin azúcar."
    ],
    descripcion: "Bizcocho húmedo con sabor natural a naranja, endulzado naturalmente sin azúcar añadida. Rinde aproximadamente 14 porciones."
  },
  {
    codigo: "PSA002",
    categoria: "Productos Sin Azúcar",
    nombre: "Cheesecake Sin Azúcar",
    imagen: "/img/pasteles/cheesecake-sin-azucar.jpg",
    precioNumero: 47000,
    descripcionCorta: "Cremoso, apto para dietas bajas en azúcar",
    pasos: [
      "Preparar la base de galleta y prensar en el molde.",
      "Batir el queso crema con edulcorante hasta lograr una mezcla lisa.",
      "Hornear a baño maría a temperatura baja.",
      "Refrigerar por al menos 4 horas antes de servir."
    ],
    descripcion: "Cheesecake cremoso con base crocante de galleta, elaborado sin azúcar añadida. Rinde aproximadamente 12 porciones."
  },
  {
    codigo: "PT001",
    categoria: "Pastelería Tradicional",
    nombre: "Empanada de Manzana",
    imagen: "/img/pasteles/empanada-manzana.jpg",
    precioNumero: 3000,
    descripcionCorta: "Pastelería tradicional rellena de manzana",
    pasos: [
      "Preparar el relleno de manzana con canela y especias.",
      "Estirar la masa hojaldrada.",
      "Rellenar y sellar cada empanada.",
      "Hornear hasta dorar."
    ],
    descripcion: "Masa hojaldrada crocante rellena de manzana especiada con canela. Formato individual."
  },
  {
    codigo: "PT002",
    categoria: "Pastelería Tradicional",
    nombre: "Tarta de Santiago",
    imagen: "/img/pasteles/tarta-santiago.jpg",
    precioNumero: 6000,
    descripcionCorta: "Receta española a base de almendras",
    pasos: [
      "Moler las almendras hasta obtener una harina fina.",
      "Mezclar con azúcar, huevo y ralladura de limón.",
      "Hornear en molde circular sin base de masa.",
      "Decorar la superficie con azúcar flor formando la cruz de Santiago."
    ],
    descripcion: "Receta tradicional española elaborada a base de almendra molida, sin harina de trigo. Rinde aproximadamente 10 porciones."
  },
  {
    codigo: "PG001",
    categoria: "Productos Sin Gluten",
    nombre: "Brownie Sin Gluten",
    imagen: "/img/pasteles/brownie-sin-gluten.jpg",
    precioNumero: 4000,
    descripcionCorta: "Húmedo, apto para celíacos",
    pasos: [
      "Derretir el chocolate y la mantequilla juntos.",
      "Mezclar con huevo, azúcar y harina sin gluten.",
      "Verter en molde y hornear hasta lograr el punto húmedo.",
      "Dejar enfriar antes de cortar en cuadros."
    ],
    descripcion: "Brownie denso y húmedo de chocolate, elaborado con harinas libres de gluten. Presentación individual."
  },
  {
    codigo: "PG002",
    categoria: "Productos Sin Gluten",
    nombre: "Pan Sin Gluten",
    imagen: "/img/pasteles/pan-sin-gluten.jpg",
    precioNumero: 3500,
    descripcionCorta: "Pan artesanal sin harinas con gluten",
    pasos: [
      "Mezclar las harinas sin gluten con la levadura.",
      "Amasar e integrar los líquidos hasta formar la masa.",
      "Dejar reposar hasta que duplique su tamaño.",
      "Hornear hasta dorar la corteza."
    ],
    descripcion: "Pan artesanal elaborado con mezcla de harinas libres de gluten, corteza dorada y miga suave."
  },
  {
    codigo: "PV001",
    categoria: "Productos Vegana",
    nombre: "Torta Vegana de Chocolate",
    imagen: "/img/pasteles/torta-vegana-chocolate.jpg",
    precioNumero: 50000,
    descripcionCorta: "100% vegana, sin huevo ni lácteos",
    pasos: [
      "Preparar el bizcocho de chocolate sin huevo ni lácteos.",
      "Hornear y dejar enfriar por completo.",
      "Preparar una cobertura vegana de chocolate.",
      "Rellenar y cubrir la torta."
    ],
    descripcion: "Bizcocho de chocolate 100% vegano, elaborado sin ingrediente de origen animal. Rinde aproximadamente 14 porciones."
  },
  {
    codigo: "PV002",
    categoria: "Productos Vegana",
    nombre: "Galletas Veganas de Avena",
    imagen: "/img/pasteles/galletas-veganas-avena.jpg",
    precioNumero: 4500,
    descripcionCorta: "Sin ingredientes de origen animal",
    pasos: [
      "Mezclar la avena con los ingredientes secos.",
      "Incorporar los líquidos sin usar huevo ni lácteos.",
      "Formar las galletas y disponer en la bandeja.",
      "Hornear hasta dorar los bordes."
    ],
    descripcion: "Galletas crocantes por fuera y suaves por dentro, elaboradas completamente sin ingredientes de origen animal."
  },
  {
    codigo: "TE001",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Cumpleaños",
    imagen: "/img/pasteles/torta-cumpleanos.jpg",
    precioNumero: 55000,
    descripcionCorta: "Diseño personalizado para cumpleaños",
    pasos: [
      "Elegir el sabor de bizcocho junto al cliente.",
      "Hornear y rellenar según la elección.",
      "Cubrir la torta con la base de decoración.",
      "Personalizar el diseño según el tema del cumpleaños."
    ],
    descripcion: "Torta a medida pensada especialmente para celebraciones de cumpleaños con decoración personalizada."
  },
  {
    codigo: "TE002",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Boda",
    imagen: "/img/pasteles/torta-boda.jpg",
    precioNumero: 60000,
    descripcionCorta: "Torta de varios pisos, a medida",
    pasos: [
      "Coordinar el diseño y número de pisos con la pareja.",
      "Hornear cada piso por separado.",
      "Rellenar y cubrir cada nivel.",
      "Ensamblar y decorar la torta completa."
    ],
    descripcion: "Torta de varios pisos elaborada a medida para matrimonios, con decoración elegante a pedido."
  }
];

export const CATEGORIAS = [
  "Todas las categorías",
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Vegana",
  "Tortas Especiales"
];