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
  accessoires: document.getElementById("accessoire"),
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
    accessoires: document.querySelectorAll(".accessoire"),
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
function showTotalStock() {
  const totalProducts = document.querySelectorAll(".product").length;
  trieMessage.textContent = "Total : " + totalProducts + " articles disponibles";
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
}

// ===============================
// 6. Handle button clicks
// (only one active at a time)
// ===============================
let activeButton = null;

categories.forEach(name => {
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

function emptyStockMessage() {
  removeEmptyMessage();
  const message = document.createElement("p");
  message.id = "emptyStock";
  message.textContent = `Aucun article disponible dans ${this.id}`;
  message.style.color = "red";
  message.style.marginTop = "10px";
  pTrie.appendChild(message);
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
    if (count === 0) {
      box.classList.add("empty-category");
      box.onclick = emptyStockMessage;
    } else {
      box.classList.remove("empty-category");
      box.onclick = null;
    }
  });
}


// ===============================
// 8. Disable empty categories
// ===============================

// ===============================
// 9. Format the message text
// ===============================
function formatMessage(selected) {
  const names = {
    haut: "Haut",
    bas: "Bas",
    chaussure: "Chaussures",
    accessoires: "Accessoires",
    abaya: "Abayas",
    robe: "Robe",
    abaya:"Lingerie",
    complet: "Complets",
    habitmuslim: "Habit Muslim",
    maquillage: "Maquillage",
    skincare: "Skin Care",
    fragrance: "Parfums",
    haircare: "Hair Care",
    lunette: "Lunettes",
    montre: "Montres",
    sac: "Sacs",
    bracha: "Bracelets & Chaînettes",
    phone: "Téléphones",
    pijama: "Pijamas",
    Mailles: "Mailles",
    tenuesdeceremonie: "Tenues de Cérémonie",
    allaitement: "Allaitement",
    ensembledenuit: "Ensemble de Nuit",
    shooting: "Shooting",
    Gourde: "Gourdes",

  };

  const translatedNames = selected.map(name => names[name]);
  const categories = getCategories();

  let total = 0;
  selected.forEach(name => {
    total += categories[name].length;
  });

  if (translatedNames.length === 1) {
    return `${translatedNames[0]} seulement, ${total} articles`;
  }

  if (translatedNames.length === 2) {
    return `${translatedNames[0]} et ${translatedNames[1]} seulement, ${total} articles`;
  }

  return `${translatedNames.join(", ")} seulement, ${total} articles`;
}

document.addEventListener("DOMContentLoaded", function () {
  showTotalStock();
});
