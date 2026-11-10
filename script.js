
 // BEN'S HALO-HALO LUCENA

const menuItems = [
  // COOLERS
  {id:1, name:"Original Halo-halo", price:110, category:"Coolers", emoji:"🍧"},
  {id:2, name:"Salty Summer", price:120, category:"Coolers", emoji:"🍨"},
  {id:3, name:"Spicy Winter", price:120, category:"Coolers", emoji:"🍧"},
  {id:4, name:"Macapuno Con Yelo", price:140, category:"Coolers", emoji:"🥥"},
  {id:5, name:"Banana Con Yelo", price:110, category:"Coolers", emoji:"🍌"},
  {id:6, name:"Langka Con Yelo", price:120, category:"Coolers", emoji:"🥭"},
  {id:7, name:"Mais Con Yelo", price:110, category:"Coolers", emoji:"🌽"},

  // BEVERAGES
  {id:8, name:"House Blend Iced Tea", price:60, category:"Beverages", emoji:"🧋"},
  {id:9, name:"Cucumber Lemonade", price:60, category:"Beverages", emoji:"🥤"},
  {id:10, name:"Orange Juice", price:60, category:"Beverages", emoji:"🍊"},

  // RICE MEALS
  {id:11, name:"BBQ Ribs", price:220, category:"Rice Meals", emoji:"🍖"},
  {id:12, name:"Chicken BBQ", price:175, category:"Rice Meals", emoji:"🍗"},
  {id:13, name:"Braised Beef", price:120, category:"Rice Meals", emoji:"🍛"},
  {id:14, name:"Beef Tapa", price:120, category:"Rice Meals", emoji:"🥩"},
  {id:15, name:"Adobo", price:120, category:"Rice Meals", emoji:"🍱"},
  {id:16, name:"Tocino", price:120, category:"Rice Meals", emoji:"🍖"},
  {id:17, name:"Hotdog", price:100, category:"Rice Meals", emoji:"🌭"},
  {id:18, name:"Longganisa", price:120, category:"Rice Meals", emoji:"🍳"},

  // PASTA
  {id:19, name:"Classic Spaghetti", price:110, category:"Pasta", emoji:"🍝"},
  {id:20, name:"Spicy Chicken Pasta", price:130, category:"Pasta", emoji:"🍝"},
  {id:21, name:"Tuna Pasta", price:130, category:"Pasta", emoji:"🍝"},
  {id:22, name:"Bacon Broccoli in White Sauce", price:130, category:"Pasta", emoji:"🥦"},
  {id:23, name:"Chinese Beef Lomi", price:130, category:"Pasta", emoji:"🍜"},
  {id:24, name:"Chinese Chicken Lomi", price:130, category:"Pasta", emoji:"🍜"},

  // PIKA-PIKA & SANDWICHES
  {id:25, name:"Crispy Chicken Fillet Sandwich", price:100, category:"Pika-Pika & Sandwiches", emoji:"🥪"},
  {id:26, name:"Tuna Sandwich", price:100, category:"Pika-Pika & Sandwiches", emoji:"🥪"},
  {id:27, name:"French Fries - Plain", price:70, category:"Pika-Pika & Sandwiches", emoji:"🍟"},
  {id:28, name:"French Fries - Cheese", price:70, category:"Pika-Pika & Sandwiches", emoji:"🧀"},
  {id:29, name:"French Fries - BBQ", price:70, category:"Pika-Pika & Sandwiches", emoji:"🍟"},
  {id:30, name:"French Fries - Sour & Cream", price:70, category:"Pika-Pika & Sandwiches", emoji:"🍟"},
  {id:31, name:"Chicharap", price:70, category:"Pika-Pika & Sandwiches", emoji:"🍘"},
  {id:32, name:"Beef Nachos", price:200, category:"Pika-Pika & Sandwiches", emoji:"🌮"}
];

const FACEBOOK_LINK =
  "https://www.facebook.com/profile.php?id=100064139493546";

