let PRODUCTS = {};
let product = null;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    initProduct();
    refreshCategoryStockUI();
  })
  .catch(err => {
    console.error("Erreur chargement produits:", err);
  });

function initProduct() {
  if (!id) {
    console.log("ID produit manquant dans l'URL");
    return;
  }

  product = PRODUCTS[id];

  if (!product) {
    console.log("ID demandé:", id);
    console.log("Tous les produits:", PRODUCTS);
    alert("Produit introuvable");
    return;
  }

  // Injecter id si absent
  if (!product.id) {
    product.id = id;
  }

  renderProduct();
}

function renderProduct() {
  const optionsContainer = document.getElementById("options");
  const lieuDeLIvraisonContainer = document.getElementById("lieuDeLIvraison");

  // Nettoyage pour éviter doublons
  optionsContainer.innerHTML = "";
  lieuDeLIvraisonContainer.innerHTML = "";

  /* =========================
     OPTIONS (TAILLE / COULEUR)
  ========================== */

  if (product.options?.size?.length) {
    optionsContainer.innerHTML += `
      <label>Taille :</label>
      <select id="size">
        ${product.options.size
          .map(s => `<option value="${s}">${s}</option>`)
          .join("")}
      </select>
    `;
  }

  if (product.options?.color?.length) {
    optionsContainer.innerHTML += `
      <label>Couleur :</label>
      <select id="color">
        ${product.options.color
          .map(c => `<option value="${c}">${c}</option>`)
          .join("")}
      </select>
    `;
  }

  /* =========================
     LOCALISATION (LIVRAISON)
  ========================== */

  lieuDeLIvraisonContainer.innerHTML = `
    <label>Entrer lieu de livraison :</label>
    <input 
      type="text" 
      id="localisation" 
      placeholder="Votre adresse"
      required
    >
  `;

  /* =========================
     INFOS PRODUIT
  ========================== */

  document.getElementById("name").textContent = product.name || "";
  document.getElementById("price").textContent = (product.price || 0) + "$";
  document.getElementById("category").textContent = product.category || "";
  document.getElementById("product-id").textContent = `ID: ${product.id}`;

  /* =========================
     CAROUSEL
  ========================== */

  const mainImage = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbs");

  let currentIndex = 0;
  const images = product.images?.length
    ? product.images
    : [product.image];

  if (!images || !images.length) return;

  mainImage.src = images[0];

  thumbs.innerHTML = images.map((img, index) => `
    <img 
      src="${img}" 
      data-index="${index}" 
      class="${index === 0 ? "active" : ""}"
    >
  `).join("");

  function updateImage() {
    mainImage.src = images[currentIndex];
    document.querySelectorAll(".thumbs img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  }

  document.querySelectorAll(".thumbs img").forEach(img => {
    img.addEventListener("click", () => {
      currentIndex = Number(img.dataset.index);
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

  /* =========================
     SWIPE MOBILE
  ========================== */

  let startX = 0;

  mainImage.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  mainImage.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const distance = endX - startX;

    if (Math.abs(distance) < 50) return;

    currentIndex =
      distance < 0
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;

    updateImage();
  });

  /* =========================
     ADD TO CART
  ========================== */

  document
    .getElementById("addToCart")
    .addEventListener("click", () => {

      const size = document.getElementById("size")?.value || null;
      const color = document.getElementById("color")?.value || null;
      const localisation =
        document.getElementById("localisation")?.value.trim();

      if (!localisation) {
        alert("Veuillez entrer votre lieu de livraison");
        return;
      }

      addToCart({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: images[currentIndex],
        size,
        color,
        localisation
      });

      alert("Produit ajouté au panier ✔");
    });
}