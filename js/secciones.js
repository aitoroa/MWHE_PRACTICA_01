/* ---------- crear KIT ---------- */
const formKit = document.querySelector("#form-kit");
const kitMuestra = document.querySelector("#kit-muestra");
const kitProyecto = document.querySelector("#kit-proyecto");
const kitLista = document.querySelector("#kit-lista");
const kitTotal = document.querySelector("#kit-total");
const kitMensaje = document.querySelector("#kit-mensaje");

function formatearPrecio(numero) {
  return numero.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

function crearFila(texto, precio) {
  const fila = document.createElement("li");
  fila.className = "flex justify-between gap-4 py-2";

  const nombre = document.createElement("span");
  nombre.textContent = texto;

  const importe = document.createElement("span");
  importe.textContent = formatearPrecio(precio);

  fila.append(nombre, importe);
  return fila;
}

function actualizarKit() {
  const proyecto = formKit.querySelector('input[name="proyecto"]:checked');
  const tela = formKit.querySelector('input[name="tela"]:checked');
  const extras = formKit.querySelectorAll('input[name="extra"]:checked');

  const metros = parseFloat(proyecto.dataset.metros);
  const precioTela = metros * parseFloat(tela.dataset.precio);
  const precioPatron = parseFloat(proyecto.dataset.precio);

  kitLista.innerHTML = "";
  kitLista.append(
    crearFila(
      tela.dataset.nombre + " · " + String(metros).replace(".", ",") + " m",
      precioTela,
    ),
  );
  kitLista.append(crearFila("Patrón " + proyecto.dataset.nombre, precioPatron));

  let total = precioTela + precioPatron;

  extras.forEach(function (extra) {
    const precio = parseFloat(extra.dataset.precio);
    kitLista.append(crearFila(extra.dataset.nombre, precio));
    total = total + precio;
  });

  kitMuestra.src = "assets/muestras/" + tela.dataset.muestra + ".svg";
  kitProyecto.textContent = proyecto.dataset.nombre;

  kitTotal.textContent = formatearPrecio(total);
  kitTotal.classList.remove("animate-saltito");
  void kitTotal.offsetWidth;
  kitTotal.classList.add("animate-saltito");

  kitMensaje.classList.add("hidden");
}

formKit.addEventListener("change", actualizarKit);
actualizarKit();

/* ---------- RESERVAR Kit--------- */
formKit.addEventListener("submit", function (evento) {
  evento.preventDefault();
  kitMensaje.textContent =
    "¡Reservado! Tu " +
    kitProyecto.textContent.toLowerCase() +
    " te espera en tienda en 24 h (" +
    kitTotal.textContent +
    ").";
  kitMensaje.classList.remove("hidden");
});

/* ---------- preg frecuentes---------- */
$(function () {
  $(".respuesta").hide();

  $(".pregunta").on("click", function () {
    const $pregunta = $(this);
    const estabaAbierta = $pregunta.attr("aria-expanded") === "true";

    $(".pregunta")
      .not($pregunta)
      .attr("aria-expanded", "false")
      .next(".respuesta")
      .slideUp(250);

    $pregunta.attr("aria-expanded", String(!estabaAbierta));
    $pregunta.next(".respuesta").stop(true, true).slideToggle(300);
  });
});

// FORMULARIO RESERVA

const modalReserva = document.querySelector("#modal-reserva");
const formReserva = document.querySelector("#form-reserva");
const modalDia = document.querySelector("#modal-dia");
const modalTaller = document.querySelector("#modal-taller");
const reservaTaller = document.querySelector("#reserva-taller");
const reservaMensaje = document.querySelector("#reserva-mensaje");
const botonesReserva = document.querySelectorAll(".boton-reserva");
const elementosCerrar = modalReserva.querySelectorAll("[data-cerrar='true']");

let botonPulsado = null;

function abrirModal(boton) {
  botonPulsado = boton;

  // Forms limpio cada vez que se abre
  formReserva.reset();
  formReserva.classList.remove("hidden");
  reservaMensaje.classList.add("hidden");

  modalDia.textContent = boton.dataset.dia;
  modalTaller.textContent = boton.dataset.taller;
  reservaTaller.value = boton.dataset.taller;

  modalReserva.setAttribute("aria-hidden", "false");

  document.documentElement.classList.add("overflow-hidden");
  document.querySelector("#reserva-nombre").focus();
}

function cerrarModal() {
  modalReserva.setAttribute("aria-hidden", "true");
  document.documentElement.classList.remove("overflow-hidden");
  if (botonPulsado) {
    botonPulsado.focus();
  }
}

botonesReserva.forEach(function (boton) {
  boton.addEventListener("click", function () {
    abrirModal(boton);
  });
});

elementosCerrar.forEach(function (elemento) {
  elemento.addEventListener("click", cerrarModal);
});

document.addEventListener("keydown", function (evento) {
  const abierta = modalReserva.getAttribute("aria-hidden") === "false";
  if (evento.key === "Escape" && abierta) {
    cerrarModal();
  }
});

formReserva.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombre = document.querySelector("#reserva-nombre").value.trim();
  const correo = document.querySelector("#reserva-correo").value.trim();

  reservaMensaje.textContent =
    "¡Plaza reservada, " +
    nombre +
    "! Te escribiremos a " +
    correo +
    " con todos los detalles. ";

  formReserva.classList.add("hidden");
  reservaMensaje.classList.remove("hidden");

  modalReserva.querySelector("button[data-cerrar]").focus();
});
