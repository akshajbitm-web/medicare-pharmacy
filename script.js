const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    desc: "Pain relief & fever reducer",
    category: "otc",
    price: 45,
    mrp: 60,
    icon: "\u{1F48A}",
    tag: "OTC",
    tagClass: "tag-otc"
  },
  {
    id: 2,
    name: "Vitamin D3 Capsules",
    desc: "Bone & immune health support",
    category: "wellness",
    price: 299,
    mrp: 399,
    icon: "\u{1F48A}",
    tag: "Wellness",
    tagClass: "tag-wellness"
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    desc: "Antihistamine for allergies",
    category: "otc",
    price: 35,
    mrp: 50,
    icon: "\u{1F48A}",
    tag: "OTC",
    tagClass: "tag-otc"
  },
  {
    id: 4,
    name: "Digital BP Monitor",
    desc: "Automatic blood pressure gauge",
    category: "devices",
    price: 1299,
    mrp: 1799,
    icon: "\u{1FA79}",
    tag: "Device",
    tagClass: "tag-wellness"
  },
  {
    id: 5,
    name: "Omega-3 Fish Oil",
    desc: "Heart & brain health supplement",
    category: "wellness",
    price: 449,
    mrp: 599,
    icon: "\u{1F48A}",
    tag: "Wellness",
    tagClass: "tag-wellness"
  },
  {
    id: 6,
    name: "Cough Syrup 100ml",
    desc: "Relief from dry & wet cough",
    category: "otc",
    price: 85,
    mrp: 110,
    icon: "\u{1F48A}",
    tag: "OTC",
    tagClass: "tag-otc"
  },
  {
    id: 7,
    name: "Sunscreen SPF 50",
    desc: "UVA/UVB protection for skin",
    category: "personal-care",
    price: 350,
    mrp: 499,
    icon: "\u{1F33E}",
    tag: "Personal Care",
    tagClass: "tag-wellness"
  },
  {
    id: 8,
    name: "Amoxicillin 250mg",
    desc: "Antibiotic (Rx required)",
    category: "prescription",
    price: 120,
    mrp: 150,
    icon: "\u{1F48A}",
    tag: "Rx Required",
    tagClass: "tag-rx"
  },
  {
    id: 9,
    name: "Multivitamin Gummies",
    desc: "Daily essential vitamins",
    category: "wellness",
    price: 399,
    mrp: 549,
    icon: "\u{1F36C}",
    tag: "Wellness",
    tagClass: "tag-wellness"
  },
  {
    id: 10,
    name: "Glucometer Kit",
    desc: "Blood sugar monitoring device",
    category: "devices",
    price: 899,
    mrp: 1200,
    icon: "\u{1FA79}",
    tag: "Device",
    tagClass: "tag-wellness"
  },
  {
    id: 11,
    name: "Ibuprofen 400mg",
    desc: "Anti-inflammatory painkiller",
    category: "otc",
    price: 55,
    mrp: 75,
    icon: "\u{1F48A}",
    tag: "OTC",
    tagClass: "tag-otc"
  },
  {
    id: 12,
    name: "Moisturizing Cream",
    desc: "Deep hydration for dry skin",
    category: "personal-care",
    price: 280,
    mrp: 380,
    icon: "\u{1F33E}",
    tag: "Personal Care",
    tagClass: "tag-wellness"
  }
];

let cart = [];
let activeFilter = "all";

const productsGrid = document.getElementById("productsGrid");
const cartBtn = document.getElementById("cartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const toast = document.getElementById("toast");
const contactForm = document.getElementById("contactForm");

function renderProducts(filter = "all", search = "") {
  let filtered = products;
  if (filter !== "all") {
    filtered = filtered.filter(p => p.category === filter);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#64748b;padding:40px 0;">No products found.</p>';
    return;
  }

  productsGrid.innerHTML = filtered
    .map(p => {
      const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return `
        <div class="product-card" data-category="${p.category}">
          <div class="product-img">${p.icon}</div>
          <span class="product-tag ${p.tagClass}">${p.tag}</span>
          <h3>${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-price">
            <span class="price-current">Rs.${p.price}</span>
            <span class="price-mrp">Rs.${p.mrp}</span>
            <span class="price-off">${discount}% off</span>
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      `;
    })
    .join("");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = `Rs.${totalPrice}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(c => `
      <div class="cart-item">
        <div class="cart-item-img">${c.icon}</div>
        <div class="cart-item-info">
          <h4>${c.name}</h4>
          <p>Rs.${c.price} each</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${c.id}, -1)">-</button>
            <span>${c.qty}</span>
            <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="cart-item-price">Rs.${c.price * c.qty}</div>
          <button class="cart-item-remove" onclick="removeFromCart(${c.id})">&#128465;</button>
        </div>
      </div>
    `)
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

cartBtn.addEventListener("click", () => {
  cartOverlay.classList.add("open");
});

cartClose.addEventListener("click", () => {
  cartOverlay.classList.remove("open");
});

cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) {
    cartOverlay.classList.remove("open");
  }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  showToast("Order placed successfully! (Demo)");
  cart = [];
  updateCart();
  cartOverlay.classList.remove("open");
});

hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts(activeFilter, searchInput.value);
  });
});

searchBtn.addEventListener("click", () => {
  renderProducts(activeFilter, searchInput.value);
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    renderProducts(activeFilter, searchInput.value);
  }
});

document.querySelectorAll(".cat-card").forEach(card => {
  card.addEventListener("click", () => {
    const cat = card.dataset.category;
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("active");
        if (b.dataset.filter === cat) b.classList.add("active");
      });
      activeFilter = cat;
      renderProducts(cat);
    }, 500);
  });
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  contactForm.reset();
});

document.getElementById("uploadRx").addEventListener("click", () => {
  showToast("Prescription upload feature coming soon!");
});

renderProducts();

// Visitor Counter (localStorage based - per browser)
function updateVisitorCounter() {
  let count = localStorage.getItem('medicare_visitors');
  if (!count) {
    count = 1;
  } else {
    count = parseInt(count) + 1;
  }
  localStorage.setItem('medicare_visitors', count);
  document.getElementById('visitorCount').textContent = count;
}
updateVisitorCounter();
