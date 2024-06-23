document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.querySelector('.bi-cart');
    const cartSection = document.querySelector('#cart');
    const cartCounter = document.querySelector('.cart-counter');
    const cancelBtn = document.querySelector('.cancel-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const shippingForm = document.querySelector('#shipping-form');
    const cartContent = document.querySelector('.cart-content');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const proceedBtn = document.getElementById('proceed');

    let cart = [];
    let total = 0;

    cartIcon.addEventListener('click', function () {
        cartSection.classList.toggle('hidden');
    });

    cancelBtn.addEventListener('click', function () {
        cartSection.classList.add('hidden');
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const product = button.closest('.product');
            const description = product.querySelector('.description').textContent;
            const price = parseFloat(product.querySelector('.price').textContent.replace('₦', ''));
            const imageSrc = product.querySelector('img').src;

            cart.push({ description, price, imageSrc });
            total += price;

            updateCart();
        });
    });

    checkoutBtn.addEventListener('click', function () {
        payWithFlutterwave();
    });

    proceedBtn.addEventListener('click', function () {
        proceedToCheckout();
    });

    cartItemsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-item')) {
            const itemIndex = e.target.dataset.index;
            total -= cart[itemIndex].price;
            cart.splice(itemIndex, 1);
            updateCart();
        }
    });

    function updateCart() {
        cartCounter.textContent = cart.length;
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <div class="item-details">
                    <img src="${item.imageSrc}" alt="Item Image" class="item-image" style="width: 70px; height: 70px;">
                    <div class="item-info">
                        <p class="item-description">${item.description}</p>
                        <p class="item-price">₦${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(li);
        });

        totalElement.textContent = `Total: ₦${total.toFixed(2)}`;
    }

    function proceedToCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        sessionStorage.setItem('cartDetails', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    }

    function payWithFlutterwave() {
        FlutterwaveCheckout({
            public_key: "FLWPUBK_TEST-e8b5e2ded4fa0d922f94f34ac2d6a4c7-X",
            tx_ref: "hooli-tx-1920bbtytty",
            amount: total,
            currency: "NGN",
            payment_options: "card, banktransfer, ussd",
            redirect_url: "https://your_redirect_url.com",
            meta: {
                consumer_id: 23,
                consumer_mac: "92a3-912ba-1192a",
            },
            customer: {
                email: "customer-email@example.com",
                phone_number: "08012345678",
                name: "Yemi Desola",
            },
            callback: function (data) {
                console.log(data);
            },
            onclose: function() {
                // close modal
            },
            customizations: {
                title: "My store",
                description: "Payment for items in cart",
                // logo: "https://example.com/logo.png",
            },
        });
    }
});
