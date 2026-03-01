// ===============================
// 1. Get UI elements
// ===============================
const pTrie = document.getElementById("pTrie");
const trieMessage = document.getElementById("trieMessage");

// ===============================
// 2. Get category buttons
// (IDs must match HTML)
// ===============================
const boxes = {
  haut: document.getElementById("haut"),
  bas: document.getElementById("bas"),
  chaussure: document.getElementById("chaussure"),
  accessoire: document.getElementById("accessoire"),
  abaya: document.getElementById("abaya"),
  robe: document.getElementById("robe"),
  lingerie: document.getElementById("lingerie"),
  complet: document.getElementById("complet"),
  habitmuslim: document.getElementById("habitmuslim"),
  maquillage: document.getElementById("maquillage"),
  skincare: document.getElementById("skincare"),
  fragrance: document.getElementById("fragrance"),
  haircare: document.getElementById("haircare"),
  lunette: document.getElementById("lunette"),
  montre: document.getElementById("montre"),
  sac: document.getElementById("sac"),
  bracha: document.getElementById("bracha"),
  phone: document.getElementById("phone"),
  pijama: document.getElementById("pijama"),
  Mailles: document.getElementById("mailles"),
  tenuesdeceremonie: document.getElementById("tenuesdeceremonie"),
  Gourde: document.getElementById("gourde"),
  allaitement: document.getElementById("allaitement"),
  ensembledenuit: document.getElementById("ensembledenuit"),
  shooting: document.getElementById("shooting"),

};

// ===============================
// 3. Get products by category
// (always fresh from the DOM)
// ===============================
function getCategories() {
  return {
    haut: document.querySelectorAll(".haut"),
    bas: document.querySelectorAll(".bas"),
    chaussure: document.querySelectorAll(".chaussure"),
    accessoire: document.querySelectorAll(".accessoire"),
    abaya: document.querySelectorAll(".abaya"),
    robe: document.querySelectorAll(".robe"),
    lingerie: document.querySelectorAll(".lingerie"),
    complet: document.querySelectorAll(".complet"),
    habitmuslim: document.querySelectorAll(".habitmuslim"),
    maquillage: document.querySelectorAll(".maquillage"),
    skincare: document.querySelectorAll(".skincare"),
    fragrance: document.querySelectorAll(".fragrance"),
    haircare: document.querySelectorAll(".haircare"),
    lunette: document.querySelectorAll(".lunettes"),
    montre: document.querySelectorAll(".montre"),
    sac: document.querySelectorAll(".sac"),
    bracha: document.querySelectorAll(".bracha"),
    phone: document.querySelectorAll(".phone"),
    pijama: document.querySelectorAll(".pijama"),
    Mailles: document.querySelectorAll(".mailles"),
    tenuesdeceremonie: document.querySelectorAll(".tenuesdeceremonie"),
    allaitement: document.querySelectorAll(".allaitement"),
    ensembledenuit: document.querySelectorAll(".ensembledenuit"),
    shooting: document.querySelectorAll(".shooting"),  
    Gourde: document.querySelectorAll(".gourde"),

  };
}

// ===============================
// 4. Show total stock
// ===============================
function defaultMessage() {
  trieMessage.textContent = "Tous les produits : " + document.querySelectorAll(".product").length + " articles disponibles";
}
function showTotalStock() {
  const totalProducts = document.querySelectorAll(".product").length;
  trieMessage.textContent = "Total : " + totalProducts + " articles disponibles";
  if (totalProducts === 0) {
   defaultMessage();
  }
}

// ===============================
// 5. Update products when clicking category
// ===============================
function filterCategory(categoryName) {

  const allProducts = document.querySelectorAll(".product");
  const selectedProducts = document.querySelectorAll("." + categoryName);

  // Hide everything
  allProducts.forEach(product => {
    product.style.display = "none";
  });

  // Show selected
  selectedProducts.forEach(product => {
    product.style.display = "block";
  });

  // Update message
  if (selectedProducts.length === 0) {
    trieMessage.textContent = "Aucun article disponible";
  } else {
    trieMessage.textContent =
      categoryName + " : " + selectedProducts.length + " articles";
  }
  if(!selectedProducts){
    defaultMessage();
  }
}

// ===============================
// 6. Handle button clicks
// (only one active at a time)
// ===============================
let activeButton = null;

Object.keys(boxes).forEach(name => {
  const button = document.getElementById(name);
  if (!button) return;

  button.addEventListener("click", function () {

    // Remove active class from previous
    if (activeButton && activeButton !== button) {
      activeButton.classList.remove("category-active");
    }

    // Toggle current
    button.classList.toggle("category-active");

    if (button.classList.contains("category-active")) {
      activeButton = button;
      filterCategory(name);
    } else {
      activeButton = null;
      showAllProducts();
    }
  });
});

// ===============================
// 7. Helper functions
// ===============================
function showAllProducts() {
  const categories = getCategories();
  Object.keys(categories).forEach(name => {
    categories[name].forEach(item => {
      item.style.display = "block";
    });
  });
}

function removeEmptyMessage() {
  const msg = document.getElementById("emptyStock");
  if (msg) msg.remove();
}

function refreshCategoryStockUI() {
  const categories = getCategories();
  Object.keys(categories).forEach(name => {
    const count = categories[name].length;
    const box = boxes[name];
    if (!box) return;
    const badge = box.querySelector(".badge");
    if (badge) {
      badge.textContent = count;
    } else {
      const newBadge = document.createElement("span");
      newBadge.className = "badge";
      newBadge.textContent = count;
      box.appendChild(newBadge);
    }
  });
}


// ===============================
// 8. Disable empty categories
// ===============================

