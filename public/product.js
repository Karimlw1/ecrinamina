let PRODUCTS = {};
let product = null;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const loader = document.getElementById("productLoader");
const toast = document.getElementById("toast");

function showToast(message, isError = false) {
  if (!toast) {
    alert(message);
    return;
  }
  toast.textContent = message;
  toast.className = "toast show";
  if (isError) toast.classList.add("error");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function toggleLoader(show) {
  if (!loader) return;
  loader.style.display = show ? "flex" : "none";
}

toggleLoader(true);

fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    initProduct();
  })
  .catch(err => {
    console.error("Erreur chargement produits:", err);
    showToast("Erreur de chargement produit", true);
  })
  .finally(() => {
    toggleLoader(false);
  });

function initProduct() {
  if (!id) {
    showToast("ID produit manquant dans l'URL", true);
    return;
  }

  product = PRODUCTS[id];

  if (!product) {
    showToast("Produit introuvable", true);
    return;
  }

  if (!product.id) {
    product.id = id;
  }

  renderProduct();
}

function renderProduct() {
  const optionsContainer = document.getElementById("options");
  const livraisonContainer = document.getElementById("lieuDeLIvraison");

  if (!optionsContainer || !livraisonContainer) return;

  optionsContainer.innerHTML = "";
  livraisonContainer.innerHTML = "";

  /* OPTIONS */

  if (product.options?.size?.length) {
    const sizeSelect = document.createElement("select");
    sizeSelect.id = "size";

    product.options.size.forEach(s => {
      const option = document.createElement("option");
      option.value = s;
      option.textContent = s;
      sizeSelect.appendChild(option);
    });

    const label = document.createElement("label");
    label.textContent = "Taille :";

    optionsContainer.appendChild(label);
    optionsContainer.appendChild(sizeSelect);
  }

  if (product.options?.color?.length) {
    const colorSelect = document.createElement("select");
    colorSelect.id = "color";

    product.options.color.forEach(c => {
      const option = document.createElement("option");
      option.value = c;
      option.textContent = c;
      colorSelect.appendChild(option);
    });

    const label = document.createElement("label");
    label.textContent = "Couleur :";

    optionsContainer.appendChild(label);
    optionsContainer.appendChild(colorSelect);
  }

  /* LIVRAISON */

  const livraisonLabel = document.createElement("label");
  livraisonLabel.textContent = "Entrer lieu de livraison :";

  const livraisonInput = document.createElement("input");
  livraisonInput.type = "text";
  livraisonInput.id = "localisation";
  livraisonInput.placeholder = "Votre adresse";
  livraisonInput.required = true;

  livraisonContainer.appendChild(livraisonLabel);
  livraisonContainer.appendChild(livraisonInput);

  /* INFOS PRODUIT */

  document.getElementById("name").textContent = product.name || "";
  document.getElementById("price").textContent = (product.price || 0) + "$";
  document.getElementById("category").textContent = product.category || "";
  document.getElementById("product-id").textContent = `ID: ${product.id}`;

  if (product.available === false) {
    document.getElementById("addToCart").disabled = true;
    showToast("Produit actuellement indisponible", true);
  }

  setupCarousel();
  setupAddToCart();
}

function setupCarousel() {
  const mainImage = document.getElementById("mainImage");
  const thumbsContainer = document.getElementById("thumbs");

  if (!mainImage || !thumbsContainer) return;

  let currentIndex = 0;
  const images = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  if (!images.length) return;

  mainImage.src = images[0];
  mainImage.style.transition = "opacity 0.3s ease";

  thumbsContainer.innerHTML = "";

  images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.dataset.index = index;
    if (index === 0) thumb.classList.add("active");

    thumb.addEventListener("click", () => {
      currentIndex = index;
      updateImage();
    });

    thumbsContainer.appendChild(thumb);
  });

  function updateImage() {
    mainImage.style.opacity = 0;
    setTimeout(() => {
      mainImage.src = images[currentIndex];
      mainImage.style.opacity = 1;
    }, 150);

    document.querySelectorAll("#thumbs img").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  }

  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (nextBtn)
    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    };

  if (prevBtn)
    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    };

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
}

function setupAddToCart() {
  const button = document.getElementById("addToCart");
  if (!button) return;

  button.onclick = () => {
    const size = document.getElementById("size")?.value || null;
    const color = document.getElementById("color")?.value || null;
    const localisation =
      document.getElementById("localisation")?.value.trim();

    if (!localisation) {
      showToast("Veuillez entrer votre lieu de livraison", true);
      return;
    }

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

    button.classList.add("added");
    showToast("Produit ajouté au panier ✔");
  };
}
