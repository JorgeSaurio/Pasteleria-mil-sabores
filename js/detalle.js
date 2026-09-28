document.addEventListener("DOMContentLoaded", () => {
  if (typeof CATALOGO_PRODUCTOS === "undefined") return;


  // Este módulo solo aplica en detalle-producto.html. Si el DOM de detalle no
  // está presente, se auto-inactiva para no tocar document.title en otra página.
  const nombre = document.getElementById("nombre-producto");
  if (!nombre) return;


  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get("id") || "TC001";


  const producto = CATALOGO_PRODUCTOS.find(p => p.id === prodId) || CATALOGO_PRODUCTOS[0];


  const breadcrumb = document.getElementById("breadcrumb-actual");
  const categoria = document.getElementById("categoria-producto");
  const precio = document.getElementById("precio-producto");
  const descripcion = document.getElementById("descripcion-producto");
  const imagen = document.getElementById("img-producto");


  // Inyección de datos principales
  document.title = `Pastelería Mil Sabores | ${producto.nombre}`;


  if (breadcrumb) breadcrumb.textContent = producto.nombre;
  nombre.textContent = producto.nombre;
  if (categoria) categoria.textContent = producto.categoria;
  if (precio) precio.textContent = formatearMoneda(producto.precio);
  if (descripcion) descripcion.textContent = producto.descripcion;
  if (imagen) {
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
  }


  // Evento Añadir al Carrito
  const btnAgregar = document.getElementById("btn-agregar-detalle");
  const inputCantidad = document.getElementById("cantidad-producto");
  const alerta = document.getElementById("alerta-agregado");


  if (btnAgregar && inputCantidad) {
    btnAgregar.addEventListener("click", () => {
      const cant = parseInt(inputCantidad.value, 10) || 1;
      if (!window.agregarAlCarrito(producto.id, cant)) return;


      if (alerta) {
        alerta.classList.remove("d-none");
        setTimeout(() => {
          alerta.classList.add("d-none");
        }, 2500);
      }
    });
  }


  // Productos relacionados
  const contenedorRel = document.getElementById("grilla-relacionados");
  if (contenedorRel) {
    const relacionados = CATALOGO_PRODUCTOS.filter(p => p.id !== producto.id).slice(0, 4);


    relacionados.forEach(p => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <article class="card h-100 border-0 shadow-sm text-center p-2">
          <a href="detalle-producto.html?id=${p.id}">
            <img src="${p.imagen}" class="card-img-top mx-auto" alt="${p.nombre}" style="height: 100px; object-fit: contain;">
          </a>
          <div class="card-body p-2">
            <h3 class="card-title small fw-bold mb-1">
              <a href="detalle-producto.html?id=${p.id}" class="text-dark text-decoration-none">${p.nombre}</a>
            </h3>
            <span class="text-muted small">${formatearMoneda(p.precio)}</span>
          </div>
        </article>
      `;
      contenedorRel.appendChild(col);
    });
  }
});



