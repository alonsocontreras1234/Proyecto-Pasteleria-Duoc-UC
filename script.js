// ============================================
// 1. LOS 16 PRODUCTOS (la "base de datos")
// ============================================
const productos = [
  {
    nombre: "Torta Cuadrada de Chocolate", imagen: "img/pasteles/torta-cuadrada-chocolate.jpg",
    precioNumero: 45000, descripcionCorta: "Bizcocho de chocolate en formato cuadrado",
    pasos: ["Preparar el bizcocho de chocolate y hornear en molde cuadrado.", "Dejar enfriar y nivelar las capas.", "Rellenar con ganache de chocolate semiamargo.", "Cubrir y alisar los bordes en formato cuadrado."],
    descripcion: "Un bizcocho de chocolate húmedo y denso, relleno de ganache oscuro y con un acabado limpio en formato cuadrado. Perfecto para cortar en porciones parejas, es una de las opciones favoritas para reuniones de trabajo y celebraciones familiares. Rinde aproximadamente 16 porciones."
  },
  {
    nombre: "Torta Cuadrada de Frutas", imagen: "img/pasteles/torta-cuadrada-frutas.jpg",
    precioNumero: 50000, descripcionCorta: "Bizcocho relleno y decorado con frutas frescas",
    pasos: ["Hornear el bizcocho de vainilla en molde cuadrado.", "Preparar la crema pastelera y dejar enfriar.", "Rellenar el bizcocho con la crema.", "Decorar la superficie con frutas frescas de temporada."],
    descripcion: "Capas suaves de bizcocho de vainilla rellenas con crema pastelera casera, coronadas con una selección de frutas frescas de temporada. Su combinación de dulzor y frescura la convierte en una opción liviana. Rinde aproximadamente 16 porciones."
  },
  {
    nombre: "Torta Circular de Vainilla", imagen: "img/pasteles/torta-circular-vainilla.jpg",
    precioNumero: 40000, descripcionCorta: "Clásica torta redonda de vainilla",
    pasos: ["Batir la mezcla de vainilla hasta lograr una textura aireada.", "Hornear en molde circular y dejar enfriar.", "Rellenar entre capas con crema chantilly.", "Cubrir con una capa final de crema y alisar."],
    descripcion: "La receta más tradicional de la pastelería: bizcocho de vainilla suave y esponjoso, relleno y cubierto con crema chantilly. Un sabor clásico que nunca falla, ideal para cualquier celebración. Rinde aproximadamente 14 porciones."
  },
  {
    nombre: "Torta Circular de Manjar", imagen: "img/pasteles/torta-circular-manjar.jpg",
    precioNumero: 42000, descripcionCorta: "Capas rellenas con manjar casero",
    pasos: ["Hornear las capas de bizcocho y dejar enfriar por completo.", "Preparar el manjar casero a fuego lento.", "Rellenar cada capa con manjar.", "Cubrir la torta y decorar los bordes."],
    descripcion: "Capas de bizcocho suave rellenas con manjar casero preparado a fuego lento, un clásico infaltable de la repostería chilena. Su sabor dulce y cremoso la convierte en una de las favoritas de la casa. Rinde aproximadamente 14 porciones."
  },
  {
    nombre: "Mousse de Chocolate", imagen: "img/pasteles/mousse-chocolate.jpg",
    precioNumero: 5000, descripcionCorta: "Postre individual, cremoso e intenso",
    pasos: ["Derretir el chocolate semi-amargo a baño maría.", "Batir la crema hasta punto de nieve.", "Incorporar el chocolate a la crema con movimientos envolventes.", "Refrigerar en copas individuales por al menos 3 horas."],
    descripcion: "Postre individual cremoso y aireado, elaborado con chocolate semi-amargo de buena calidad. Su textura suave se deshace en la boca, ideal para quienes buscan una porción justa de dulce. Se sirve en copa individual."
  },
  {
    nombre: "Tiramisú Clásico", imagen: "img/pasteles/tiramisu.jpg",
    precioNumero: 5500, descripcionCorta: "Postre italiano con café y mascarpone",
    pasos: ["Preparar el café y dejar enfriar.", "Remojar los bizcochos en el café.", "Mezclar el mascarpone con huevo y azúcar.", "Armar capas alternando bizcocho y crema, espolvorear cacao."],
    descripcion: "Versión clásica del postre italiano, con capas de bizcocho remojado en café y una crema suave de mascarpone. Se sirve espolvoreado con cacao amargo justo antes de disfrutar. Presentación individual."
  },
  {
    nombre: "Torta Sin Azúcar de Naranja", imagen: "img/pasteles/torta-naranja-sin-azucar.jpg",
    precioNumero: 48000, descripcionCorta: "Sin azúcar añadida, sabor a naranja",
    pasos: ["Rallar la cáscara de naranja y extraer el jugo.", "Preparar el bizcocho endulzado con edulcorante natural.", "Hornear y dejar enfriar por completo.", "Bañar con un glaseado ligero de naranja sin azúcar."],
    descripcion: "Bizcocho húmedo con sabor natural a naranja, endulzado sin azúcar añadida. Pensada especialmente para quienes cuidan su consumo de azúcar sin renunciar al sabor. Rinde aproximadamente 14 porciones."
  },
  {
    nombre: "Cheesecake Sin Azúcar", imagen: "img/pasteles/cheesecake-sin-azucar.jpg",
    precioNumero: 47000, descripcionCorta: "Cremoso, apto para dietas bajas en azúcar",
    pasos: ["Preparar la base de galleta y prensar en el molde.", "Batir el queso crema con edulcorante hasta lograr una mezcla lisa.", "Hornear a baño maría a temperatura baja.", "Refrigerar por al menos 4 horas antes de servir."],
    descripcion: "Cheesecake cremoso con base crocante de galleta, elaborado sin azúcar añadida. Su textura suave y su sabor equilibrado lo hacen apto para dietas bajas en azúcar sin sacrificar el sabor. Rinde aproximadamente 12 porciones."
  },
  {
    nombre: "Empanada de Manzana", imagen: "img/pasteles/empanada-manzana.jpg",
    precioNumero: 3000, descripcionCorta: "Pastelería tradicional rellena de manzana",
    pasos: ["Preparar el relleno de manzana con canela y especias.", "Estirar la masa hojaldrada.", "Rellenar y sellar cada empanada.", "Hornear hasta dorar."],
    descripcion: "Masa hojaldrada crocante rellena de manzana especiada con canela, un clásico de pastelería para acompañar el café de la tarde. Se sirve tibia, en formato individual."
  },
  {
    nombre: "Tarta de Santiago", imagen: "img/pasteles/tarta-santiago.jpg",
    precioNumero: 6000, descripcionCorta: "Receta española a base de almendras",
    pasos: ["Moler las almendras hasta obtener una harina fina.", "Mezclar con azúcar, huevo y ralladura de limón.", "Hornear en molde circular sin base de masa.", "Decorar la superficie con azúcar flor formando la cruz de Santiago."],
    descripcion: "Receta tradicional española elaborada a base de almendra molida, sin harina de trigo. Su textura húmeda y su sabor intenso a almendra la convierten en una alternativa distinta dentro de la carta. Rinde aproximadamente 10 porciones."
  },
  {
    nombre: "Brownie Sin Gluten", imagen: "img/pasteles/brownie-sin-gluten.jpg",
    precioNumero: 4000, descripcionCorta: "Húmedo, apto para celíacos",
    pasos: ["Derretir el chocolate y la mantequilla juntos.", "Mezclar con huevo, azúcar y harina sin gluten.", "Verter en molde y hornear hasta lograr el punto húmedo.", "Dejar enfriar antes de cortar en cuadros."],
    descripcion: "Brownie denso y húmedo de chocolate, elaborado con harinas libres de gluten sin perder la textura clásica. Apto para personas celíacas o con sensibilidad al gluten. Presentación individual."
  },
  {
    nombre: "Pan Sin Gluten", imagen: "img/pasteles/pan-sin-gluten.jpg",
    precioNumero: 3500, descripcionCorta: "Pan artesanal sin harinas con gluten",
    pasos: ["Mezclar las harinas sin gluten con la levadura.", "Amasar e integrar los líquidos hasta formar la masa.", "Dejar reposar hasta que duplique su tamaño.", "Hornear hasta dorar la corteza."],
    descripcion: "Pan artesanal elaborado con una mezcla especial de harinas libres de gluten, con una corteza dorada y miga suave. Una alternativa pensada para intolerantes al gluten sin resignar sabor ni textura."
  },
  {
    nombre: "Torta Vegana de Chocolate", imagen: "img/pasteles/torta-vegana-chocolate.jpg",
    precioNumero: 50000, descripcionCorta: "100% vegana, sin huevo ni lácteos",
    pasos: ["Preparar el bizcocho de chocolate sin huevo ni lácteos.", "Hornear y dejar enfriar por completo.", "Preparar una cobertura vegana de chocolate.", "Rellenar y cubrir la torta."],
    descripcion: "Bizcocho de chocolate 100% vegano, elaborado sin huevo ni lácteos, con un sabor intenso que no tiene nada que envidiarle a la versión tradicional. Ideal para quienes siguen una alimentación basada en plantas. Rinde aproximadamente 14 porciones."
  },
  {
    nombre: "Galletas Veganas de Avena", imagen: "img/pasteles/galletas-veganas-avena.jpg",
    precioNumero: 4500, descripcionCorta: "Sin ingredientes de origen animal",
    pasos: ["Mezclar la avena con los ingredientes secos.", "Incorporar los líquidos sin usar huevo ni lácteos.", "Formar las galletas y disponer en la bandeja.", "Hornear hasta dorar los bordes."],
    descripcion: "Galletas crocantes por fuera y suaves por dentro, elaboradas completamente sin ingredientes de origen animal. Una opción sabrosa y saludable para acompañar cualquier momento del día."
  },
  {
    nombre: "Torta Especial de Cumpleaños", imagen: "img/pasteles/torta-cumpleanos.jpg",
    precioNumero: 55000, descripcionCorta: "Diseño personalizado para cumpleaños",
    pasos: ["Elegir el sabor de bizcocho junto al cliente.", "Hornear y rellenar según la elección.", "Cubrir la torta con la base de decoración.", "Personalizar el diseño según el tema del cumpleaños."],
    descripcion: "Torta a medida pensada especialmente para celebraciones de cumpleaños, con decoración personalizada según el tema o los colores que prefieras. El sabor del bizcocho y el relleno se coordinan directamente con el cliente."
  },
  {
    nombre: "Torta Especial de Boda", imagen: "img/pasteles/torta-boda.jpg",
    precioNumero: 60000, descripcionCorta: "Torta de varios pisos, a medida",
    pasos: ["Coordinar el diseño y número de pisos con la pareja.", "Hornear cada piso por separado.", "Rellenar y cubrir cada nivel.", "Ensamblar y decorar la torta completa."],
    descripcion: "Torta de varios pisos elaborada a medida para matrimonios, con decoración elegante y a pedido. Se coordina previamente el sabor, tamaño y diseño según la cantidad de invitados. Ideal para el momento más especial del evento."
  }
];


