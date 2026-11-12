// Cesta de la compra y favoritos
const GASTOS_ENVIO = 2.95;

function leerLista(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch (error) {
    return [];
  }
}

function guardarLista(clave, lista) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch (error) {}
}

function formatearEuros(numero) {
  return numero.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  });
}

function datosProducto(articulo) {
  return {
    id: articulo.dataset.id,
    nombre: articulo.dataset.nombre,
    precio: parseFloat(articulo.dataset.precio),
    unidad: articulo.dataset.unidad,
    imagen: articulo.dataset.imagen,
    detalle: articulo.dataset.detalle,
  };
}

// Numerito de la cesta (cabecera)
const enlaceCesta = document.querySelector("#enlace-cesta");
const contadorCesta = document.querySelector("#contador-cesta");
const avisoCesta = document.querySelector("#aviso-cesta");

function contarArticulos() {
  let total = 0;
  leerLista("cesta").forEach(function (producto) {
    total = total + producto.cantidad;
  });
  return total;
}

function actualizarContador() {
  const total = contarArticulos();
  contadorCesta.textContent = total;
  contadorCesta.classList.toggle("scale-0", total === 0);
  enlaceCesta.setAttribute(
    "aria-label",
    total === 0
      ? "Ver la cesta (vacía)"
      : "Ver la cesta (" + total + " artículos)",
  );
}

actualizarContador();

// Añadir a la cesta
function anadirACesta(producto) {
  const cesta = leerLista("cesta");
  const yaEsta = cesta.find(function (item) {
    return item.id === producto.id;
  });

  if (yaEsta) {
    yaEsta.cantidad = yaEsta.cantidad + 1;
  } else {
    producto.cantidad = 1;
    cesta.push(producto);
  }

  guardarLista("cesta", cesta);
  actualizarContador();

  contadorCesta.classList.remove("animate-saltito");
  void contadorCesta.offsetWidth;
  contadorCesta.classList.add("animate-saltito");

  avisoCesta.textContent = producto.nombre + " añadido a la cesta";

  if (listaCesta) {
    mensajePedido.classList.add("hidden");
    pintarCesta();
  }
}

// Botones de Añadir
document.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".boton-cesta");
  if (!boton) {
    return;
  }

  const articulo = boton.closest("[data-id]");
  anadirACesta(datosProducto(articulo));

  const texto = boton.querySelector(".texto-boton-cesta");
  texto.textContent = "¡Añadido!";
  setTimeout(function () {
    texto.textContent = "Añadir";
  }, 1500);
});

// Favoritos
const favoritosGuardados = leerLista("favoritos");

document.querySelectorAll(".boton-favorito").forEach(function (boton) {
  const articulo = boton.closest("[data-id]");
  const estaGuardado = favoritosGuardados.some(function (producto) {
    return producto.id === articulo.dataset.id;
  });
  boton.setAttribute("aria-pressed", estaGuardado);

  boton.addEventListener("click", function () {
    const activo = boton.getAttribute("aria-pressed") === "true";
    boton.setAttribute("aria-pressed", !activo);

    let favoritos = leerLista("favoritos");
    if (activo) {
      favoritos = favoritos.filter(function (producto) {
        return producto.id !== articulo.dataset.id;
      });
    } else {
      favoritos.push(datosProducto(articulo));
    }
    guardarLista("favoritos", favoritos);
  });
});

// PÁGINA DE LA CESTA
const listaCesta = document.querySelector("#lista-cesta");
const plantillaProducto = document.querySelector("#plantilla-producto");
const cestaVacia = document.querySelector("#cesta-vacia");
const cestaSubtotal = document.querySelector("#cesta-subtotal");
const cestaEnvio = document.querySelector("#cesta-envio");
const cestaTotal = document.querySelector("#cesta-total");
const formPedido = document.querySelector("#form-pedido");
const botonPagar = document.querySelector("#boton-pagar");
const mensajePedido = document.querySelector("#mensaje-pedido");

// Cambia la cantidad de un producto
function cambiarCantidad(id, cambio) {
  let cesta = leerLista("cesta");
  cesta.forEach(function (producto) {
    if (producto.id === id) {
      producto.cantidad = producto.cantidad + cambio;
    }
  });
  cesta = cesta.filter(function (producto) {
    return producto.cantidad > 0;
  });
  guardarLista("cesta", cesta);
  pintarCesta();
}

