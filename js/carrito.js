/**
 * Lógica de Carrito de Compras con persistencia en LocalStorage
 * Proyecto: Pastelería 1000 Sabores
 */

document.addEventListener("DOMContentLoaded", () => {
  // Clave única acordada para LocalStorage
  const CLAVE_STORAGE = "mil_sabores_carrito";

  // Carga demostrativa inicial si no hay datos almacenados
  if (!localStorage.getItem(CLAVE_STORAGE)) {
    const productosEjemplo = [
      {
        id: "TC001",
        nombre: "Torta Cuadrada de Chocolate",
        precio: 45000,
        cantidad: 1,
        imagen: "logo.jpeg",
        descripcion: "Deliciosa torta con ganache de chocolate y toque de avellanas."
      },
      {
        id: "TT001",
        nombre: "Torta Circular de Vainilla",
        precio: 40000,
        cantidad: 2,
        imagen: "logo.jpeg",
        descripcion: "Clásica masa de vainilla rellena con suave crema pastelera."
      }
    ];
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productosEjemplo));
  }

  let carrito = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
  let porcentajeDescuento = 0;

  // Nodos del DOM
  const contenedorLista = document.getElementById("lista-carrito");
  const contenedorVacio = document.getElementById("carrito-vacio");
  const labelSubtotal = document.getElementById("resumen-subtotal");
  const labelDescuento = document.getElementById("resumen-descuento");
  const filaDescuento = document.getElementById("fila-descuento");
  const labelTotal = document.getElementById("resumen-total");
  const contadorNav = document.getElementById("nav-carrito-contador");
  const inputCupon = document.getElementById("input-cupon");
  const btnCupon = document.getElementById("btn-aplicar-cupon");
  const msgCupon = document.getElementById("mensaje-cupon");
  const btnPagar = document.getElementById("btn-pagar");

  // Formateo de moneda CLP
  const formatearMoneda = (monto) => "$" + monto.toLocaleString("es-CL");

  // Guardar estado actual en LocalStorage
  const guardarCarrito = () => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
    renderizarCarrito();
  };

  // Métodos expuestos globalmente para eventos onclick en el HTML generado
  window.modificarCantidad = (id, delta) => {
    const item = carrito.find(p => p.id === id);
    if (item) {
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
      }
      guardarCarrito();
    }
  };

  window.eliminarProducto = (id) => {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
  };

  // Renderizado dinámico de la lista de productos
  const renderizarCarrito = () => {
    if (!contenedorLista) return;

    contenedorLista.innerHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
      if (contenedorVacio) contenedorVacio.classList.remove("d-none");
      if (btnPagar) btnPagar.disabled = true;
    } else {
      if (contenedorVacio) contenedorVacio.classList.add("d-none");
      if (btnPagar) btnPagar.disabled = false;

      carrito.forEach(producto => {
        const itemSubtotal = producto.precio * producto.cantidad;
        subtotal += itemSubtotal;
        totalItems += producto.cantidad;

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

    // Cálculos y totales
    const descuentoMonto = Math.round(subtotal * porcentajeDescuento);
    const total = subtotal - descuentoMonto;

    if (labelSubtotal) labelSubtotal.textContent = formatearMoneda(subtotal);
    if (labelTotal) labelTotal.textContent = formatearMoneda(total);
    if (contadorNav) contadorNav.textContent = totalItems;

    if (filaDescuento && labelDescuento) {
      if (porcentajeDescuento > 0) {
        filaDescuento.classList.remove("d-none");
        labelDescuento.textContent = `-${formatearMoneda(descuentoMonto)}`;
      } else {
        filaDescuento.classList.add("d-none");
      }
    }
  };

  // Evento: Aplicar Cupón (Regla de negocio: FELICES50 = 10% descuento)
  if (btnCupon && inputCupon && msgCupon) {
    btnCupon.addEventListener("click", () => {
      const codigo = inputCupon.value.trim().toUpperCase();
      if (codigo === "FELICES50") {
        porcentajeDescuento = 0.10;
        msgCupon.className = "form-text text-success";
        msgCupon.textContent = "Cupón FELICES50 aplicado: 10% de descuento.";
      } else if (codigo === "") {
        porcentajeDescuento = 0;
        msgCupon.className = "form-text text-muted";
        msgCupon.textContent = "";
      } else {
        porcentajeDescuento = 0;
        msgCupon.className = "form-text text-danger";
        msgCupon.textContent = "Cupón inválido o caducado.";
      }
      renderizarCarrito();
    });
  }

  // Evento: Confirmación de Pago
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      if (carrito.length > 0) {
        alert("¡Pedido confirmado con éxito! Gracias por celebrar los 50 años de Pastelería Mil Sabores.");
        carrito = [];
        guardarCarrito();
      }
    });
  }

  // Inicialización
  renderizarCarrito();
});