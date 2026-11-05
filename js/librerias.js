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

//AOS
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 60,
});