function peso(amount) {
  return "₱" + Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// LOAD SAVED CART
let cart = {};

try {
  const savedCart = JSON.parse(
    localStorage.getItem("bensHaloHaloCart")
  );

  if (savedCart && typeof savedCart === "object") {
    if (Array.isArray(savedCart)) {
      savedCart.forEach(item => {
        if (item && item.id && Number(item.quantity) > 0) {
          cart[item.id] = Number(item.quantity);
        }
      });
    } else {
      Object.entries(savedCart).forEach(([id, quantity]) => {
        if (
          menuItems.some(item => item.id === Number(id)) &&
          Number(quantity) > 0
        ) {
          cart[id] = Number(quantity);
        }
      });
    }
  }
} catch (error) {
  cart = {};
}

// SAVE CART
function saveCart() {
  localStorage.setItem(
    "bensHaloHaloCart",
    JSON.stringify(cart)
  );

  renderCart();
}

// SEARCH MENU
function renderMenu(searchTerm = "") {
  const term = searchTerm.trim().toLowerCase();

  const sections = document.querySelectorAll(".menu-category");
  const noResults = document.getElementById("noResults");

  let visibleCount = 0;

  sections.forEach(section => {
    const cards = section.querySelectorAll(".product-card");
    const categoryName =
      section.querySelector("h2")?.textContent.toLowerCase() || "";

    const categoryMatches =
      term !== "" && categoryName.includes(term);

    let sectionVisibleCount = 0;

    cards.forEach(card => {
      const productName = card.dataset.name || "";
      const productText = card.textContent || "";

      const matches =
        term === "" ||
        categoryMatches ||
        productName.toLowerCase().includes(term) ||
        productText.toLowerCase().includes(term);

      card.style.display = matches ? "" : "none";

      if (matches) {
        sectionVisibleCount++;
        visibleCount++;
      }
    });

    section.style.display =
      sectionVisibleCount > 0 ? "" : "none";
  });

  if (noResults) {
    noResults.hidden = visibleCount > 0;
  }
}

// CART TOTALS
function getCartEntries() {
  return Object.entries(cart).filter(([id, quantity]) => {
    return Number(quantity) > 0 &&
      menuItems.some(item => item.id === Number(id));
  });
}

function getCartCount() {
  return getCartEntries().reduce((total, [id, quantity]) => {
    return total + Number(quantity);
  }, 0);
}

function getCartSubtotal() {
  return getCartEntries().reduce((total, [id, quantity]) => {
    const item = menuItems.find(
      product => product.id === Number(id)
    );
    return total + item.price * Number(quantity);
  }, 0);
}

// DISPLAY CART
function renderCart() {
  const list = document.getElementById("cartItems");
  const countNode = document.getElementById("cartCount");
  const subtotalNode = document.getElementById("cartSubtotal");

  const entries = getCartEntries();

  if (countNode) {
    countNode.textContent = getCartCount();
  }

  if (subtotalNode) {
    subtotalNode.textContent = peso(getCartSubtotal());
  }

  if (!list) return;

  list.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Your cart is empty. Add something delicious!";
    list.appendChild(empty);
    return;
  }

  entries.forEach(([id, quantity]) => {
    const item = menuItems.find(
      product => product.id === Number(id)
    );

    const row = document.createElement("div");
    row.className = "cart-row";

    const icon = document.createElement("div");
    icon.className = "cart-item-icon";
    icon.textContent = item.emoji;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const unitPrice = document.createElement("span");
    unitPrice.textContent = peso(item.price) + " each";

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.dataset.change = id;
    minus.dataset.step = "-1";
    minus.textContent = "−";

    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.change = id;
    plus.dataset.step = "1";
    plus.textContent = "＋";

    controls.append(minus, quantityText, plus);
    info.append(name, unitPrice, controls);

    const end = document.createElement("div");
    end.className = "cart-item-end";

    const lineTotal = document.createElement("strong");
    lineTotal.textContent = peso(item.price * Number(quantity));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.dataset.remove = id;
    remove.textContent = "Remove";

    end.append(lineTotal, remove);
    row.append(icon, info, end);
    list.appendChild(row);
  });
}

