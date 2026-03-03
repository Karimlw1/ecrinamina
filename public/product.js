let PRODUCTS = {};
let product = null;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    initProduct();
  })
  .catch(err => console.error("Erreur chargement produits:", err));

function initProduct() {
  if (!id) return console.log("ID produit manquant dans l'URL");

  product = PRODUCTS[id];
  if (!product) {
    alert("Produit introuvable");
    console.log("ID demandé:", id, "Produits:", PRODUCTS);
    return;
  }

  if (!product.id) product.id = id;
  renderProduct();
}

function renderProduct() {
  const optionsContainer = document.getElementById("options");
  const lieuContainer = document.getElementById("lieuDeLIvraison");

  optionsContainer.innerHTML = "";
  lieuContainer.innerHTML = `
    <label>Entrer lieu de livraison :</label>
    <input type="text" id="localisation" placeholder="Votre adresse" required>
  `;

  if (product.options?.size?.length) {
    optionsContainer.innerHTML += `
      <label>Taille :</label>
      <select id="size">
        ${product.options.size.map(s => `<option value="${s}">${s}</option>`).join("")}
      </select>
    `;
  }

  if (product.options?.color?.length) {
    optionsContainer.innerHTML += `
      <label>Couleur :</label>
      <select id="color">
        ${product.options.color.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>
    `;
  }

  document.getElementById("name").textContent = product.name || "";
  document.getElementById("price").textContent = (product.price || 0) + "$";
  document.getElementById("category").textContent = product.category || "";
  document.getElementById("product-id").textContent = `ID: ${product.id}`;

  setupCarousel();
  setupAddToCart();
}

// CAROUSEL
function setupCarousel() {
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbs");
  const images = product.images?.length ? product.images : [product.image];

  if (!images || !images.length) return;

  let currentIndex = 0;
  mainImage.src = images[0];

  thumbs.innerHTML = images.map((img, i) => `<img src="${img}" data-index="${i}" class="${i===0?'active':''}">`).join("");

  function updateImage() {
    mainImage.src = images[currentIndex];
    document.querySelectorAll(".thumbs img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  }

  document.querySelectorAll(".thumbs img").forEach(img => {
    img.addEventListener("click", () => {
      currentIndex = +img.dataset.index;
      updateImage();
    });
  });

  document.querySelector(".next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  document.querySelector(".prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  // SWIPE
  let startX = 0;
  mainImage.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  mainImage.addEventListener("touchend", e => {
    const distance = e.changedTouches[0].clientX - startX;
    if (Math.abs(distance) < 50) return;
    currentIndex = distance < 0 ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });
}

// ADD TO CART
function setupAddToCart() {
  const btn = document.getElementById("addToCart");
  btn.onclick = () => {
    const size = document.getElementById("size")?.value || null;
    const color = document.getElementById("color")?.value || null;
    const localisation = document.getElementById("localisation")?.value.trim();

    if (!localisation) return alert("Veuillez entrer votre lieu de livraison");

    btn.classList.add("loading");
    btn.innerHTML = `<span class="spinner"></span> Ajout au panier...`;

    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.images?.[0] || product.image,
        size,
        color,
        localisation
      });

      btn.classList.remove("loading");
      btn.textContent = "Ajouter au panier";
      alert("Produit ajouté au panier ✔");
    }, 800);
  };
}

// Dummy cart function (replace with your cart.js logic)
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}