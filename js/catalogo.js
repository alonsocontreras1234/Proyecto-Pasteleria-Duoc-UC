const listaProductos = [
  {
    id: 1,
    code: "TC001",
    name: "Torta Cuadrada de Chocolate",
    category: "cuadradas",
    categoryLabel: "Tortas Cuadradas",
    price: 45000,
    image: "img/pasteles/torta-cuadrada-chocolate.jpg",
    description: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas."
  },
  {
    id: 2,
    code: "TC002",
    name: "Torta Cuadrada de Frutas",
    category: "cuadradas",
    categoryLabel: "Tortas Cuadradas",
    price: 50000,
    image: "img/pasteles/torta-cuadrada-frutas.jpg",
    description: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla."
  },
  {
    id: 3,
    code: "TT001",
    name: "Torta Circular de Vainilla",
    category: "circulares",
    categoryLabel: "Tortas Circulares",
    price: 40000,
    image: "img/pasteles/torta-circular-vainilla.jpg",
    description: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con glaseado."
  },
  {
    id: 4,
    code: "TT002",
    name: "Torta Circular de Manjar",
    category: "circulares",
    categoryLabel: "Tortas Circulares",
    price: 42000,
    image: "img/pasteles/torta-circular-manjar.jpg",
    description: "Torta tradicional chilena con manjar y nueces."
  },
  {
    id: 5,
    code: "PI001",
    name: "Mousse de Chocolate",
    category: "postres",
    categoryLabel: "Postres Individuales",
    price: 5000,
    image: "img/pasteles/mousse-chocolate.jpg",
    description: "Postre individual cremoso y suave, hecho con chocolate de alta calidad."
  },
  {
    id: 6,
    code: "PI002",
    name: "Tiramisú Clásico",
    category: "postres",
    categoryLabel: "Postres Individuales",
    price: 5500,
    image: "img/pasteles/tiramisu.jpg",
    description: "Un postre italiano individual con capas de café, mascarpone y cacao."
  },
  {
    id: 7,
    code: "PSA001",
    name: "Torta Sin Azúcar de Naranja",
    category: "sin-azucar",
    categoryLabel: "Productos Sin Azúcar",
    price: 48000,
    image: "img/pasteles/torta-naranja-sin-azucar.jpg",
    description: "Torta ligera y deliciosa, endulzada naturalmente."
  },
  {
    id: 8,
    code: "PSA002",
    name: "Cheesecake Sin Azúcar",
    category: "sin-azucar",
    categoryLabel: "Productos Sin Azúcar",
    price: 47000,
    image: "img/pasteles/cheesecake-sin-azucar.jpg",
    description: "Suave y cremoso, una opción perfecta para disfrutar sin culpa."
  },
  {
    id: 9,
    code: "PT001",
    name: "Empanada de Manzana",
    category: "tradicional",
    categoryLabel: "Pastelería Tradicional",
    price: 3000,
    image: "img/pasteles/empanada-manzana.jpg",
    description: "Pastelería tradicional rellena de manzanas especiadas."
  },
  {
    id: 10,
    code: "PT002",
    name: "Tarta de Santiago",
    category: "tradicional",
    categoryLabel: "Pastelería Tradicional",
    price: 6000,
    image: "img/pasteles/tarta-santiago.jpg",
    description: "Tradicional tarta española hecha con almendras, azúcar, y huevos."
  },
  {
    id: 11,
    code: "PG001",
    name: "Brownie Sin Gluten",
    category: "sin-gluten",
    categoryLabel: "Productos Sin Gluten",
    price: 4000,
    image: "img/pasteles/brownie-sin-gluten.jpg",
    description: "Rico y denso, este brownie es perfecto para evitar el gluten."
  },
  {
    id: 12,
    code: "PG002",
    name: "Pan Sin Gluten",
    category: "sin-gluten",
    categoryLabel: "Productos Sin Gluten",
    price: 3500,
    image: "img/pasteles/pan-sin-gluten.jpg",
    description: "Suave y esponjoso, ideal para sándwiches o acompañamiento."
  },
  {
    id: 13,
    code: "PV001",
    name: "Torta Vegana de Chocolate",
    category: "vegana",
    categoryLabel: "Productos Vegana",
    price: 50000,
    image: "img/pasteles/torta-vegana-chocolate.jpg",
    description: "Torta de chocolate húmeda hecha sin productos de origen animal."
  },
  {
    id: 14,
    code: "PV002",
    name: "Galletas Veganas de Avena",
    category: "vegana",
    categoryLabel: "Productos Vegana",
    price: 4500,
    image: "img/pasteles/galletas-veganas-avena.jpg",
    description: "Crujientes y sabrosas, una excelente opción de snack saludable."
  },
  {
    id: 15,
    code: "TE001",
    name: "Torta Especial de Cumpleaños",
    category: "especiales",
    categoryLabel: "Tortas Especiales",
    price: 55000,
    image: "img/pasteles/torta-cumpleanos.jpg",
    description: "Diseñada especialmente para celebraciones, personalizable con decoraciones."
  },
  {
    id: 16,
    code: "TE002",
    name: "Torta Especial de Boda",
    category: "especiales",
    categoryLabel: "Tortas Especiales",
    price: 60000,
    image: "img/pasteles/torta-boda.jpg",
    description: "Elegante y deliciosa, diseñada para ser el centro de atención en bodas."
  }
];

