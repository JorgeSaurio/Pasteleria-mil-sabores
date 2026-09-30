document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("grilla-productos");
  const filtro = document.getElementById("filtro-categoria");

  // El filtro se arma con las categorías reales del inventario, no con una lista fija.
  if (typeof poblarSelectCategorias === "function") {
    poblarSelectCategorias(filtro, { todas: "Todas las categorías" });
  }

  if (!contenedor || typeof obtenerCatalogo !== "function") return;

  /**
   * Recorta el texto solo cuando realmente supera el largo permitido
   * @param {string} texto
   * @param {number} largo
   * @returns {string}
   */
  function resumir(texto, largo = 75) {
    const limpio = String(texto || "");
    return limpio.length > largo ? limpio.slice(0, largo).trimEnd() + "..." : limpio;
  }

  function renderizarProductos(categoriaSeleccionada = "TODAS") {
    const catalogo = obtenerCatalogo();
    const filtrados = categoriaSeleccionada === "TODAS"
      ? catalogo
      : catalogo.filter(p => p.categoria === categoriaSeleccionada);

    if (filtrados.length === 0) {
      const catalogoVacio = catalogo.length === 0;
      contenedor.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center py-5 shadow-sm mb-0">
            <h2 class="alert-heading font-titulo h4">Sin resultados</h2>
            <p class="mb-0">${catalogoVacio
              ? "El catálogo se está actualizando. Vuelve a cargar en un momento."
              : "No tenemos productos en la categoría seleccionada."}</p>
          </div>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = filtrados.map(p => {
      const disponible = tieneStock(p, 1);
      return `
      <div class="col">
        <article class="card h-100 border-0 shadow-sm product-card">
          <a href="detalle-producto.html?id=${p.id}" class="text-decoration-none d-block">
            <img src="${p.imagen}" class="card-img-top p-3" alt="${p.nombre}" loading="lazy"
                 style="height: 180px; object-fit: contain;"
                 onerror="this.onerror=null;this.src='${IMAGEN_POR_DEFECTO}'">
          </a>
          <div class="card-body d-flex flex-column">
            <span class="badge bg-light text-muted border w-fit mb-2 align-self-start">${p.categoria}</span>
            <h2 class="card-title fs-6 fw-bold mb-1">
              <a href="detalle-producto.html?id=${p.id}" class="text-dark text-decoration-none stretched-link">${p.nombre}</a>
            </h2>
            <p class="card-text text-muted small flex-grow-1">${resumir(p.descripcion)}</p>
            <div class="d-flex justify-content-between align-items-center mt-3 gap-2">
              <span class="fw-bold fs-5 text-dark">${formatearMoneda(p.precio)}</span>
              <button type="button" class="btn btn-sm btn-anadir position-relative z-2"
                      data-agregar-id="${p.id}"
                      ${disponible ? "" : "disabled"}
                      aria-label="${disponible ? `Agregar ${p.nombre} al carrito` : `${p.nombre} sin stock`}">
                ${disponible ? "Añadir" : "Sin stock"}
              </button>
            </div>
          </div>
        </article>
      </div>
    `;
    }).join("");
  }

  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-agregar-id]");
    if (!boton || !contenedor.contains(boton)) return;

    if (window.agregarAlCarrito(boton.dataset.agregarId, 1)) {
      window.marcarBotonAgregado(boton);
    }
  });

  if (filtro) {
    filtro.addEventListener("change", (e) => renderizarProductos(e.target.value));
  }

  renderizarProductos();
});
