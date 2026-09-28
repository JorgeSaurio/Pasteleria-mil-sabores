const MS_CANTIDAD_DESTACADOS = 8;
const MS_RETARDO_ESQUELETO_MS = 350;


/**
 * Inserta tarjetas de carga mientras se resuelve la grilla
 * @param {HTMLElement} contenedor
 * @param {number} cantidad
 */
function renderizarEsqueletos(contenedor, cantidad) {
  contenedor.innerHTML = Array.from({ length: cantidad }, () => `
    <div class="col">
      <article class="card h-100 border-0 shadow-sm product-card" aria-hidden="true">
        <div class="ms-esqueleto ms-esqueleto--img"></div>
        <div class="card-body d-flex flex-column">
          <div class="ms-esqueleto ms-esqueleto--linea ms-esqueleto--ancho-75"></div>
          <div class="ms-esqueleto ms-esqueleto--linea ms-esqueleto--ancho-50"></div>
          <div class="d-flex justify-content-between align-items-center mt-4">
            <div class="ms-esqueleto ms-esqueleto--linea ms-esqueleto--precio"></div>
            <div class="ms-esqueleto ms-esqueleto--boton"></div>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}


/**
 * Renderiza el estado vacío cuando el catálogo no tiene destacados
 * @param {HTMLElement} contenedor
 */
function renderizarVacio(contenedor) {
  contenedor.innerHTML = `
    <div class="col-12">
      <div class="alert alert-info text-center py-5 shadow-sm mb-0">
        <h3 class="alert-heading font-titulo">Pronto habrá novedades</h3>
        <p class="mb-3">No tenemos favoritos publicados por el momento.</p>
        <a href="productos.html" class="btn btn-anadir">Explorar el catálogo</a>
      </div>
    </div>
  `;
}


/**
 * Renderiza la grilla de destacados del home
 * @param {HTMLElement} contenedor
 */
function renderizarDestacados(contenedor) {
  if (typeof CATALOGO_PRODUCTOS === "undefined") {
    console.error("app.js: falta js/datos-catalogo.js");
    return;
  }


  const destacados = CATALOGO_PRODUCTOS.slice(0, MS_CANTIDAD_DESTACADOS);
  if (destacados.length === 0) {
    renderizarVacio(contenedor);
    return;
  }


  contenedor.innerHTML = destacados.map(p => `
    <div class="col">
      <article class="card h-100 border-0 shadow-sm product-card">
        <a href="detalle-producto.html?id=${p.id}" class="text-decoration-none d-block">
          <img src="${p.imagen}" class="card-img-top p-3" alt="${p.nombre}" loading="lazy"
               style="height: 160px; object-fit: contain;"
               onerror="this.onerror=null;this.src='${IMAGEN_POR_DEFECTO}'">
        </a>
        <div class="card-body d-flex flex-column">
          <h3 class="card-title fs-6 fw-bold mb-1">
            <a href="detalle-producto.html?id=${p.id}" class="text-dark text-decoration-none stretched-link">${p.nombre}</a>
          </h3>
          <div class="d-flex justify-content-between align-items-center mt-3 gap-2">
            <span class="fw-bold fs-6 text-dark">${formatearMoneda(p.precio)}</span>
            <button type="button" class="btn btn-sm btn-anadir position-relative z-2"
                    data-agregar-id="${p.id}"
                    aria-label="Agregar ${p.nombre} al carrito">
              Añadir
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}


document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("grilla-destacados");
  if (!contenedor) return;


  renderizarEsqueletos(contenedor, MS_CANTIDAD_DESTACADOS);
  setTimeout(() => renderizarDestacados(contenedor), MS_RETARDO_ESQUELETO_MS);


  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-agregar-id]");
    if (!boton || !contenedor.contains(boton)) return;


    if (window.agregarAlCarrito(boton.dataset.agregarId, 1)) {
      window.marcarBotonAgregado(boton);
    }
  });
});





