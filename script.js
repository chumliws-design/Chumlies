// Simple Ecommerce App - No Backend Required
// Uses localStorage for data persistence

// ============================================
// PRODUCTS DATABASE (Mock Data)
// ============================================
const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, emoji: '🎧', rating: 4.5, description: 'High-quality sound' },
    { id: 2, name: 'Smart Watch', price: 199.99, emoji: '⌚', rating: 4.8, description: 'Track your fitness' },
    { id: 3, name: 'USB-C Cable', price: 12.99, emoji: '🔌', rating: 4.2, description: 'Fast charging cable' },
    { id: 4, name: 'Phone Stand', price: 15.99, emoji: '📱', rating: 4.3, description: 'Portable stand' },
    { id: 5, name: 'Power Bank', price: 34.99, emoji: '🔋', rating: 4.6, description: '20000mAh capacity' },
    { id: 6, name: 'Screen Protector', price: 9.99, emoji: '🛡️', rating: 4.1, description: 'Tempered glass' },
    { id: 7, name: 'Phone Case', price: 19.99, emoji: '📦', rating: 4.4, description: 'Protective case' },
    { id: 8, name: 'Bluetooth Speaker', price: 49.99, emoji: '🔊', rating: 4.7, description: 'Portable speaker' }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get current logged-in user
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Redirect if not logged in (except on auth pages)
function requireLogin() {
    if (!isLoggedIn() && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('signin.html')) {
        window.location.href = 'signin.html';
    }
}

// Get all users
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
}

// Get current user's cart
function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    const carts = localStorage.getItem('carts') ? JSON.parse(localStorage.getItem('carts')) : {};
    return carts[user] || [];
}

// Save cart
function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    const carts = localStorage.getItem('carts') ? JSON.parse(localStorage.getItem('carts')) : {};
    carts[user] = cart;
    localStorage.setItem('carts', JSON.stringify(carts));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = getCart().length;
    }
}

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Sign Up
function handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (password !== confirm) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    const users = getAllUsers();
    
    if (users[email]) {
        showMessage('Email already registered!', 'error');
        return;
    }
    
    users[email] = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Account created successfully! Redirecting to sign in...', 'success');
    
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 2000);
}

// Sign In
function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    const users = getAllUsers();
    
    if (!users[email]) {
        showMessage('Email not found!', 'error');
        return;
    }
    
    if (users[email].password !== password) {
        showMessage('Incorrect password!', 'error');
        return;
    }
    
    localStorage.setItem('currentUser', email);
    localStorage.setItem('userName', users[email].name);
    showMessage('Signed in successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'inventory.html';
    }, 1500);
}

// Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    showMessage('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 1000);
}

// ============================================
// INVENTORY FUNCTIONS
// ============================================

function displayProducts(productsToDisplay = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">⭐ ${product.rating} (120 reviews)</div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-buttons">
                    <button class="btn btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showMessage(`${product.name} added to cart!`, 'success');
}

function searchProducts(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value.toLowerCase();
    
    if (!query) {
        displayProducts(products);
        return;
    }
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
    );
    
    displayProducts(filtered);
}

// ============================================
// CART FUNCTIONS
// ============================================

function displayCart() {
    const cart = getCart();
    const emptyMessage = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems || !emptyMessage || !cartContent) return;
    
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    cartContent.style.display = 'block';
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${index}, -1)">−</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="btn-remove" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateCartSummary();
}

function updateQuantity(index, change) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        displayCart();
    }
}

function removeFromCart(index) {
    const cart = getCart();
    const removed = cart[index];
    cart.splice(index, 1);
    saveCart(cart);
    showMessage(`${removed.name} removed from cart!`, 'success');
    displayCart();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// ============================================
// CHECKOUT FUNCTIONS
// ============================================

function displayCheckoutTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutTotal) {
        checkoutTotal.textContent = formatCurrency(total);
    }
}

function handleCheckout(e) {
    e.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    // Validate form
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const phone = document.getElementById('phone').value;
    const cardName = document.getElementById('cardname').value;
    const cardNumber = document.getElementById('cardnumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    // Simple validation
    if (!fullName || !email || !address || !city || !state || !zip || !phone) {
        showMessage('Please fill in all shipping information!', 'error');
        return;
    }
    
    if (!cardName || cardNumber.length < 13 || expiry.length < 5 || cvv.length < 3) {
        showMessage('Please enter valid payment information!', 'error');
        return;
    }
    
    // Create order
    const order = {
        id: 'ORD-' + Date.now(),
        user: getCurrentUser(),
        items: cart,
        shipping: { fullName, email, address, city, state, zip, phone },
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.10,
        status: 'completed',
        date: new Date().toISOString()
    };
    
    // Save order
    const orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    saveCart([]);
    
    showMessage('Order placed successfully! Order ID: ' + order.id, 'success');
    
    setTimeout(() => {
        window.location.href = 'inventory.html';
    }, 2000);
}

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check page and initialize accordingly
    const currentPage = window.location.pathname;
    
    // Update user name in navbar
    if (isLoggedIn()) {
        const userName = localStorage.getItem('userName');
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = 'Hi, ' + userName;
        }
    }
    
    // Setup logout buttons
    const logoutBtns = document.querySelectorAll('#logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
    
    // Sign Up Page
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }
    
    // Sign In Page
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }
    
    // Inventory Page
    if (currentPage.includes('inventory.html')) {
        requireLogin();
        displayProducts();
        updateCartCount();
        
        const searchForm = document.getElementById('search-btn');
        if (searchForm) {
            searchForm.addEventListener('click', searchProducts);
        }
    }
    
    // Cart Page
    if (currentPage.includes('cart.html')) {
        requireLogin();
        displayCart();
    }
    
    // Checkout Page
    if (currentPage.includes('checkout.html')) {
        requireLogin();
        displayCheckoutTotal();
        
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
    }
});