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

const cabecera = document.querySelector("#cabecera");
const volverArriba = document.querySelector("#volver-arriba");
const videoPortada = document.querySelector("#inicio");

function alHacerScroll() {
  const scrollActual = window.scrollY;

  cabecera.classList.toggle("cabecera-con-fondo", scrollActual > 20);

  const finVideo = videoPortada.getBoundingClientRect().bottom;
  const menuAbierto = !menu.classList.contains("hidden");
  cabecera.classList.toggle("cabecera-oculta", finVideo > 100 && !menuAbierto);

  volverArriba.classList.toggle("visible", scrollActual > 800);
}

window.addEventListener("scroll", alHacerScroll, { passive: true });
alHacerScroll();

const observadorVideo = new ResizeObserver(alHacerScroll);
observadorVideo.observe(videoPortada);

const secciones = document.querySelectorAll("main section[id]");

const observador = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        enlacesMenu.forEach(function (enlace) {
          const coincide =
            enlace.getAttribute("href") === "#" + entrada.target.id;
          enlace.classList.toggle("activo", coincide);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);

secciones.forEach(function (seccion) {
  observador.observe(seccion);
});

$(function () {
  $(".filtro").on("click", function () {
    const categoria = $(this).data("filtro");

    $(".filtro").removeClass("filtro-activo").attr("aria-pressed", "false");
    $(this).addClass("filtro-activo").attr("aria-pressed", "true");

    $(".tela").each(function () {
      const coincide =
        categoria === "todas" || $(this).data("categoria") === categoria;

      if (coincide) {
        $(this).stop(true, true).fadeIn(350);
      } else {
        $(this).stop(true, true).fadeOut(200);
      }
    });
  });
});

document.querySelectorAll(".boton-favorito").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const activo = boton.getAttribute("aria-pressed") === "true";
    boton.setAttribute("aria-pressed", !activo);
  });
});

const formBoletin = document.querySelector("#form-boletin");
const mensajeBoletin = document.querySelector("#mensaje-boletin");

formBoletin.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeBoletin.textContent =
    "¡Hecho! Te escribiremos cuando lleguen telas nuevas.";
  mensajeBoletin.classList.remove("hidden");
  formBoletin.reset();
});

document.querySelector("#anio").textContent = new Date().getFullYear();
