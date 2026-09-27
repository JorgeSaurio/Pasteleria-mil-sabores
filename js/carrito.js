const CLAVE_CARRITO = "mil_sabores_carrito";
const CLAVE_CUPON = "mil_sabores_cupon";

/**
 * Obtiene la lista actual de productos del carrito con control de errores
 * @returns {Array} Colección de productos
 */
function obtenerCarritoSeguro() {
  try {
    const data = localStorage.getItem(CLAVE_CARRITO);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer el carrito de localStorage:", error);
    localStorage.removeItem(CLAVE_CARRITO);
    return [];
  }
}

function formatearMoneda(monto) {
  return "$" + Number(monto || 0).toLocaleString("es-CL");
}

function actualizarContadorNav() {
  const contador = document.getElementById("nav-carrito-contador");
  if (!contador) return;
  const carrito = obtenerCarritoSeguro();
  const totalItems = carrito.reduce((acum, item) => acum + (item.cantidad || 0), 0);
  contador.textContent = totalItems;
}


window.agregarAlCarrito = function (id, nombre, precio, imagen = "logo.jpeg", descripcion = "", cantidad = 1) {
  if (!id || !nombre || precio === undefined) {
    console.warn("agregarAlCarrito: Parámetros inválidos", { id, nombre, precio });
    return;
  }

  let carrito = obtenerCarritoSeguro();
  const itemExistente = carrito.find(p => p.id === id);

  if (itemExistente) {
    itemExistente.cantidad += Number(cantidad);
  } else {
    carrito.push({
      id: String(id),
      nombre: String(nombre),
      precio: Number(precio),
      cantidad: Number(cantidad),
      imagen: imagen || "logo.jpeg",
      descripcion: descripcion || ""
    });
  }

  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorNav();

  // Si estamos en la vista de carrito.html, refrescar la tabla
  if (typeof window.renderizarVistaCarrito === "function") {
    window.renderizarVistaCarrito();
  }
};

window.modificarCantidad = function (id, delta) {
  let carrito = obtenerCarritoSeguro();
  const item = carrito.find(p => p.id === id);

  if (item) {
    item.cantidad += Number(delta);
    if (item.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== id);
    }
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorNav();
    if (typeof window.renderizarVistaCarrito === "function") {
      window.renderizarVistaCarrito();
    }
  }
};

window.eliminarProducto = function (id) {
  let carrito = obtenerCarritoSeguro();
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorNav();
  if (typeof window.renderizarVistaCarrito === "function") {
    window.renderizarVistaCarrito();
  }
};

window.vaciarCarrito = function () {
  localStorage.removeItem(CLAVE_CARRITO);
  actualizarContadorNav();
  if (typeof window.renderizarVistaCarrito === "function") {
    window.renderizarVistaCarrito();
  }
};

// Inicialización de la vista cuando se está en carrito.html
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorNav();//actualiza el numerito del logo en el navbar

  // Nodos específicos de la pantalla carrito.html
  const contenedorLista = document.getElementById("lista-carrito");
  const contenedorVacio = document.getElementById("carrito-vacio");
  const labelSubtotal = document.getElementById("resumen-subtotal");
  const labelDescuento = document.getElementById("resumen-descuento");
  const filaDescuento = document.getElementById("fila-descuento");
  const labelTotal = document.getElementById("resumen-total");
  const inputCupon = document.getElementById("input-cupon");
  const btnCupon = document.getElementById("btn-aplicar-cupon");
  const msgCupon = document.getElementById("mensaje-cupon");
  const btnPagar = document.getElementById("btn-pagar");

  // Si no estamos en la página del carrito, terminamos aquí
  if (!contenedorLista) return;

  /**
   * Determina el descuento vigente consultando el cupón persistente
   */
  function obtenerPorcentajeDescuento() {
    const cuponGuardado = (localStorage.getItem(CLAVE_CUPON) || "").toUpperCase();
    if (cuponGuardado === "FELICES50") {
      return 0.10;
    }
    return 0;
  }

  window.renderizarVistaCarrito = function () {
    const carrito = obtenerCarritoSeguro();
    contenedorLista.innerHTML = "";
    let subtotal = 0;

    if (carrito.length === 0) {
      if (contenedorVacio) contenedorVacio.classList.remove("d-none");
      if (btnPagar) btnPagar.disabled = true;
    } else {
      if (contenedorVacio) contenedorVacio.classList.add("d-none");
      if (btnPagar) btnPagar.disabled = false;

      carrito.forEach(producto => {
        const itemSubtotal = producto.precio * producto.cantidad;
        subtotal += itemSubtotal;

        const card = document.createElement("article");
        card.className = "card border-0 shadow-sm p-3";
        card.innerHTML = `
          <div class="row align-items-center g-3">
            <div class="col-3 col-sm-2 text-center">
              <img src="${producto.imagen || 'logo.jpeg'}" alt="${producto.nombre}" class="img-fluid rounded" style="max-height: 75px; object-fit: cover;">
            </div>
            <div class="col-9 col-sm-5">
              <h5 class="fw-bold mb-1">${producto.nombre}</h5>
              <p class="small text-muted mb-0">${producto.descripcion || 'Sin descripción disponible'}</p>
            </div>
            <div class="col-6 col-sm-2 text-sm-end">
              <span class="fw-bold text-dark">${formatearMoneda(producto.precio)}</span>
            </div>
            <div class="col-6 col-sm-3 d-flex align-items-center justify-content-end gap-2">
              <button class="btn btn-sm btn-outline-secondary px-2" onclick="modificarCantidad('${producto.id}', -1)" title="Disminuir">&minus;</button>
              <span class="badge bg-light text-dark border px-3 py-2 fs-6">${producto.cantidad}</span>
              <button class="btn btn-sm btn-outline-secondary px-2" onclick="modificarCantidad('${producto.id}', 1)" title="Aumentar">&plus;</button>
              <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarProducto('${producto.id}')" title="Eliminar">&times;</button>
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
      if (porcentajeDescuento > 0) {
        filaDescuento.classList.remove("d-none");
        labelDescuento.textContent = `-${formatearMoneda(descuentoMonto)}`;
      } else {
        filaDescuento.classList.add("d-none");
      }
    }
  };

  // Restaurar estado visual del cupón si ya estaba persistido
  const cuponPrevio = localStorage.getItem(CLAVE_CUPON);
  if (cuponPrevio && inputCupon && msgCupon) {
    inputCupon.value = cuponPrevio;
    if (cuponPrevio.toUpperCase() === "FELICES50") {
      msgCupon.className = "form-text text-success";
      msgCupon.textContent = "Cupón FELICES50 activo: 10% de descuento aplicado de por vida.";
    }
  }

  // Evento: Aplicar y persistir cupón
  if (btnCupon && inputCupon && msgCupon) {
    btnCupon.addEventListener("click", () => {
      const codigo = inputCupon.value.trim().toUpperCase();

      if (codigo === "FELICES50") {
        localStorage.setItem(CLAVE_CUPON, "FELICES50");
        msgCupon.className = "form-text text-success";
        msgCupon.textContent = "Cupón FELICES50 aplicado: 10% de descuento.";
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

  // Evento: Pagar y confirmación
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      const carrito = obtenerCarritoSeguro();
      if (carrito.length > 0) {
        alert("¡Pedido confirmado con éxito! Gracias por celebrar los 50 años de Pastelería Mil Sabores.");
        localStorage.removeItem(CLAVE_CARRITO);
        actualizarContadorNav();
        window.renderizarVistaCarrito();
      }
    });
  }

  window.renderizarVistaCarrito();
});