//VARIABLE que recuerda desde dónde empezar

let inicio = 0;


//Funcion que dibuja 7 targetas empezando en "inicio"
function renderizarTarjetas() {
  const contenedor = document.getElementById("contenedorProductos");
  contenedor.innerHTML = ""; // borra lo anterior

  for (let i = 0; i < 7; i++) {
    const indiceReal = (inicio + i) % productos.length; // da la vuelta al llegar a 16
    const p = productos[indiceReal];

    const articulo = document.createElement("article");
    articulo.className = "targetas";
    articulo.onclick = () => abrirModal(indiceReal);

    articulo.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="info">
        <h3>${p.nombre}</h3>
        <p>${p.descripcionCorta}</p>
        <span class="precio">${formatearPrecio(p.precioNumero)}</span>
      </div>
    `;

    contenedor.appendChild(articulo);
  }
}

// ============================================
// 4. ROTACIÓN — automática y manual comparten la misma lógica
// ============================================
const DURACION_FADE = 400; // en milisegundos, debe coincidir con el "0.4s" del CSS
let intervaloRotacion = null;

// mueve el índice "inicio" en la dirección indicada (1 = derecha, -1 = izquierda)
function moverIndice(direccion) {
  const contenedor = document.getElementById("contenedorProductos");

  contenedor.classList.add("fade-out");   // 1. empieza a desvanecerse

  setTimeout(() => {
    // el "+ productos.length" evita que el resultado quede negativo al ir a la izquierda
    inicio = (inicio + direccion + productos.length) % productos.length;
    renderizarTarjetas();                      // 2. cambia las tarjetas (mientras está invisible)
    contenedor.classList.remove("fade-out");   // 3. vuelve a aparecer
  }, DURACION_FADE);
}

function rotar() {
  moverIndice(1); // la rotación automática siempre avanza hacia la derecha
}

function moverManual(direccion) {
  clearInterval(intervaloRotacion);        // detiene el temporizador actual
  moverIndice(direccion);                   // mueve en la dirección que tocó el usuario
  intervaloRotacion = setInterval(rotar, 5000); // reinicia el temporizador desde cero
}

renderizarTarjetas();                          // dibuja las primeras 7 apenas carga la página
intervaloRotacion = setInterval(rotar, 5000);  // y luego rota cada 5000ms (5 segundos)

// ============================================
// 5. FORMATEO DE PRECIO (número -> texto con puntos y CLP)
// ============================================
function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CL") + " CLP";
}

// ============================================
// 6. MODAL — estado del producto y cantidad actuales
// ============================================
let productoActual = null;
let cantidad = 1;

function abrirModal(indice) {
  productoActual = productos[indice]; // guarda qué producto está abierto
  cantidad = 1;                        // reinicia la cantidad cada vez que se abre

  document.getElementById("modalImagen").src = productoActual.imagen;
  document.getElementById("modalImagen").alt = productoActual.nombre;
  document.getElementById("modalTitulo").textContent = productoActual.nombre;
  document.getElementById("modalDescripcion").textContent = productoActual.descripcion;

  // dibuja la receta como lista numerada, un <li> por paso
  document.getElementById("modalReceta").innerHTML =
    productoActual.pasos.map(paso => `<li>${paso}</li>`).join("");

  document.getElementById("modalMensaje").textContent = ""; // limpia mensaje anterior

  actualizarCantidad();
  document.getElementById("modalPastel").showModal();
}

function cerrarModal() {
  document.getElementById("modalPastel").close();
}

// ============================================
// 7. MODAL — selector de cantidad y precio total
// ============================================
function cambiarCantidad(delta) {
  cantidad = Math.max(1, cantidad + delta); // nunca baja de 1
  actualizarCantidad();
}

function actualizarCantidad() {
  document.getElementById("modalCantidad").textContent = cantidad;

  const total = productoActual.precioNumero * cantidad;
  document.getElementById("modalPrecioTotal").textContent = "Total: " + formatearPrecio(total);
}

function agregarAlCarrito() {
  // busca si ese producto ya estaba en el carrito
  const existente = carrito.find(item => item.nombre === productoActual.nombre);

  if (existente) {
    existente.cantidad += cantidad;   // ya estaba: suma la cantidad nueva
  } else {
    carrito.push({                     // no estaba: lo agrega como item nuevo
      nombre: productoActual.nombre,
      imagen: productoActual.imagen,
      precioNumero: productoActual.precioNumero,
      cantidad: cantidad
    });
  }

  actualizarContadorCarrito();

  document.getElementById("modalMensaje").textContent =
    `Agregaste ${cantidad} x ${productoActual.nombre} al carrito.`;
}

// ============================================
// 8. CARRITO — estado y funciones
// ============================================
let carrito = [];

function actualizarContadorCarrito() {
  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  document.getElementById("carritoContador").textContent = totalItems;
}

function abrirCarrito() {
  renderizarCarrito();
  document.getElementById("carritoModal").showModal();
}

function cerrarCarrito() {
  document.getElementById("carritoModal").close();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carritoItems");

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p class='carrito-vacio'>Tu carrito está vacío.</p>";
    document.getElementById("carritoTotalTexto").textContent = "";
    return;
  }

  contenedor.innerHTML = carrito.map((item, indice) => `
    <div class="carrito-item">
      <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
      <div class="carrito-item-info">
        <p class="carrito-item-nombre">${item.nombre}</p>
        <p class="carrito-item-detalle">${item.cantidad} x ${formatearPrecio(item.precioNumero)}</p>
      </div>
      <button class="carrito-item-quitar" onclick="quitarDelCarrito(${indice})">✕</button>
    </div>
  `).join("");

  const total = carrito.reduce((suma, item) => suma + (item.precioNumero * item.cantidad), 0);
  document.getElementById("carritoTotalTexto").textContent = "Total: " + formatearPrecio(total);
}

function quitarDelCarrito(indice) {
  carrito.splice(indice, 1);   // elimina ese item del array
  actualizarContadorCarrito();
  renderizarCarrito();          // vuelve a dibujar el carrito sin ese item
}
