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
      precioTela
    )
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

/* ---------- horario abierto/cerrado ---------- */
const horario = {
  0: [],
  1: [
    [10, 14],
    [17, 20.5],
  ],
  2: [
    [10, 14],
    [17, 20.5],
  ],
  3: [
    [10, 14],
    [17, 20.5],
  ],
  4: [
    [10, 14],
    [17, 20.5],
  ],
  5: [
    [10, 14],
    [17, 20.5],
  ],
  6: [[10.5, 14.5]],
};

function formatearHora(decimal) {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return horas + ":" + String(minutos).padStart(2, "0");
}

function comprobarHorario() {
  const ahora = new Date();
  const hoy = ahora.getDay();
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
  const estado = document.querySelector("#estado-tienda");

  const tramoAbierto = horario[hoy].find(function (tramo) {
    return horaActual >= tramo[0] && horaActual < tramo[1];
  });

  if (tramoAbierto) {
    estado.textContent =
      "Abierto ahora · cerramos a las " + formatearHora(tramoAbierto[1]);
    estado.classList.add("abierta");
    estado.classList.remove("cerrada");
  } else {
    estado.textContent = "Cerrado ahora · mira el horario abajo";
    estado.classList.add("cerrada");
    estado.classList.remove("abierta");
  }
}

comprobarHorario();
setInterval(comprobarHorario, 60000);
