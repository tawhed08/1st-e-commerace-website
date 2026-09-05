// --- SHOPPING CART SYSTEM ---

// Get cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];

// Save cart to localStorage and update all UI views
function saveAndRenderCart() {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
    renderCartUI();
}

// Add item to cart
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    }
    saveAndRenderCart();
    
    // Auto open cart drawer when item is added if drawer exists on page
    const cartContainer = document.getElementById('cart-container');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartContainer && cartDrawer) {
        cartContainer.classList.remove('invisible');
        document.body.classList.add('overflow-hidden');
        requestAnimationFrame(() => {
            if (cartOverlay) cartOverlay.classList.remove('opacity-0');
            cartDrawer.classList.remove('translate-x-full');
        });
    }
}

// Change item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveAndRenderCart();
}

// Remove item completely
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRenderCart();
}

// Render Cart HTML across Drawer, Cart Page, and Checkout Page
function renderCartUI() {
    // 1. Render Side Drawer Container
    const drawerContainer = document.getElementById('cart-items-container');
    const drawerSubtotal = document.getElementById('cart-subtotal');

    // 2. Render Full Cart Page Container
    const fullPageContainer = document.getElementById('full-cart-items-container');
    
    // 3. Render Checkout Preview Container
    const checkoutPreview = document.getElementById('checkout-items-preview');

    // 4. Summary Totals Containers
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');

    let subtotal = 0;

    if (cart.length === 0) {
        const emptyHTML = `<div class="text-center py-12 text-slate-500">Your cart is empty.</div>`;
        if (drawerContainer) drawerContainer.innerHTML = emptyHTML;
        if (drawerSubtotal) drawerSubtotal.innerText = '$0.00';

        if (fullPageContainer) {
            fullPageContainer.innerHTML = `
                <div class="glass-card p-8 rounded-2xl text-center text-slate-500">
                    Your cart is currently empty. <a href="index.html" class="text-teal-400 font-semibold underline ml-1">Start shopping</a>
                </div>`;
        }
        if (checkoutPreview) checkoutPreview.innerHTML = '<p class="text-slate-500 text-sm">No items in cart.</p>';
        if (summarySubtotal) summarySubtotal.innerText = '$0.00';
        if (summaryTax) summaryTax.innerText = '$0.00';
        if (summaryTotal) summaryTotal.innerText = '$0.00';
        return;
    }

    // Build Templates
    let drawerHTML = '';
    let fullPageHTML = '';
    let previewHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Drawer Item Layout
        drawerHTML += `
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg bg-slate-800">
                <div class="flex-grow">
                    <h4 class="font-bold text-white text-sm">${item.name}</h4>
                    <p class="text-teal-400 text-sm font-black">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="updateQuantity(${index}, -1)" class="w-6 h-6 bg-white/10 rounded text-white flex items-center justify-center hover:bg-white/20">-</button>
                        <span class="text-sm font-bold text-white">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="w-6 h-6 bg-white/10 rounded text-white flex items-center justify-center hover:bg-white/20">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-slate-500 hover:text-rose-400 p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;

        // Full Cart Page Layout
        fullPageHTML += `
            <div class="glass-card p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl bg-slate-800 flex-shrink-0">
                    <div>
                        <h4 class="font-bold text-white dark:text-white text-slate-900 text-lg">${item.name}</h4>
                        <p class="text-teal-400 font-black mt-1">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button onclick="updateQuantity(${index}, -1)" class="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition">-</button>
                        <span class="w-6 text-center font-bold text-white dark:text-white text-slate-900">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition">+</button>
                    </div>
                    <span class="font-black text-white dark:text-white text-slate-900 text-lg w-24 text-right">$${itemTotal.toFixed(2)}</span>
                    <button onclick="removeFromCart(${index})" class="text-slate-500 hover:text-rose-400 p-2 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        `;

        // Checkout Preview Layout
        previewHTML += `
            <div class="flex justify-between items-center text-sm text-slate-300">
                <span>${item.name} x ${item.quantity}</span>
                <span class="font-bold">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    if (drawerContainer) drawerContainer.innerHTML = drawerHTML;
    if (drawerSubtotal) drawerSubtotal.innerText = `$${subtotal.toFixed(2)}`;

    if (fullPageContainer) fullPageContainer.innerHTML = fullPageHTML;
    if (checkoutPreview) checkoutPreview.innerHTML = previewHTML;
    
    const tax = subtotal * 0.05; // 5% estimated tax
    const total = subtotal + tax;

    if (summarySubtotal) summarySubtotal.innerText = `$${subtotal.toFixed(2)}`;
    if (summaryTax) summaryTax.innerText = `$${tax.toFixed(2)}`;
    if (summaryTotal) summaryTotal.innerText = `$${total.toFixed(2)}`;
}

// Auto-attach event listeners to product catalog buttons on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCartUI();

    const productCards = document.querySelectorAll('.glass-card');
    productCards.forEach(card => {
        const addBtn = card.querySelector('button');
        const titleEl = card.querySelector('h3');
        const priceEl = card.querySelector('.text-teal-400');
        const imgEl = card.querySelector('img');

        if (addBtn && titleEl && priceEl && addBtn.textContent.includes('Add to Cart')) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = titleEl.innerText;
                const priceText = priceEl.innerText.replace('$', '').trim();
                const price = parseFloat(priceText) || 49.99;
                const image = imgEl ? imgEl.src : 'https://picsum.photos/seed/default/800/800';

                addToCart(name, price, image);
            });
        }
    });
});