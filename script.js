document.addEventListener('DOMContentLoaded', () => {
  const cart = [];
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const orderTotal = document.getElementById('order-total');
  const emptyCartMessage = document.getElementById('empty-cart-message');

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productItem = e.target.closest('.product-item');
      const productName = productItem.querySelector('h2').innerText;
      const productPrice = parseFloat(productItem.querySelector('.price').innerText.replace('$', ''));

      const existingItem = cart.find(item => item.name === productName);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
      }
      updateCart();

      // Show quantity controls and disable Add to Cart button
      const quantityControl = productItem.querySelector('.quantity-control');
      const addToCartButton = productItem.querySelector('.add-to-cart');
      if (quantityControl.classList.contains('hidden')) {
        quantityControl.classList.remove('hidden');
        addToCartButton.textContent = 'Added to Cart';
        addToCartButton.disabled = true;
      }
    });
  });

  function updateCart() {
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItems.appendChild(emptyCartMessage);
    } else {
      emptyCartMessage.remove();
    }

    cart.forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        ${item.name} - $${(item.price * item.quantity).toFixed(2)} (${item.quantity})
        <div class="cart-item-actions">
          <button class="decrement-quantity" data-index="${index}">
            <img src="assets/images/icon-decrement-quantity.svg" alt="Decrement Quantity">
          </button>
          <button class="increment-quantity" data-index="${index}">
            <img src="assets/images/icon-increment-quantity.svg" alt="Increment Quantity">
          </button>
          <button class="remove-item" data-index="${index}">
            <img src="assets/images/icon-remove-item.svg" alt="Remove Item">
          </button>
        </div>
      `;
      listItem.querySelector('.decrement-quantity').addEventListener('click', () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        updateCart();
      });
      listItem.querySelector('.increment-quantity').addEventListener('click', () => {
        cart[index].quantity += 1;
        updateCart();
      });
      listItem.querySelector('.remove-item').addEventListener('click', () => {
        cart.splice(index, 1);
        updateCart();
      });
      cartItems.appendChild(listItem);
      total += item.price * item.quantity;
    });

    orderTotal.innerText = total.toFixed(2);
  }

  // Add event listeners for increment and decrement buttons
  document.querySelectorAll('.increment-quantity').forEach(button => {
    button.addEventListener('click', (e) => {
      const quantity = e.target.closest('.product-item').querySelector('.quantity');
      quantity.textContent = parseInt(quantity.textContent) + 1;

      // Update the cart quantity for the corresponding item
      const productName = e.target.closest('.product-item').querySelector('h2').innerText;
      const cartItem = cart.find(item => item.name === productName);
      cartItem.quantity = parseInt(quantity.textContent);
      updateCart();
    });
  });

  document.querySelectorAll('.decrement-quantity').forEach(button => {
    button.addEventListener('click', (e) => {
      const quantity = e.target.closest('.product-item').querySelector('.quantity');
      const currentQuantity = parseInt(quantity.textContent);
      if (currentQuantity > 1) {
        quantity.textContent = currentQuantity - 1;

        // Update the cart quantity for the corresponding item
        const productName = e.target.closest('.product-item').querySelector('h2').innerText;
        const cartItem = cart.find(item => item.name === productName);
        cartItem.quantity = parseInt(quantity.textContent);
        updateCart();
      }
    });
  });
});
