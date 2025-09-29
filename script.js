let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showNotification(message, type = 'success') {
  let notificationDiv = document.querySelector('.notification-container');
  if (!notificationDiv) {
    notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification-container fixed bottom-5 right-5 z-50';
    document.body.appendChild(notificationDiv);
  }

  const notification = document.createElement('div');
  notification.className = `p-4 my-2 rounded-lg shadow-md text-white transition-all duration-500 transform translate-x-full opacity-0 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
  notification.textContent = message;

  notificationDiv.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('translate-x-full', 'opacity-0');
    notification.classList.add('translate-x-0', 'opacity-100');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('translate-x-0', 'opacity-100');
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

function addToCart(name, price, quantity) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }
  saveCart();
  showNotification(`✅ تمت إضافة ${quantity} × ${name} إلى السلة.`);
}

function renderProducts() {
  const productsData = JSON.parse(localStorage.getItem("products")) || [];
  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("category");
  const sortSelect = document.getElementById("sort");
  const productsContainer = document.getElementById("products");

  if (!productsContainer) return;

  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
  const selectedCategory = categorySelect ? categorySelect.value : "all";
  const sortValue = sortSelect ? sortSelect.value : "default";

  let filtered = productsData.filter(p =>
    (selectedCategory === "all" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchValue)
  );

  if (sortValue === "asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortValue === "desc") filtered.sort((a, b) => b.price - a.price);

  productsContainer.innerHTML = "";
  filtered.forEach((p, index) => {
    productsContainer.innerHTML += `
      <div class="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-105 p-4">
        <img src="${p.img}" alt="${p.name}" class="w-full h-48 object-cover rounded-t-lg">
        <div class="p-4">
          <h3 class="text-xl font-bold mb-1">${p.name}</h3>
          <p class="text-sm text-gray-500">الفئة: ${p.category}</p>
          <p class="text-lg font-semibold mt-2">السعر: ${p.price}$</p>
          <div class="mt-4 flex items-center justify-between">
            <label class="text-sm">الكمية:</label>
            <input type="number" id="qty-${index}" value="1" min="1" class="w-20 text-center border rounded-md">
            <button onclick="addToCart('${p.name}', ${p.price}, parseInt(document.getElementById('qty-${index}').value))" class="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
              إضافة للسلة
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  showNotification('❌ تم حذف المنتج من السلة.', 'error');
}

function updateQuantity(index) {
  const qtyInput = document.getElementById(`update-qty-${index}`);
  const newQty = parseInt(qtyInput.value);
  if (newQty > 0) {
    cart[index].quantity = newQty;
    saveCart();
    renderCart();
    showNotification('🔄 تم تحديث الكمية.');
  } else {
    showNotification("⚠️ الكمية يجب أن تكون 1 أو أكثر.", 'error');
  }
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    cartItems.innerHTML += `
      <li class="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-2">
        <span>${item.name} - ${item.price}$ × 
          <input type="number" id="update-qty-${index}" value="${item.quantity}" min="1" class="w-16 text-center border rounded-md">
        </span>
        <div class="flex items-center gap-2">
          <span class="font-bold">${subtotal}$</span>
          <button onclick="updateQuantity(${index})" class="bg-gray-300 text-gray-800 p-1 rounded-full hover:bg-gray-400">↺</button>
          <button onclick="removeFromCart(${index})" class="bg-red-500 text-white p-1 rounded-full hover:bg-red-600">❌</button>
        </div>
      </li>`;
  });
  totalElement.innerText = total;
}

function renderCheckout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    checkoutItems.innerHTML += `
      <li class="flex justify-between items-center py-2">
        <span>${item.name} × ${item.quantity}</span>
        <span class="font-semibold">${subtotal}$</span>
      </li>`;
  });
  checkoutTotal.innerText = total;

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("✅ شكراً لطلبك! سيتم التواصل معك قريباً.");
    cart = [];
    saveCart();
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
  });
}

window.onload = () => {
  renderProducts();
  renderCart();
  renderCheckout();

  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("category");
  const sortSelect = document.getElementById("sort");

  if (searchInput) searchInput.addEventListener("input", renderProducts);
  if (categorySelect) categorySelect.addEventListener("change", renderProducts);
  if (sortSelect) sortSelect.addEventListener("change", renderProducts);
};