// OPEN / CLOSE CART
function setCartOpen(open) {
  const panel = document.getElementById("cartPanel");
  const backdrop = document.getElementById("cartBackdrop");

  if (!panel || !backdrop) return;

  panel.classList.toggle("is-open", open);
  backdrop.classList.toggle("is-visible", open);

  panel.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("cart-open", open);
}

// CART BUTTON ACTIONS
document.addEventListener("click", function(event) {

  // ADD TO CART
  const addButton = event.target.closest(
    "[data-add], .add-to-cart[data-id]"
  );

  if (addButton) {
    const id = addButton.dataset.add || addButton.dataset.id;

    if (!menuItems.some(item => item.id === Number(id))) return;

    cart[id] = Number(cart[id] || 0) + 1;
    saveCart();

    const oldText = addButton.textContent;
    addButton.textContent = "✓ Added";

    setTimeout(() => {
      if (addButton.isConnected) {
        addButton.textContent = oldText;
      }
    }, 700);

    return;
  }

  // CHANGE QUANTITY
  const changeButton = event.target.closest("[data-change]");

  if (changeButton) {
    const id = changeButton.dataset.change;
    const step = Number(changeButton.dataset.step);

    cart[id] = Number(cart[id] || 0) + step;

    if (cart[id] <= 0) {
      delete cart[id];
    }

    saveCart();
    return;
  }

  // REMOVE ITEM
  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveCart();
  }
});

// INITIALIZE PAGE
function initializePage() {
  renderMenu();
  renderCart();

  // SEARCH
  const search = document.getElementById("menuSearch");

  if (search) {
    search.addEventListener("input", function() {
      renderMenu(search.value);
    });
  }

  // OPEN CART
  document.getElementById("openCart")?.addEventListener(
    "click",
    () => setCartOpen(true)
  );

  // CLOSE CART
  document.getElementById("closeCart")?.addEventListener(
    "click",
    () => setCartOpen(false)
  );

  document.getElementById("cartBackdrop")?.addEventListener(
    "click",
    () => setCartOpen(false)
  );

  // CLEAR CART
  document.getElementById("clearCart")?.addEventListener(
    "click",
    function() {
      if (getCartEntries().length === 0) return;

      if (confirm("Are you sure you want to clear your cart?")) {
        cart = {};
        saveCart();
      }
    }
  );

  // CHECKOUT
  document.getElementById("checkoutButton")?.addEventListener(
    "click",
    async function() {
      const entries = getCartEntries();
      const message = document.getElementById("checkoutMessage");

      if (entries.length === 0) {
        if (message) {
          message.textContent = "Your cart is empty. Add items first.";
        }
        return;
      }

      let total = 0;

      const lines = entries.map(([id, quantity]) => {
        const item = menuItems.find(
          product => product.id === Number(id)
        );

        const lineTotal = item.price * Number(quantity);
        total += lineTotal;

        return `${quantity} x ${item.name} - ${peso(lineTotal)}`;
      });

      const orderSummary =
        "Hello Ben's Halo-Halo Lucena!\n\n" +
        "I would like to inquire about this order:\n\n" +
        lines.join("\n") +
        "\n\nSubtotal: " + peso(total) +
        "\n\nPlease confirm availability. Thank you!";

      try {
        await navigator.clipboard.writeText(orderSummary);

        if (message) {
          message.textContent =
            "Order summary copied! Paste it in your Facebook message.";
        }
      } catch (error) {
        if (message) {
          message.textContent =
            "Please copy your order details and send them through Facebook.";
        }
      }

      window.open(FACEBOOK_LINK, "_blank", "noopener");
    }
  );

  // MOBILE NAVIGATION
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", function() {
      const isOpen = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
