
const CLAVE_CARRITO = "mil_sabores_carrito";
const CLAVE_CUPON = "mil_sabores_cupon";
const CUPON_VALIDO = "FELICES50";
const PORCENTAJE_DESCUENTO = 0.10;
const CANTIDAD_MAXIMA_ITEM = 50;
const DURACION_ESTADO_BOTON_MS = 1500;
const DURACION_NOTIFICACION_MS = 2600;

/**
 * Resuelve la imagen de respaldo sin depender de que el catálogo esté cargado
 * @returns {string}
 */
function obtenerImagenPorDefecto() {
  return typeof IMAGEN_POR_DEFECTO !== "undefined"
    ? IMAGEN_POR_DEFECTO
    : "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Flogo.jpeg";
}

/**
 * Valida y normaliza un item del carrito
 * @returns {object|null} Item válido o null si el registro está corrupto
 */
function normalizarItemCarrito(item) {
  if (!item || typeof item !== "object") return null;

  const id = String(item.id ?? "").trim();
  const nombre = String(item.nombre ?? "").trim();
  const precio = Number(item.precio);
  const cantidad = Math.floor(Number(item.cantidad));

  if (!id || !nombre) return null;
  if (!Number.isFinite(precio) || precio < 0) return null;
  if (!Number.isFinite(cantidad) || cantidad < 1) return null;

  const imagen = typeof item.imagen === "string" && item.imagen.trim() ? item.imagen.trim() : obtenerImagenPorDefecto();

  return {
    id,
    nombre,
    precio,
    cantidad: Math.min(cantidad, CANTIDAD_MAXIMA_ITEM),
    imagen,
    descripcion: typeof item.descripcion === "string" ? item.descripcion : ""
  };
}

/**
 * Lee el carrito desde localStorage descartando registros corruptos
 * @returns {Array<object>}
 */
function obtenerCarritoSeguro() {
  try {
    const data = localStorage.getItem(CLAVE_CARRITO);
    if (!data) return [];

    const parseado = JSON.parse(data);
    if (!Array.isArray(parseado)) throw new TypeError("El carrito no es un arreglo");

    return parseado.map(normalizarItemCarrito).filter(Boolean);
  } catch (error) {
    console.warn("Carrito corrupto en localStorage, se reinicia:", error);
    localStorage.removeItem(CLAVE_CARRITO);
    return [];
  }
}

/**
 * Guarda el carrito normalizado
 * @param {Array<object>} carrito
 */
function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    console.error("No se pudo persistir el carrito:", error);
    mostrarNotificacion("No se pudo guardar el carrito en este navegador.", "danger");
  }
}


/**
 * @param {number} monto
 * @returns {string} Monto formateado como pesos chilenos
 */
function formatearMoneda(monto) {
  return "$" + Number(monto || 0).toLocaleString("es-CL");
}

function actualizarContadorNav() {
  const contador = document.getElementById("nav-carrito-contador");
  if (!contador) return;
  const totalItems = obtenerCarritoSeguro().reduce((acum, item) => acum + item.cantidad, 0);
  contador.textContent = String(totalItems);
}

/** Refresca la vista de carrito.html si estamos en esa pantalla */
function refrescarVistaCarrito() {
  if (typeof window.renderizarVistaCarrito === "function") {
    window.renderizarVistaCarrito();
  }
}


window.formatearMoneda = formatearMoneda;
window.obtenerCarritoSeguro = obtenerCarritoSeguro;

/**
 * Agrega un producto del catálogo al carrito
 * @param {string} idProducto
 * @param {number} cantidad
 * @returns {boolean} true si el producto se agregó o se acumuló
 */
window.agregarAlCarrito = function (idProducto, cantidad = 1) {
  if (typeof obtenerProductoPorId !== "function") {
    console.error("agregarAlCarrito: falta js/datos-catalogo.js en esta página");
    mostrarNotificacion("No se pudo agregar el producto.", "danger");
    return false;
  }

  const producto = obtenerProductoPorId(idProducto);
  if (!producto) {
    console.warn("agregarAlCarrito: id inexistente en el catálogo", idProducto);
    mostrarNotificacion("El producto seleccionado no está disponible.", "danger");
    return false;
  }

  const delta = Number(cantidad);
  if (!Number.isFinite(delta) || delta < 1) {
    console.warn("agregarAlCarrito: cantidad inválida", cantidad);
    mostrarNotificacion("Cantidad inválida.", "danger");
    return false;
  }

  const carrito = obtenerCarritoSeguro();
  const itemExistente = carrito.find(p => p.id === producto.id);
  const pedido = (itemExistente ? itemExistente.cantidad : 0) + Math.floor(delta);

  if (typeof tieneStock === "function" && !tieneStock(producto, pedido)) {
    const disponible = Number(producto.stock);
    mostrarNotificacion(
      disponible <= 0
        ? `${producto.nombre} no tiene stock disponible.`
        : `Solo quedan ${disponible} unidades de ${producto.nombre}.`,
      "warning"
    );
    return false;
  }

  if (itemExistente) {
    itemExistente.cantidad = Math.min(itemExistente.cantidad + Math.floor(delta), CANTIDAD_MAXIMA_ITEM);
  } else {
    carrito.push(normalizarItemCarrito({
      ...producto,
      cantidad: Math.floor(delta)
    }));
  }

  guardarCarrito(carrito);
  actualizarContadorNav();
  refrescarVistaCarrito();

  const agregados = itemExistente ? itemExistente.cantidad : 1;
  mostrarNotificacion(`${producto.nombre} agregado al carrito (${agregados} unidad${agregados === 1 ? "" : "es"}).`);

  return true;
};

