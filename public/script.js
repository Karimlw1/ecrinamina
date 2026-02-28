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
//* display products */
const productsContainer = document.getElementById("productsContainer");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
function toggleWishlist(productId) {
    let index = wishlist.indexOf(productId);
    
    if (index === -1) {
        // Add item
        wishlist.push(productId);

        if (wishlist.length > 30) {
            wishlist.shift();
        }
        updateWishlistUI();
    } else {
        // Remove item
        wishlist.splice(index, 1);
        updateWishlistUI();
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    document.querySelectorAll(".wishlist i").forEach(i => {
        i.classList.toggle("fa-solid", wishlist.includes(parseInt(i.dataset.id)));
        i.classList.toggle("fa-regular", !wishlist.includes(parseInt(i.dataset.id)));
        let id = parseInt(parseInt(i.dataset.id));
        if (wishlist.includes(id)) {
            i.classList.add("fa-solid");
            i.classList.remove("fa-regular");
        } else {
            i.classList.add("fa-regular");
            i.classList.remove("fa-solid");
        }
        updateWishlistUI();
    });

}
function updateWishlistUI() {
    document.querySelectorAll(".wishlist i").forEach(i => {
        let id = parseInt(i.dataset.id);

        i.classList.toggle("fa-solid", wishlist.includes(id));
        i.classList.toggle("fa-regular", !wishlist.includes(id));
    });
}

fetch("./api/products")
    .then(res => res.json())
    .then(products => {
        Object.values(products).forEach(product => {
            const div = document.createElement("div");
            div.className = "product details";
            div.dataset.id = product.id;
            div.innerHTML = `
        <button class="wishlist"><i class="fa fa-heart" data-id="${product.id}"></i></button>
        <img src="${product.image}" alt="${product.name}" />
        <div class="info">
          <div class="price">$${product.price}</div>
          <button class="details-bttn" onclick="location.href='product.html?id=${product.id}'">
            En vente
          </button>
        </div>
      `;
            productsContainer.appendChild(div);
        });
    });

