//* display order in admin.html


  app.get("/order/:id", (req, res) => {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE));
    const order = orders[req.params.id];
    let ordersContainer = document.querySelector(".ordersContainer");
    if (!order) return res.send("<h2>Commande introuvable 😢</h2>");
  
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
      <body>
      <a href="mydressingbyamida.onrender.com">
      <button class="back">
        Retour au Site 
      </button>
      </a>
         <a href="https://mydressingbyamida.onrender.com/product.html?id=${item.id}">
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Catégorie: ${item.category}</p>
            <p>Quantité: ${item.qty}</p>
            <p>Prix: ${item.price} USD</p>
            <p>Taille: ${item.size}</p>
            <p>Couleur: ${item.color}</p><br>
            <strong style="color: crimson;">lieu de livraison:${item.ville}</ville>
          </div>
        </div>
      </a>`;
    });
    html += `</ul></div>`;
    ordersContainer.innerHTML = html;