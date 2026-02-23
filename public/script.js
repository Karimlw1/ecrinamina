const slides = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let index = 0;

// update slide position
function update() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
}

// auto
let auto = setInterval(() => {
    index = (index + 1) % slideItems.length;
    update();
}, 3500);

// dots
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        index = i;
        update();
        restartAuto();
    });
});

// touch
let startX = 0;

slides.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});

slides.addEventListener('touchend', e => {
    let diff = e.changedTouches[0].clientX - startX;

    if (diff < -50 && index < slideItems.length - 1) index++;
    if (diff > 50 && index > 0) index--;

    update();
    restartAuto();
});

function restartAuto() {
    clearInterval(auto);
    auto = setInterval(() => {
        index = (index + 1) % slideItems.length;
        update();
    }, 3500);
}

/* reveal */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
        else {
            entry.target.classList.remove("visible");
        }
    });
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const Body = document.querySelector(".Body");

function showMenu() {
    const menuContent = document.querySelector(".socials");
    menuContent.classList.toggle("visible");
    Body.style.display = 'none';
}

function exitMenu() {
    const menu2 = document.querySelector(".socials");
    menu2.classList.remove("visible");
    Body.style.display = 'block';
}

//*hide placeholder search 

const input = document.getElementById("SearchInput");
const fakePlaceholder = document.querySelector(".fake-placeholder");

input.addEventListener("input", () => {
    fakePlaceholder.style.display = input.value ? "none" : "block";
});

input.addEventListener("focus", () => {
    fakePlaceholder.style.display = "none";
});

input.addEventListener("blur", () => {
    if (!input.value) {
        fakePlaceholder.style.display = "block";
    }
});

//* dark mode and light mode *//
const darkModeToggle = document.getElementById("darkModeToggle");
const lightModeToggle = document.getElementById("lightModeToggle");
const body = document.body;
const storedMode = localStorage.getItem("mode");
const navbar = document.querySelector(".navbar");
const category = document.querySelector(".category");
const p = document.querySelector(".p");

const products = document.querySelector(".products");
const footer = document.footer || document.querySelector("footer");
if (storedMode === "dark") {
    body.classList.add("dark-mode");
    darkModeToggle.classList.add("active1");
}


darkModeToggle.addEventListener("click", () => {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    navbar.classList.remove("light-mode");
    navbar.classList.add("dark-mode");
    category.classList.remove("light-mode");
    category.classList.add("dark-mode");
    p.classList.remove("light-mode");
    p.classList.add("dark-mode");
    products.classList.remove("light-mode");
    products.classList.add("dark-mode");
    footer.classList.remove("light-mode");
    footer.classList.add("dark-mode");
    lightModeToggle.classList.remove("active1");
    darkModeToggle.classList.add("active1");
    localStorage.setItem("mode", "dark");   
});

lightModeToggle.addEventListener("click", () => {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    navbar.classList.remove("dark-mode");
    navbar.classList.add("light-mode");
    category.classList.remove("dark-mode");
    category.classList.add("light-mode");
    p.classList.remove("dark-mode");
    p.classList.add("light-mode");
    products.classList.remove("dark-mode");
    products.classList.add("light-mode");
    footer.classList.remove("dark-mode");
    footer.classList.add("light-mode");
    localStorage.setItem("mode", "light");
    darkModeToggle.classList.remove("active1");
    lightModeToggle.classList.add("active1");
});


//* display products */
const productsContainer = document.getElementById("productsContainer");

fetch("./api/products")
    .then(res => res.json())
    .then(products => {
        Object.values(products).forEach(product => {
            const div = document.createElement("div");
            div.className = "product details";
            div.dataset.id = product.id;
            div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="info">
          <div class="price">$${product.price}</div>
          <button class="details-bttn" onclick="location.href='product.html?id=${product.id}'">
            Voir produit
          </button>
        </div>
      `;
            productsContainer.appendChild(div);
        });
    });

