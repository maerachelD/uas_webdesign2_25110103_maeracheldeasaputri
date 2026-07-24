let cart = JSON.parse(localStorage.getItem('insyira_cart')) || [];


document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
});


function addToCart(productName, price) {
    let existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    
    saveCartToStorage();
    updateCartUI();
}


function saveCartToStorage() {
    localStorage.setItem('insyira_cart', JSON.stringify(cart));
}


function updateCartUI() {
    let cartCountElement = document.getElementById('cartCount');
    let listContainer = document.getElementById('cartItemsList');
    let totalPriceElement = document.getElementById('cartTotalPrice');

    
    if (!cartCountElement) return;

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;


    if (!listContainer || !totalPriceElement) return;

    if (cart.length === 0) {
        listContainer.innerHTML = '<p class="text-muted text-center my-3">Keranjang masih kosong nih. Yuk belanja!</p>';
        totalPriceElement.innerText = "Rp 0";
        return;
    }

    let htmlContent = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let subTotal = item.price * item.quantity;
        totalPrice += subTotal;

        htmlContent += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">${item.name}</h6>
                    <small class="text-muted">Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold text-success me-2">Rp ${subTotal.toLocaleString('id-ID')}</span>
                    <button onclick="changeQuantity(${index}, -1)" class="btn btn-sm btn-outline-secondary py-0 px-2">-</button>
                    <button onclick="changeQuantity(${index}, 1)" class="btn btn-sm btn-outline-secondary py-0 px-2">+</button>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = htmlContent;
    totalPriceElement.innerText = "Rp " + totalPrice.toLocaleString('id-ID');
}


function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
  
    saveCartToStorage();
    updateCartUI();
}


function checkoutToWhatsApp() {
    if (cart.length === 0) {
        alert("Keranjang belanja kamu masih kosong!");
        return;
    }

    let phoneNumber = "6281251174138";
    let message = "Halo Insyira Oleh-Oleh, saya mau pesan oleh-oleh lewat website:\n\n";
    let total = 0;

    cart.forEach((item, i) => {
        let sub = item.price * item.quantity;
        total += sub;
        message += `${i+1}. ${item.name} (${item.quantity}x) = Rp ${sub.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Akhir: Rp ${total.toLocaleString('id-ID')}*`;
    
  
  
    cart = [];
    saveCartToStorage();
    updateCartUI();

    let url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}


function clearCart() {
    let yakin = confirm("Apakah kamu yakin ingin mengosongkan semua isi keranjang belanja?");
    
    if (yakin) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
    }
}