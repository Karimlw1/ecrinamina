//* display order in admin.html
let ordersContainer = document.querySelector(".ordersContainer");

fetch("./api/order")

.then(res => res.json())
.then(order => {
    let html = `
    <style>
    .order {
        background: #f7f7f7;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    .order h3 {
        margin: 0;
        color: #333;
    }
    .order p {
        margin: 5px 0;
        color: #555;
    }
    .order ul {
        list-style: none;
        padding: 0;
    }
    .order ul li {
        margin: 5px 0;
        color: #555;
    }
    </style>
    `;  
    html += `
      <h2>Commandes</h2>
      <div class="order">
        <h3>ID: ${order.id}</h3>
        <p>Date: ${order.date}</p>
        <p>Total: ${order.total}€</p>
        <h4>Articles:</h4>
        <ul>`;
    order.items.forEach(item => {
      html += `<li>${item.name} - ${item.quantity} x ${item.price}€</li>`;
    });
    html += `</ul></div>`;
    ordersContainer.innerHTML = html;
  });