let categoriaSeleccionada = "todas";

function renderizarTargetas(productos) {
  const grid = document.getElementById("productos-grid");
  if (!grid) return;

  if (!productos || productos.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 30px;">No se encontraron productos.</p>`;
    return;
  }

  grid.innerHTML = productos.map(p => `
    <div class="card producto-card" style="background:#fff; border:1px solid #e0e0e0; border-radius:10px; padding:15px; text-align:center; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <img src="${p.image}" alt="${p.name}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;" onerror="this.src='https://via.placeholder.com/300x200?text=Mil+Sabores'">
        <span style="background:#eee; font-size:0.75rem; font-weight:bold; padding:3px 8px; border-radius:4px;">${p.code}</span>
        <h3 style="font-family:'Georgia',serif; color:#3e2723; margin:10px 0 5px; font-size:1.1rem;">${p.name}</h3>
        <p style="color:#a04000; font-weight:bold; font-size:1.2rem; margin-bottom:12px;">$${p.price.toLocaleString("es-CL")}</p>
      </div>
      <button onclick="abrirModal(${p.id})" class="btn btn-primary" style="background:#a04000; color:#fff; border:none; padding:10px; border-radius:6px; cursor:pointer; font-weight:bold; width:100%;">Ver Detalle / Pedir</button>
    </div>
  `).join("");
}

function filtrarCatalogo() {
  const busqueda = (document.getElementById("input-buscar")?.value || "").toLowerCase().trim();

  const resultado = listaProductos.filter(p => {
    const coincideCat = categoriaSeleccionada === "todas" || p.category === categoriaSeleccionada;
    const coincideTexto = p.name.toLowerCase().includes(busqueda) || 
                          p.code.toLowerCase().includes(busqueda) || 
                          p.description.toLowerCase().includes(busqueda);
    return coincideCat && coincideTexto;
  });

  renderizarTargetas(resultado);
}

function abrirModal(id) {
  const p = listaProductos.find(item => item.id === id);
  if (!p) return;

  document.getElementById("modal-prod-id").value = p.id;
  document.getElementById("modal-prod-code").textContent = p.code;
  document.getElementById("modal-prod-name").textContent = p.name;
  document.getElementById("modal-prod-price").textContent = `$${p.price.toLocaleString("es-CL")}`;
  document.getElementById("modal-prod-desc").textContent = p.description;
  document.getElementById("modal-dedicatoria").value = "";
  document.getElementById("modal-cantidad").value = 1;

  const modal = document.getElementById("modal-producto");
  if (modal) modal.style.display = "flex";
}

function cerrarModal() {
  const modal = document.getElementById("modal-producto");
  if (modal) modal.style.display = "none";
}

// Ejecución garantizada
function inicializar() {
  renderizarTargetas(listaProductos);

  const inputBuscar = document.getElementById("input-buscar");
  if (inputBuscar) {
    inputBuscar.addEventListener("input", filtrarCatalogo);
  }

  const botones = document.querySelectorAll(".btn-filtro");
  botones.forEach(btn => {
    btn.addEventListener("click", (e) => {
      botones.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      categoriaSeleccionada = e.target.getAttribute("data-cat");
      filtrarCatalogo();
    });
  });

  const btnCerrar = document.getElementById("modal-close-btn");
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializar);
} else {
  inicializar();
}