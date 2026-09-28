document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  const caso1 = document.getElementById("articulo-caso-1");
  const caso2 = document.getElementById("articulo-caso-2");
  const separador = document.getElementById("separador");

  if (!caso1 || !caso2) return;

  if (blogId === "1") {
    // Mostrar únicamente el caso 1 (Récord Guinness)
    caso2.style.display = "none";
    if (separador) separador.style.display = "none";
    document.title = "Pastelería Mil Sabores | Récord Guinness 1995";
  } else if (blogId === "2") {
    // Mostrar únicamente el caso 2 (Técnicas y Comunidad)
    caso1.style.display = "none";
    if (separador) separador.style.display = "none";
    document.title = "Pastelería Mil Sabores | Ciencia del Bizcocho Tradicional";
  } else {
    // Si no viene parámetro id, se muestran ambos artículos
    caso1.style.display = "block";
    caso2.style.display = "block";
    if (separador) separador.style.display = "block";
  }
});