// Lista de productos
function pintarCesta() {
  const cesta = leerLista("cesta");
  listaCesta.innerHTML = "";

  let subtotal = 0;

  cesta.forEach(function (producto) {
    const fila = plantillaProducto.content.cloneNode(true);
    const precioLinea = producto.precio * producto.cantidad;
    subtotal = subtotal + precioLinea;

    fila.querySelector(".producto-imagen").src = producto.imagen;
    fila.querySelector(".producto-nombre").textContent = producto.nombre;
    fila.querySelector(".producto-detalle").textContent = producto.detalle;
    fila.querySelector(".producto-precio").textContent =
      formatearEuros(producto.precio) + " / " + producto.unidad;
    fila.querySelector(".producto-cantidad").textContent =
      producto.cantidad + " " + producto.unidad;
    fila.querySelector(".producto-total").textContent =
      formatearEuros(precioLinea);

    const botonRestar = fila.querySelector(".boton-restar");
    const botonSumar = fila.querySelector(".boton-sumar");
    const botonQuitar = fila.querySelector(".boton-quitar");

    botonRestar.setAttribute("aria-label", "Uno menos de " + producto.nombre);
    botonSumar.setAttribute("aria-label", "Uno más de " + producto.nombre);
    botonQuitar.setAttribute(
      "aria-label",
      "Quitar " + producto.nombre + " de la cesta",
    );

    botonRestar.addEventListener("click", function () {
      cambiarCantidad(producto.id, -1);
    });
    botonSumar.addEventListener("click", function () {
      cambiarCantidad(producto.id, 1);
    });
    botonQuitar.addEventListener("click", function () {
      cambiarCantidad(producto.id, -producto.cantidad);
    });

    listaCesta.append(fila);
  });

  // Cesta vacía
  const vacia = cesta.length === 0;
  cestaVacia.classList.toggle("hidden", !vacia);
  botonPagar.disabled = vacia;

  // Envío
  const entrega = formPedido.querySelector('input[name="entrega"]:checked');
  let envio = 0;
  if (entrega.value === "domicilio" && !vacia) {
    envio = GASTOS_ENVIO;
  }

  cestaSubtotal.textContent = formatearEuros(subtotal);
  cestaEnvio.textContent = envio === 0 ? "Gratis" : formatearEuros(envio);
  cestaTotal.textContent = formatearEuros(subtotal + envio);

  actualizarContador();
}

function pintarFavoritos() {
  const listaFavoritos = document.querySelector("#lista-favoritos");
  const plantillaFavorito = document.querySelector("#plantilla-favorito");

  favoritosGuardados.forEach(function (producto) {
    const diapositiva = plantillaFavorito.content.cloneNode(true);
    const articulo = diapositiva.querySelector("article");

    articulo.dataset.id = producto.id;
    articulo.dataset.nombre = producto.nombre;
    articulo.dataset.precio = producto.precio;
    articulo.dataset.unidad = producto.unidad;
    articulo.dataset.imagen = producto.imagen;
    articulo.dataset.detalle = producto.detalle;

    diapositiva.querySelector(".favorito-imagen").src = producto.imagen;
    diapositiva.querySelector(".favorito-nombre").textContent = producto.nombre;
    diapositiva.querySelector(".favorito-detalle").textContent =
      producto.detalle;
    diapositiva.querySelector(".favorito-precio").textContent =
      formatearEuros(producto.precio) + " / " + producto.unidad;
    diapositiva
      .querySelector(".boton-cesta")
      .setAttribute("aria-label", "Añadir " + producto.nombre + " a la cesta");

    listaFavoritos.append(diapositiva);
  });

  // Sin favoritos
  const sinFavoritos = favoritosGuardados.length === 0;
  document
    .querySelector("#bloque-favoritos")
    .classList.toggle("hidden", sinFavoritos);
  document
    .querySelector("#flechas-favoritos")
    .classList.toggle("hidden", sinFavoritos);
  document
    .querySelector("#favoritos-vacio")
    .classList.toggle("hidden", !sinFavoritos);
}

if (listaCesta) {
  pintarCesta();
  pintarFavoritos();

  formPedido.addEventListener("change", function () {
    mensajePedido.classList.add("hidden");
    pintarCesta();
  });

  // Finalizar la compra
  formPedido.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const entrega = formPedido.querySelector('input[name="entrega"]:checked');
    const total = cestaTotal.textContent;

    if (entrega.value === "domicilio") {
      mensajePedido.textContent =
        "¡Gracias! Hemos recibido tu pedido de " +
        total +
        ". Te llegará a casa en 2 o 3 días.";
    } else {
      mensajePedido.textContent =
        "¡Gracias! Hemos recibido tu pedido de " +
        total +
        ". Podrás recogerlo en Calle del Pez, 18 dentro de 24 horas.";
    }

    guardarLista("cesta", []);
    pintarCesta();
    mensajePedido.classList.remove("hidden");
  });
}
