// SWIPER (Slider de novedades)
if (document.querySelector(".slider-novedades")) {
  const sliderNovedades = new Swiper(".slider-novedades", {
    slidesPerView: 1.15,
    spaceBetween: 16,
    grabCursor: true,
    navigation: {
      prevEl: "#novedades-anterior",
      nextEl: "#novedades-siguiente",
    },
    pagination: {
      el: ".slider-novedades .swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      640: {
        slidesPerView: 2.15,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 28,
      },
    },
  });
}

// SWIPER (Slider de favoritos)
if (document.querySelector(".slider-favoritos")) {
  const sliderFavoritos = new Swiper(".slider-favoritos", {
    slidesPerView: 1.6,
    spaceBetween: 16,
    grabCursor: true,
    navigation: {
      prevEl: "#favoritos-anterior",
      nextEl: "#favoritos-siguiente",
    },
    pagination: {
      el: ".slider-favoritos .swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      640: {
        slidesPerView: 3.2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 5.2,
        spaceBetween: 24,
      },
    },
  });
}

//AOS (Animaciones al hacer scroll)
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 60,
});
