/**
 * Panel de administración de productos.
 *
 * No mantiene su propia copia del inventario: toda lectura y escritura pasa por
 * la capa de datos de js/datos-catalogo.js, que es la que comparte con la tienda.
 */

const RUTA_FORMULARIO_PRODUCTO = "admin-form-productos.html";
const RUTA_LISTADO_PRODUCTO = "admin-productos.html";

// -------------------------------------------------------------
// VISTA: admin-productos.html (Listado de Inventario)
// -------------------------------------------------------------
function inicializarVistaListado() {
  const tablaBody = document.getElementById("tabla-productos-body");
  if (!tablaBody) return;

  if (typeof obtenerCatalogo !== "function") {
    tablaBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">No se pudo cargar el inventario.</td></tr>`;
    return;
  }

  const inventario = obtenerCatalogo();
  tablaBody.innerHTML = "";

  if (inventario.length === 0) {
    tablaBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No hay productos registrados en el inventario.</td></tr>`;
    return;
  }

  inventario.forEach(prod => {
    const esCritico = prod.stock <= prod.stockCritico;
    const badgeStock = esCritico
      ? `<span class="badge badge-stock-critico">Crítico (${prod.stock})</span>`
      : `<span class="badge badge-stock-ok">${prod.stock} un.</span>`;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td class="fw-bold">${prod.id}</td>
      <td>
        <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 42px; height: 42px; object-fit: contain;" class="rounded me-2 border"
             onerror="this.onerror=null;this.src='${IMAGEN_POR_DEFECTO}'">
        ${prod.nombre}
      </td>
      <td><span class="badge bg-light text-dark border">${prod.categoria}</span></td>
      <td>$${Number(prod.precio).toLocaleString("es-CL")}</td>
      <td>${badgeStock}</td>
      <td>${prod.stockCritico} un.</td>
      <td class="text-end">
        <a href="${RUTA_FORMULARIO_PRODUCTO}?id=${prod.id}" class="btn btn-sm btn-outline-primary me-1" title="Editar">
          Editar
        </a>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProductoAdmin('${prod.id}')" title="Eliminar">
          Eliminar
        </button>
      </td>
    `;
    tablaBody.appendChild(fila);
  });
}

// Acción de eliminación
window.eliminarProductoAdmin = function (id) {
  if (typeof eliminarProducto !== "function") return;

  const producto = obtenerProductoPorId(id);
  if (confirm(`¿Estás seguro de eliminar el producto ${producto ? producto.nombre : id}?`)) {
    eliminarProducto(id);
    inicializarVistaListado();
  }
};

function inicializarVistaFormulario() {
  const form = document.getElementById("form-producto");
  if (!form) return;

  if (typeof obtenerCatalogo !== "function") {
    alert("No se pudo cargar la capa de datos. Revisa que js/datos-catalogo.js esté incluido.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get("id");

  const tituloVista = document.getElementById("form-titulo-vista");
  const subtituloVista = document.getElementById("form-subtitulo-vista");
  const btnGuardar = document.getElementById("btn-guardar-producto");

  const inputCodigo = document.getElementById("prod-codigo");
  const inputNombre = document.getElementById("prod-nombre");
  const selectCategoria = document.getElementById("prod-categoria");
  const inputPrecio = document.getElementById("prod-precio");
  const inputStock = document.getElementById("prod-stock");
  const inputStockCritico = document.getElementById("prod-stock-critico");
  const inputImagen = document.getElementById("prod-imagen");
  const inputDescripcion = document.getElementById("prod-descripcion");

  // Las categorías salen del inventario, no de una lista fija en el HTML.
  poblarSelectCategorias(selectCategoria);

  let modoEdicion = false;

  if (prodId) {
    const productoExistente = obtenerProductoPorId(prodId);
    if (productoExistente) {
      modoEdicion = true;
      tituloVista.textContent = "Editar Producto";
      subtituloVista.textContent = `Actualizando información para el código ${productoExistente.id}`;
      btnGuardar.textContent = "Actualizar Cambios";

      // Llenar campos
      inputCodigo.value = productoExistente.id;
      inputCodigo.readOnly = true; // No modificar llave primaria
      inputNombre.value = productoExistente.nombre;
      selectCategoria.value = productoExistente.categoria;
      inputPrecio.value = productoExistente.precio;
      inputStock.value = productoExistente.stock;
      inputStockCritico.value = productoExistente.stockCritico;
      inputImagen.value = productoExistente.imagen === IMAGEN_POR_DEFECTO ? "" : productoExistente.imagen;
      inputDescripcion.value = productoExistente.descripcion;
    } else {
      subtituloVista.textContent = `El código ${prodId} ya no existe en el inventario. Se hará un alta nueva.`;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const datosProducto = {
      id: inputCodigo.value.trim().toUpperCase(),
      nombre: inputNombre.value.trim(),
      categoria: selectCategoria.value,
      precio: parseInt(inputPrecio.value, 10),
      stock: parseInt(inputStock.value, 10),
      stockCritico: parseInt(inputStockCritico.value, 10),
      imagen: inputImagen.value.trim() || IMAGEN_POR_DEFECTO,
      descripcion: inputDescripcion.value.trim()
    };

    const resultado = modoEdicion
      ? actualizarProducto(datosProducto)
      : crearProducto(datosProducto);

    if (!resultado.ok) {
      alert(resultado.mensaje);
      return;
    }

    alert(resultado.mensaje);
    window.location.href = RUTA_LISTADO_PRODUCTO;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarVistaListado();
  inicializarVistaFormulario();
});
