function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }
