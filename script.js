import { supabase } from './supabase.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ---------------------- UTILITY ---------------------- //
function updateCartCount() {
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.innerText = cart.reduce((sum, p) => sum + p.qty, 0);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// ---------------------- HOMEPAGE ---------------------- //
async function fetchProducts(category = null) {
  let query = supabase.from('products').select('*');
  if (category && category !== 'home') query = query.eq('category', category);

  const { data, error } = await query;
  if (error) { console.error(error.message); return; }
  renderProducts(data);
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;
  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No products found.</p>';
    return;
  }

  products.forEach(item => {
    container.innerHTML += `
      <div class="border rounded-xl shadow p-4 hover:shadow-lg transition">
        <img src="${item.image_url}" class="w-full h-48 object-cover rounded-md" />
        <h2 class="text-lg font-bold mt-2">${item.name}</h2>
        <p class="text-gray-600 text-sm">${item.description}</p>
        <p class="font-semibold mt-1">$${item.price}</p>
        <button onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image_url}')"
          class="mt-3 w-full bg-blue-600 text-white py-2 rounded-md">Add to Cart</button>
      </div>
    `;
  });
}
// ---------------------- NAVIGATION ACTIVE HIGHLIGHT ---------------------- //
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-600','text-white'));

    // Add active to clicked button
    btn.classList.add('bg-blue-600','text-white');

    // Fetch products based on category
    const category = btn.dataset.category;
    fetchProducts(category);
  });
});

window.addToCart = function(id, name, price, image) {
  const found = cart.find(item => item.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, name, price, image, qty: 1 });
  saveCart();
  alert('Added to cart!');
}

// ---------------------- CART ---------------------- //
function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  if (!cartContainer) return;

  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartContainer.innerHTML += `
      <div class="flex items-center justify-between border-b py-3">
        <div class="flex items-center gap-3">
          <img src="${item.image}" class="w-16 h-16 rounded-md object-cover" />
          <div>
            <p class="font-semibold">${item.name}</p>
            <p class="text-sm text-gray-600">$${item.price}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="changeQty(${item.id}, -1)" class="px-2 bg-gray-300 rounded">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" class="px-2 bg-gray-300 rounded">+</button>
        </div>

        <p class="font-semibold">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
    `;
  });

  if (totalPriceEl) totalPriceEl.innerText = total.toFixed(2);
}

window.changeQty = function(id, amount) {
  const product = cart.find(p => p.id === id);
  if (!product) return;

  product.qty += amount;
  if (product.qty <= 0) cart = cart.filter(p => p.id !== id);

  saveCart();
  renderCart();
  updateCartCount();
}

// ---------------------- PLACE ORDER ---------------------- //
const confirmBtn = document.getElementById("confirm-order-btn");

if (confirmBtn) {
  confirmBtn.addEventListener("click", async () => {
    const emailInput = document.getElementById("user-email");
    const addressInput = document.getElementById("user-address");
    const paymentSelect = document.getElementById("payment-method");

    const userEmail = emailInput?.value.trim() || "";
    const address = addressInput?.value.trim() || "";
    const payment = paymentSelect?.value || "";

    if (!userEmail) { alert("Please enter your email!"); return; }
    if (!address) { alert("Please enter your address!"); return; }
    if (!payment) { alert("Please select a payment method!"); return; }
    if (cart.length === 0) { alert("Your cart is empty!"); return; }

    const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2);

    const orderData = {
      user_email: userEmail,
      order_items: cart,
      total: total,
      address: address,
      payment_method: payment
    };

    const { data, error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      console.error(error);
      alert("Failed to place order. Try again!");
    } else {
      alert(`Order placed successfully! Total: $${total}`);
      cart = [];
      saveCart();
      renderCart();
      updateCartCount();
      emailInput.value = "";
      addressInput.value = "";
      paymentSelect.value = "";
    }
  });
}

// ---------------------- INITIALIZE ---------------------- //
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();

 

  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', () => window.location.href = 'cart.html');

  if (document.getElementById('cart-items')) renderCart();

  updateCartCount();
});
const loginBtn = document.getElementById("login-btn");
const authModal = document.getElementById("auth-modal");
const closeBtn = document.getElementById("auth-close");

const authTitle = document.getElementById("auth-title");
const emailInput = document.getElementById("auth-email");
const passInput = document.getElementById("auth-password");
const submitBtn = document.getElementById("auth-submit");
const toggleAuth = document.getElementById("toggle-auth");
const forgotPassword = document.getElementById("forgot-password");

// State control
let isLogin = true;

// Open Modal
loginBtn.addEventListener("click", () => {
  authModal.classList.remove("hidden");
});

// Close Modal
closeBtn.addEventListener("click", () => {
  authModal.classList.add("hidden");
});

// Toggle Login <-> Signup
toggleAuth.addEventListener("click", () => {
  isLogin = !isLogin;

  authTitle.innerText = isLogin ? "Login" : "Create Account";
  submitBtn.innerText = isLogin ? "Login" : "Sign Up";
  toggleAuth.innerText = isLogin
    ? "Don't have an account? Create one"
    : "Already have an account? Login";
});

// ------------------------ LOGIN / SIGNUP SUBMIT ------------------------
submitBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passInput.value.trim();

  if (!email || !password) {
    alert("Enter email & password.");
    return;
  }

  if (isLogin) {
    // -------- LOGIN --------
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Logged in!");
      authModal.classList.add("hidden");
    }

  } else {
    // -------- SIGNUP --------
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      alert("Account created! Check your email to verify.");
      authModal.classList.add("hidden");
    }
  }
});

// ------------------------ RESET PASSWORD ------------------------
forgotPassword.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    alert("Enter your email first!");
    return;
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.href
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Reset link sent to your email!");
  }
});


