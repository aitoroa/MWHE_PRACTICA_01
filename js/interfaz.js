const botonMenu = document.querySelector("#boton-menu");
const textoBotonMenu = document.querySelector("#texto-boton-menu");
const menu = document.querySelector("#menu");
const enlacesMenu = document.querySelectorAll("#menu a");

function abrirMenu(abrir) {
  menu.classList.toggle("hidden", !abrir);
  botonMenu.setAttribute("aria-expanded", abrir);
  textoBotonMenu.textContent = abrir ? "Cerrar menú" : "Abrir menú";
}

botonMenu.addEventListener("click", function () {
  const estaAbierto = !menu.classList.contains("hidden");
  abrirMenu(!estaAbierto);
});

enlacesMenu.forEach(function (enlace) {
  enlace.addEventListener("click", function () {
    abrirMenu(false);
  });
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !menu.classList.contains("hidden")) {
    abrirMenu(false);
    botonMenu.focus();
  }
});

const botonTema = document.querySelector("#boton-tema");
const raizHtml = document.documentElement;

function actualizarBotonTema(esOscuro) {
  botonTema.setAttribute("aria-pressed", esOscuro);
  botonTema.setAttribute(
    "aria-label",
    esOscuro ? "Activar modo claro" : "Activar modo oscuro",
  );
}

actualizarBotonTema(raizHtml.classList.contains("dark"));

botonTema.addEventListener("click", function () {
  const esOscuro = raizHtml.classList.toggle("dark");
  actualizarBotonTema(esOscuro);
  localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");
});
