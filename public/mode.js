
//* dark mode and light mode *//
const darkModeToggle = document.getElementById("darkModeToggle");
const lightModeToggle = document.getElementById("lightModeToggle");
const body = document.body;
const storedMode = localStorage.getItem("mode");
const navbar = document.querySelector(".navbar");
const category = document.querySelectorAll(".category");
const p = document.querySelectorAll("p");

const products = document.querySelectorAll(".products");
if (storedMode === "dark") {
    body.classList.add("dark-mode");
    darkModeToggle.classList.add("active1");
}


darkModeToggle.addEventListener("click", () => {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    navbar.classList.remove("light-mode");
    navbar.classList.add("dark-mode");
    category.forEach(el => {
    el.classList.remove("light-mode");
    el.classList.add("dark-mode");
    });
    p.forEach(el => {
        el.classList.remove("light-mode");
        el.classList.add("dark-mode");
    });
    products.forEach(el => {
        el.classList.remove("light-mode");
        el.classList.add("dark-mode");
    });
    lightModeToggle.classList.remove("active1");
    darkModeToggle.classList.add("active1");
    localStorage.setItem("mode", "dark");   
});

lightModeToggle.addEventListener("click", () => {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    navbar.classList.remove("dark-mode");
    navbar.classList.add("light-mode");
    category.forEach(el => {
        el.classList.remove("dark-mode");
        el.classList.add("light-mode");
    });
    p.forEach(el => {
        el.classList.remove("dark-mode");
        el.classList.add("light-mode");
    });
    products.forEach(el => {
        el.classList.remove("dark-mode");
        el.classList.add("light-mode");
    });
    darkModeToggle.classList.remove("active1");
    lightModeToggle.classList.add("active1");
    localStorage.setItem("mode", "light");
    
});


