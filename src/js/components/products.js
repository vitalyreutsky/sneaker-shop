import clamp from "clamp-js";
import GraphModal from "graph-modal";
import Swiper, { Navigation, Pagination } from "swiper";

Swiper.use([Navigation, Pagination]);
const prodsSlider = new Swiper(".modal-slider__container", {
  slidesPerView: 1,
  spaceBetween: 20,
});

const catalogList = document.querySelector(".catalog-list");
const catalogMore = document.querySelector(".catalog__more");
const prodModal = document.querySelector(
  '[data-graph-target="prod-modal"] .modal-content'
);
const prodModalSlider = prodModal.querySelector(
  ".modal-slider .swiper-wrapper"
);
const prodModalPreview = prodModal.querySelector(
  ".modal-slider .modal-preview"
);
const prodModalInfo = prodModal.querySelector(".modal-info__wrapper");
const prodModalDescr = prodModal.querySelector(".modal-prod-descr");
const prodModalChars = prodModal.querySelector(".prod-chars");
const prodModalVideo = prodModal.querySelector(".prod-modal__video");
let prodQuantity = 5;
let dataLength = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
};

if (catalogList) {
  const loadProducts = (quantity = 5) => {
    fetch("../data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;
        catalogList.innerHTML = "";

        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            let item = data[i];

            catalogList.innerHTML += `
          <li class="catalog-list__item">
            <article class="product">
              <div class="product__image">
                <picture>
                  <source srcset="${item.mainImage}" type="image/avif" />
                  <source srcset="${item.mainImage}" type="image/webp" />
                  <img
                    loading="lazy"
                    src="${item.mainImage}"
                    class="image"

                    alt="${item.title}"
                  />
                </picture>
                <div class="product__btns">
                  <button
                    class="btn-reset product__btn"
                    aria-label="Показать информацию о товаре"
                    data-graph-path="prod-modal"
                    data-id="${item.id}"
                  >
                    <svg>
                      <use xlink:href="img/sprite.svg#eye"></use>
                    </svg>
                  </button>
                  <button
                    class="btn-reset product__btn"
                    aria-label="Добавить товар в корзину"
                  >
                    <svg>
                      <use xlink:href="img/sprite.svg#cart"></use>
                    </svg>
                  </button>
                </div>
              </div>
              <h3 class="product__title">${item.title}</h3>
              <span class="product__price">${normalPrice(item.price)} $</span>
            </article>
          </li>
            `;
          }
        }
      })
      .then(() => {
        const productTitle = document.querySelectorAll(".product__title");
        productTitle.forEach((title) => {
          clamp(title, { clamp: "22px" });
        });

        const modal = new GraphModal({
          isOpen: (modal) => {
            const openBtnId = modal.previousActiveElement.dataset.id;

            loadModalData(openBtnId);
          },
        });
      });
  };

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {
    fetch("../data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        prodModalSlider.innerHTML = "";
        prodModalPreview.innerHTML = "";
        prodModalInfo.innerHTML = "";
        prodModalDescr.textContent = "";
        prodModalChars.innerHTML = "";
        prodModalVideo.innerHTML = "";

        for (let dataItem of data) {
          if (dataItem.id == id) {
            console.log(dataItem);

            const slides = dataItem.gallery.map((image) => {
              return `
              <div class="swiper-slide">
                <img src="${image}" alt="">
              </div>
              `;
            });

            const preview = dataItem.gallery.map((image, idx) => {
              return `
              <div class="modal-preview__item" data-index="${idx}">
                <img src="${image}" alt="">
              </div>
              `;
            });

            const sizes = dataItem.sizes.map((size, idx) => {
              return `
                 <li class="modal-sizes__item">
                  <button class="btn-reset modal-sizes__btn">${size}</button>
                </li>
              `;
            });

            prodModalSlider.innerHTML = slides.join("");
            prodModalPreview.innerHTML = preview.join("");

            prodModalInfo.innerHTML = `
            <h3 class="modal-info__title">
              ${dataItem.title}
            </h3>
            <div class="modal-info__rate">
              <svg>
                <use xlink:href="img/sprite.svg#rate"></use>
              </svg>
              <svg>
                <use xlink:href="img/sprite.svg#rate"></use>
              </svg>
              <svg>
                <use xlink:href="img/sprite.svg#rate"></use>
              </svg>
              <svg>
                <use xlink:href="img/sprite.svg#rate"></use>
              </svg>
              <svg>
                <use xlink:href="img/sprite.svg#rate"></use>
              </svg>
            </div>
            <div class="modal-info__sizes">
              <span class="modal-info__subtitle">Выберите размер</span>
              <ul class="list-reset modal-info__sizes-list modal-sizes">${sizes.join(
                ""
              )}</ul>
            </div>
            <div class="modal-info__price">
              <span class="modal-info__current-price">${dataItem.price} $</span>
              <span class="modal-info__old-price">${
                dataItem.oldPrice ? dataItem.oldPrice + "$" : ""
              }</span>
            </div>
            `;

            prodModalDescr.textContent = dataItem.description;

            let charsItems = "";

            Object.keys(dataItem.chars).forEach(function eachKey(key) {
              charsItems += `<p class="prod-bottom__descr prod-chars__item">${key}: ${dataItem.chars[key]}</p>`;
            });

            prodModalChars.innerHTML = charsItems;

            if (dataItem.video) {
              prodModalVideo.style.display = "block";
              prodModalVideo.innerHTML = `
             <iframe
              src="${dataItem.video}"
                allow="accelerometer; autoplay; clipboard-w rite; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
             ></iframe>
            `;
            } else {
              prodModalVideo.style.display = "none";
            }
          }
        }
      });
  };

  catalogMore.addEventListener("click", (e) => {
    prodQuantity = prodQuantity + 3;

    loadProducts(prodQuantity);

    if (prodQuantity >= dataLength) {
      catalogMore.style.display = "none";
    } else {
      catalogMore.style.display = "block";
    }
  });
}
