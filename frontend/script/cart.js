document.addEventListener("DOMContentLoaded", async function () {
    const cartContainer = document.getElementById("cart-container");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const shippingCost = 4.99; // Ongkos kirim tetap

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    async function fetchCartDetails() {
        if (cartItems.length === 0) {
            updateCartUI([]);
            return;
        }
    
        try {
            const materialIds = cartItems.map(item => item.id).join(",");
            const response = await fetch(`http://127.0.0.1:5000/api/materials/batch?ids=${materialIds}`);
            const materials = await response.json();
    
            let updatedCart = cartItems.map(item => {
                let material = materials.find(mat => mat.material_id == item.id);
                return material ? { ...material, quantity: item.quantity } : null;
            }).filter(item => item !== null);

            updateCartUI(updatedCart);
        } catch (error) {
            console.error("Error fetching cart details:", error);
            updateCartUI([]);
        }
    }

    function updateCartUI(items) {
        cartContainer.innerHTML = "";

        if (items.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-16">
                    <p class="text-2xl font-semibold mb-4">Your cart is empty</p>
                    <p class="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <button id="continue-shopping" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Continue Shopping
                    </button>
                </div>
            `;

            setTimeout(() => {
                const continueShoppingBtn = document.getElementById("continue-shopping");
                if (continueShoppingBtn) {
                    continueShoppingBtn.addEventListener("click", function () {
                        window.location.href = "/frontend/pages/dashboard-product.html";
                    });
                }
            }, 0);
            updateTotals([]);
            return;
        }

        let cartHTML = `
            <div class="bg-white rounded-lg shadow-sm p-4">
                <div class="grid grid-cols-1 md:grid-cols-12 p-4 text-sm font-medium text-gray-500 border-b">
                    <div class="col-span-6">Product</div>
                    <div class="col-span-2 text-center">Price</div>
                    <div class="col-span-2 text-center">Quantity</div>
                    <div class="col-span-2 text-center">Total</div>
                </div>
        `;

        items.forEach((item, index) => {
            cartHTML += `
                <div class="grid grid-cols-1 md:grid-cols-12 p-4 items-center border-b">
                    <div class="md:col-span-6 flex items-center space-x-4">
                        <img src="${item.image || '/frontend/assets/default-placeholder.png'}" alt="${item.title}" class="h-20 w-20 rounded border">
                        <div>
                            <h3 class="font-medium">${item.title}</h3>
                            <p class="text-gray-500 text-sm">${item.category}</p>
                            <button class="text-red-500 text-sm hover:text-red-700 remove-btn" data-index="${index}">
                                🗑 Remove
                            </button>
                        </div>
                    </div>
                    <div class="md:col-span-2 text-center">Rp${item.price.toLocaleString()}</div>
                    <div class="md:col-span-2 flex justify-center">
                        <button class="px-2 py-1 bg-gray-200 rounded" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="px-4 py-1">${item.quantity}</span>
                        <button class="px-2 py-1 bg-gray-200 rounded" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="md:col-span-2 text-center font-medium">Rp${(item.price * item.quantity).toLocaleString()}</div>
                </div>
            `;
        });

        cartHTML += `</div>`;
        cartContainer.innerHTML = cartHTML;
        updateTotals(items);

        // Tambahkan event listener untuk tombol remove
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-index"));
                removeItem(index);
            });
        });
    }

    function updateTotals(items) {
        let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let tax = subtotal * 0.08; // Pajak 8%
        let total = subtotal + tax + shippingCost;

        subtotalElement.textContent = `Rp${subtotal.toLocaleString()}`;
        taxElement.textContent = `Rp${tax.toLocaleString()}`;
        totalElement.textContent = `Rp${total.toLocaleString()}`;
    }

    function updateQuantity(index, change) {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        if (cartItems[index].quantity + change < 1) return;
        cartItems[index].quantity += change;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        fetchCartDetails();
    }

    function removeItem(index) {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        if (index < 0 || index >= cartItems.length) {
            console.error("Invalid index:", index);
            return;
        }

        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));

        // Jika cart kosong setelah menghapus, reload halaman
        if (cartItems.length === 0) {
            location.reload();
        } else {
            location.reload(); // Jika masih ada item, tetap reload :)
        }
    }

    document.getElementById("clear-cart").addEventListener("click", function () {
        localStorage.removeItem("cart");
        location.reload(); // Reload untuk update tampilan
    });

    document.getElementById("checkout").addEventListener("click", function () {
        if (JSON.parse(localStorage.getItem("cart")).length === 0) {
            alert("Your cart is empty!");
        } else {
            alert("Proceeding to checkout...");
            window.location.href = "/frontend/pages/payment.html";
        }
    });

    fetchCartDetails();
});

document.getElementById("checkout").addEventListener("click", function () {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Proceeding to checkout...");
        window.location.href = "/frontend/pages/payment.html";
    }
});

// Mengambil data cart dari localStorage dan menampilkannya
function loadCart() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('shopping-cart');
    cartContainer.innerHTML = '';

    let subtotal = 0;
    cartItems.forEach(item => {
        let itemPrice = parseInt(item.price);
        subtotal += itemPrice;

        let cartItem = document.createElement('div');
        cartItem.className = "cart-item flex justify-between border-b py-2";
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>Rp ${itemPrice.toLocaleString()}</span>
        `;
        cartContainer.appendChild(cartItem);
    });

    let tax = subtotal * 0.08; // Pajak 8%
    let total = subtotal + tax;

    document.getElementById('subtotal-price').innerText = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('tax-amount').innerText = `Rp ${Math.round(tax).toLocaleString()}`;
    document.getElementById('total-price').innerText = `Rp ${Math.round(total).toLocaleString()}`;

    return total;
}

// Mengambil saldo dari database
function fetchWalletBalance(userId) {
    fetch(`http://127.0.0.1:5000/get_wallet_balance?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            walletBalance = data.balance;
            document.getElementById('wallet-balance').innerText = `Rp ${walletBalance.toLocaleString()}`;
        })
        .catch(error => {
            console.error("Gagal mengambil saldo:", error);
        });
}

// Simulasi user_id yang login (bisa diganti dengan sistem autentikasi)
let userId = 101; 
let walletBalance = 0;
fetchWalletBalance(userId);

// Event listener untuk tombol bayar
document.getElementById('pay-button').addEventListener('click', function () {
    let totalPrice = loadCart();

    if (walletBalance < totalPrice) {
        alert("Saldo tidak cukup! Silakan tambah saldo.");
    } else {
        let newBalance = walletBalance - totalPrice;

        fetch("http://127.0.0.1:5000/update_wallet_balance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, new_balance: newBalance })
        })
        .then(response => response.json())
        .then(data => {
            alert("Pembayaran berhasil!");
            walletBalance = newBalance;
            document.getElementById('wallet-balance').innerText = `Rp ${walletBalance.toLocaleString()}`;
            setTimeout(() => { window.location.href = "dashboard-buyer.html"; }, 2000);
        })
        .catch(error => {
            console.error("Gagal memperbarui saldo:", error);
        });
    }
});

// Panggil fungsi loadCart saat halaman dimuat
loadCart();
