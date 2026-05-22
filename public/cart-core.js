function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((s, i) => s + (Number(i.qty) || 1), 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}
document.addEventListener('DOMContentLoaded', updateCartBadge);