/**
 * Suma o resta unidades de un item. Si la cantidad llega a 0, lo elimina.
 * @param {string} id
 * @param {number} delta
 * @returns {boolean}
 */
window.modificarCantidad = function (id, delta) {
  const carrito = obtenerCarritoSeguro();
  const item = carrito.find(p => p.id === id);
  if (!item) return false;

  const incremento = Number(delta);
  if (incremento > 0 && typeof tieneStock === "function") {
    const producto = obtenerProductoPorId(id);
    if (producto && !tieneStock(producto, item.cantidad + incremento)) {
      const disponible = Number(producto.stock);
      mostrarNotificacion(
        `Solo quedan ${disponible} unidades de ${producto.nombre}.`,
        "warning"
      );
      return false;
    }
  }

  item.cantidad += incremento;
  const carritoFinal = item.cantidad <= 0
    ? carrito.filter(p => p.id !== id)
    : carrito;

  guardarCarrito(carritoFinal);
  actualizarContadorNav();
  refrescarVistaCarrito();
  return true;
};

window.eliminarProducto = function (id) {
  const carritoFinal = obtenerCarritoSeguro().filter(p => p.id !== id);
  guardarCarrito(carritoFinal);
  actualizarContadorNav();
  refrescarVistaCarrito();
  mostrarNotificacion("Producto eliminado del carrito.");
  return true;
};

window.vaciarCarrito = function () {
  localStorage.removeItem(CLAVE_CARRITO);
  actualizarContadorNav();
  refrescarVistaCarrito();
  mostrarNotificacion("Carrito vaciado.", "warning");
};


function obtenerHostNotificaciones() {
  let host = document.getElementById("ms-notificaciones");
  if (!host) {
    host = document.createElement("div");
    host.id = "ms-notificaciones";
    host.className = "ms-notificaciones";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
  }
  return host;
}

/**
 * Muestra un aviso efímero en la esquina inferior derecha
 * @param {string} mensaje
 * @param {"success"|"warning"|"danger"|"info"} variante
 */
window.mostrarNotificacion = function (mensaje, variante = "success") {
  if (!mensaje) return;

  const toast = document.createElement("div");
  toast.className = `ms-notificacion ms-notificacion--${variante}`;
  toast.textContent = mensaje;
  obtenerHostNotificaciones().appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, DURACION_NOTIFICACION_MS);
};

/**
 * Bloquea el botón y muestra confirmación temporal
 * @param {HTMLElement} boton
 * @returns {boolean} false si el botón ya estaba bloqueado
 */
window.marcarBotonAgregado = function (boton) {
  if (!boton || boton.dataset.msBloqueado === "1") return false;

  boton.dataset.msBloqueado = "1";
  boton.dataset.msHtmlOriginal = boton.innerHTML;
  boton.classList.add("is-added");
  boton.disabled = true;
  boton.innerHTML = '<span class="ms-check" aria-hidden="true">&#10003;</span> Agregado';

  setTimeout(() => {
    boton.classList.remove("is-added");
    boton.disabled = false;
    boton.innerHTML = boton.dataset.msHtmlOriginal || "Añadir";
    delete boton.dataset.msBloqueado;
    delete boton.dataset.msHtmlOriginal;
  }, DURACION_ESTADO_BOTON_MS);

  return true;
};


