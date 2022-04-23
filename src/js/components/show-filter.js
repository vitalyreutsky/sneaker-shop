const showFilterBtn = document.querySelector(".catalog-filter");
const filter = document.querySelector(".catalog__left");
showFilterBtn.addEventListener("click", () => {
  filter.classList.toggle("catalog__left--visible");
});
