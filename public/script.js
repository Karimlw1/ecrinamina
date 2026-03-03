document.addEventListener("DOMContentLoaded", function () {

  //*  SLIDER

  const slides = document.querySelector(".slides");
  const slideItems = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  if (slides && slideItems.length > 0) {

    let index = 0;
    let auto;

    function updateSlide() {
      slides.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(dot => dot.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    function startAuto() {
      auto = setInterval(() => {
        index = (index + 1) % slideItems.length;
        updateSlide();
      }, 3500);
    }

    function restartAuto() {
      clearInterval(auto);
      startAuto();
    }

    startAuto();

    dots.forEach((dot, i) => {
      dot.addEventListener("click", function () {
        index = i;
        updateSlide();
        restartAuto();
      });
    });

    let startX = 0;

    slides.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    });

    slides.addEventListener("touchend", function (e) {
      let diff = e.changedTouches[0].clientX - startX;

      if (diff < -50) {
        index = (index + 1) % slideItems.length;
      }

      if (diff > 50) {
        index = (index - 1 + slideItems.length) % slideItems.length;
      }

      updateSlide();
      restartAuto();
    });
  }

  //*  REVEAL ANIMATION

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  //*  MENU

  const Body = document.querySelector(".Body");

  window.showMenu = function () {
    const menu = document.querySelector(".socials");
    if (menu) menu.classList.add("visible");
    if (Body) Body.style.display = "none";
  };

  window.exitMenu = function () {
    const menu = document.querySelector(".socials");
    if (menu) menu.classList.remove("visible");
    if (Body) Body.style.display = "block";
  };

  //*  SEARCH PLACEHOLDER

  const input = document.getElementById("SearchInput");
  const fakePlaceholder = document.querySelector(".fake-placeholder");

  if (input && fakePlaceholder) {

    function updatePlaceholder() {
      fakePlaceholder.style.display = input.value ? "none" : "block";
    }

    input.addEventListener("input", updatePlaceholder);
    input.addEventListener("focus", () => fakePlaceholder.style.display = "none");
    input.addEventListener("blur", updatePlaceholder);
  }

  //*  PRODUCTS + WISHLIST

  const productsContainer = document.getElementById("productsContainer");

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);

    if (index === -1) {
      wishlist.push(productId);
    } else {
      wishlist.splice(index, 1);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  function isProductNew(product) {
    return product.newUntil && new Date() <= new Date(product.newUntil);
  }

  if (productsContainer) {

    // Loading spinner
    productsContainer.innerHTML = `
      <div class="loader-wrapper">
        <div class="spinner"></div>
      </div>
    `;

    fetch("./api/products")
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(productsObject => {

        const productsArray = Object.values(productsObject);

        for (let i = productsArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [productsArray[i], productsArray[j]] = [productsArray[j], productsArray[i]];
        }

        renderProducts(productsArray);
      })
      .catch(error => {
        productsContainer.innerHTML = `
          <div class="error">
            Impossible de charger les produits.
          </div>
        `;
        console.error(error);
      });
  }

  function renderProducts(productsArray) {

    productsContainer.innerHTML = "";

    productsArray.forEach(product => {

      const div = document.createElement("div");
      div.className = "product";
      div.dataset.id = product.id;

      div.innerHTML = `
        ${isProductNew(product) ? '<span class="new">Nouveau</span>' : ""}
        ${product.isRunningLow ? '<span class="running-low">Bientôt épuisé</span>' : ""}
        ${product.epuised ? '<span class="epuised">Épuisé</span>' : ""}

        <button class="wishlist-btn" data-id="${product.id}">
          <i class="fa ${wishlist.includes(product.id) ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>

        <img 
          src="${product.image || "fallback.jpg"}" 
          alt="${product.name}" 
          loading="lazy"
          onerror="this.src='fallback.jpg'"
        />

        <div class="info">
          <div class="price">$${product.price}</div>
          <button 
            class="voir" 
            ${product.epuised ? "disabled" : ""}
            onclick="window.location.href='product.html?id=${product.id}'">
            ${product.epuised ? "Indisponible" : "Voir"}
          </button>
        </div>
      `;

      productsContainer.appendChild(div);
    });

    attachWishlistEvents();
  }

  function attachWishlistEvents() {

    document.querySelectorAll(".wishlist-btn").forEach(button => {

      button.addEventListener("click", function (e) {

        e.stopPropagation();

        const productId = this.dataset.id;

        toggleWishlist(productId);

        const icon = this.querySelector("i");

        if (wishlist.includes(productId)) {

          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style.color = "#ff0000";
          icon.style.textShadow = "0 0 8px #ff0000";
          icon.style.transform = "scale(1.2)";
          icon.style.transition = "all 0.3s ease";

          setTimeout(() => {
            icon.style.transform = "scale(1)";
          }, 200);

        } else {

          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
          icon.style.color = "";
          icon.style.textShadow = "";
        }

      });

    });
  }

});