document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorNav();

  const contenedorLista = document.getElementById("lista-carrito");
  if (!contenedorLista) return;

  const contenedorVacio = document.getElementById("carrito-vacio");
  const labelSubtotal = document.getElementById("resumen-subtotal");
  const labelDescuento = document.getElementById("resumen-descuento");
  const filaDescuento = document.getElementById("fila-descuento");
  const labelTotal = document.getElementById("resumen-total");
  const inputCupon = document.getElementById("input-cupon");
  const btnCupon = document.getElementById("btn-aplicar-cupon");
  const msgCupon = document.getElementById("mensaje-cupon");
  const btnPagar = document.getElementById("btn-pagar");

  function obtenerPorcentajeDescuento() {
    const cuponGuardado = (localStorage.getItem(CLAVE_CUPON) || "").toUpperCase();
    return cuponGuardado === CUPON_VALIDO ? PORCENTAJE_DESCUENTO : 0;
  }

  window.renderizarVistaCarrito = function () {
    const carrito = obtenerCarritoSeguro();
    contenedorLista.innerHTML = "";
    let subtotal = 0;

    if (carrito.length === 0) {
      contenedorVacio?.classList.remove("d-none");
      if (btnPagar) btnPagar.disabled = true;
    } else {
      contenedorVacio?.classList.add("d-none");
      if (btnPagar) btnPagar.disabled = false;

      carrito.forEach(producto => {
        subtotal += producto.precio * producto.cantidad;

        const card = document.createElement("article");
        card.className = "card border-0 shadow-sm p-3";
        card.innerHTML = `
          <div class="row align-items-center g-3">
            <div class="col-3 col-sm-2 text-center">
              <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded" style="max-height: 75px; object-fit: cover;"
                   onerror="this.onerror=null;this.src='${obtenerImagenPorDefecto()}'">
            </div>
            <div class="col-9 col-sm-5">
              <h5 class="fw-bold mb-1">${producto.nombre}</h5>
              <p class="small text-muted mb-0">${producto.descripcion || "Sin descripción disponible"}</p>
            </div>
            <div class="col-6 col-sm-2 text-sm-end">
              <span class="fw-bold text-dark">${formatearMoneda(producto.precio)}</span>
            </div>
            <div class="col-6 col-sm-3 d-flex align-items-center justify-content-end gap-2">
              <button type="button" class="btn btn-sm btn-outline-secondary px-2" onclick="modificarCantidad('${producto.id}', -1)" title="Disminuir cantidad" aria-label="Disminuir cantidad de ${producto.nombre}">&minus;</button>
              <span class="badge bg-light text-dark border px-3 py-2 fs-6">${producto.cantidad}</span>
              <button type="button" class="btn btn-sm btn-outline-secondary px-2" onclick="modificarCantidad('${producto.id}', 1)" title="Aumentar cantidad" aria-label="Aumentar cantidad de ${producto.nombre}">&plus;</button>
              <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarProducto('${producto.id}')" title="Eliminar" aria-label="Eliminar ${producto.nombre} del carrito">&times;</button>
            </div>
          </div>
        `;
        contenedorLista.appendChild(card);
      });
    }

    const porcentajeDescuento = obtenerPorcentajeDescuento();
    const descuentoMonto = Math.round(subtotal * porcentajeDescuento);
    const total = Math.max(0, subtotal - descuentoMonto);

    if (labelSubtotal) labelSubtotal.textContent = formatearMoneda(subtotal);
    if (labelTotal) labelTotal.textContent = formatearMoneda(total);

    if (filaDescuento && labelDescuento) {
      const hayDescuento = porcentajeDescuento > 0;
      filaDescuento.classList.toggle("d-none", !hayDescuento);
      if (hayDescuento) labelDescuento.textContent = `-${formatearMoneda(descuentoMonto)}`;
    }
  };

  const cuponPrevio = localStorage.getItem(CLAVE_CUPON);
  if (cuponPrevio && inputCupon && msgCupon) {
    inputCupon.value = cuponPrevio;
    if (cuponPrevio.toUpperCase() === CUPON_VALIDO) {
      msgCupon.className = "form-text text-success";
      msgCupon.textContent = `Cupón ${CUPON_VALIDO} activo: ${PORCENTAJE_DESCUENTO * 100}% de descuento aplicado.`;
    }
  }

  if (btnCupon && inputCupon && msgCupon) {
    btnCupon.addEventListener("click", () => {
      const codigo = inputCupon.value.trim().toUpperCase();

      if (codigo === CUPON_VALIDO) {
        localStorage.setItem(CLAVE_CUPON, CUPON_VALIDO);
        msgCupon.className = "form-text text-success";
        msgCupon.textContent = `Cupón ${CUPON_VALIDO} aplicado: ${PORCENTAJE_DESCUENTO * 100}% de descuento.`;
      } else if (codigo === "") {
        localStorage.removeItem(CLAVE_CUPON);
        msgCupon.className = "form-text text-muted";
        msgCupon.textContent = "";
      } else {
        localStorage.removeItem(CLAVE_CUPON);
        msgCupon.className = "form-text text-danger";
        msgCupon.textContent = "Cupón inválido o caducado.";
      }

      window.renderizarVistaCarrito();
    });
  }

  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      if (obtenerCarritoSeguro().length === 0) return;

      alert("¡Pedido confirmado con éxito! Gracias por celebrar los 50 años de Pastelería Mil Sabores.");
      localStorage.removeItem(CLAVE_CARRITO);
      localStorage.removeItem(CLAVE_CUPON);
      if (inputCupon) inputCupon.value = "";
      if (msgCupon) {
        msgCupon.className = "form-text text-muted";
        msgCupon.textContent = "";
      }
      actualizarContadorNav();
      window.renderizarVistaCarrito();
    });
  }

  window.renderizarVistaCarrito();
});
