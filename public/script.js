document.addEventListener("DOMContentLoaded", function () {

  //*  SLIDER


  const slides = document.querySelector('.slides');
  const slideItems = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (slides && slideItems.length > 0) {

    let index = 0;

    function updateSlide() {
      slides.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(dot => dot.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    function startAuto() {
      return setInterval(() => {
        index = (index + 1) % slideItems.length;
        updateSlide();
      }, 3500);
    }

    let auto = startAuto();

    function restartAuto() {
      clearInterval(auto);
      auto = startAuto();
    }

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
  });

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
      if (input.value) {
        fakePlaceholder.style.display = "none";
      } else {
        fakePlaceholder.style.display = "block";
      }
    }

    input.addEventListener("input", updatePlaceholder);
    input.addEventListener("focus", () => fakePlaceholder.style.display = "none");
    input.addEventListener("blur", updatePlaceholder);
  }


  //*  PRODUCTS + WISHLIST


  const productsContainer = document.getElementById("productsContainer");

  // Load wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Toggle wishlist (correct logic)
  function toggleWishlist(productId) {

    const index = wishlist.indexOf(productId);

    if (index === -1) {
      wishlist.push(productId);   // add
    } else {
      wishlist.splice(index, 1);  // remove
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }


  // Fetch products
  if (productsContainer) {

    fetch("./api/products")
      .then(res => res.json())
      .then(productsObject => {

        const productsArray = Object.values(productsObject);

        // Shuffle products
        for (let i = productsArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [productsArray[i], productsArray[j]] = [productsArray[j], productsArray[i]];
        }

        renderProducts(productsArray);
      });
  }


  // Render products
  function renderProducts(productsArray) {

    productsContainer.innerHTML = "";

    productsArray.forEach(product => {

      const div = document.createElement("div");
      div.className = "product";
      div.dataset.id = product.id;

        if(product.isNew) {
          div.innerHTML += '<span class="new">Nouveau</span>';
        }
        if(product.isRunningLow) {
          div.innerHTML += '<span class="running-low">Bientôt épuisé</span>';
        }
        if (product.epuised) {
          div.innerHTML += '<span class="epuised">Épuisé</span>';
        }
        

      div.innerHTML = `
        <button class="wishlist-btn" data-id="${product.id}">
          <i class="fa ${wishlist.includes(product.id) ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>

        <img src="${product.image}" alt="${product.name}" />

        <div class="info">
          <div class="price">$${product.price}</div>
          <button class="voir" onclick="window.location.href='product.html?id=${product.id}'">Voir</button>
        </div>
      `;
      productsContainer.appendChild(div);
    });

    attachWishlistEvents();
  }


  // Heart click
  function attachWishlistEvents() {

    document.querySelectorAll(".wishlist-btn").forEach(button => {

      button.addEventListener("click", function (e) {

        e.stopPropagation(); // VERY IMPORTANT

        const productId = this.dataset.id;

        toggleWishlist(productId);

        const icon = this.querySelector("i");

        if (wishlist.includes(productId)) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style.color = "#ff0000";
          icon.style.textShadow = "0 0 5px #ff0000";
          icon.style.transition = "all 0.3s ease";
        } else {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
            icon.style.color = "";
            icon.style.textShadow = "";
            icon.style.transition = "all 0.3s ease";
        }

      });

    });
  }

});