document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("wishlistContainer");
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // If empty
  if (wishlist.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  fetch("/api/products")
    .then(res => res.json())
    .then(products => {

      const allProducts = Object.values(products);

      // Filter products using STRING id match
      const wishlistProducts = allProducts.filter(product =>
        wishlist.includes(product.id)
      );

      renderWishlist(wishlistProducts);
    })
    .catch(error => {
      console.error("Error loading products:", error);
      container.innerHTML = "<p>Error loading wishlist.</p>";
    });

});



function renderWishlist(products) {

  const container = document.getElementById("wishlistContainer");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  products.forEach(product => {

    const div = document.createElement("div");
    div.className = "wishlist-item";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button data-id="${product.id}" class="remove-btn">
        Remove
      </button>
    `;

    container.appendChild(div);
  });

  attachRemoveEvents();
}



function attachRemoveEvents() {

  document.querySelectorAll(".remove-btn").forEach(button => {

    button.addEventListener("click", function() {

      const productId = this.dataset.id;

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      // Remove string ID correctly
      wishlist = wishlist.filter(id => id !== productId);

      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      // Remove item visually without reload
      this.closest(".wishlist-item").remove();

      // If now empty, show message
      if (wishlist.length === 0) {
        document.getElementById("wishlistContainer").innerHTML =
          "<p>Your wishlist is empty.</p>";
      }

    });

  });

}