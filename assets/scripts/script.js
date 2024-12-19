
const slideshowTrack = document.querySelector('.slideshow-track');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
const totalSlides = dots.length;

function updateSlide(index) {
  const slideWidth = document.querySelector('.slideshow-container').offsetWidth;
  slideshowTrack.style.transform = `translateX(-${index * slideWidth}px)`;

  // Update active dot
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlide(currentIndex);
}

function currentSlide(index) {
  currentIndex = index;
  updateSlide(index);
}

// Automatically change slide every 3 seconds
setInterval(nextSlide, 3000);
// Function to add items to the cart and save in LocalStorage
function addToCart(productName, productPrice) {
    console.log(`Adding to cart: ${productName}, ₹${productPrice}`);
    // Retrieve existing cart or initialize it
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add product to cart
    cart.push({
        name: productName,
        price: productPrice,
        quantity: 1,
    });

    // Save cart back to LocalStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Alert user
    alert(`${productName} has been added to your cart!`);
}

// Function to remove item from cart by index
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    displayCart(); // Re-display the updated cart
}

// Function to display cart items on the cart page
function displayCart() {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Retrieve cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Reset cart display
    cartItemsList.innerHTML = "";
    let total = 0;

    // If cart is empty, show a message
    if (cart.length === 0) {
        cartItemsList.innerHTML = "<p>Your cart is empty!</p>";
        checkoutBtn.disabled = true; // Disable Pay button
        return;
    }

    // Display each item in the cart
    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        // Details
        const detailsDiv = document.createElement("div");
        detailsDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: ₹${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
        `;

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("btn", "btn-danger", "btn-sm");
        removeBtn.onclick = function () {
            removeFromCart(index);
        };

        // Append elements
        itemDiv.appendChild(detailsDiv);
        itemDiv.appendChild(removeBtn);

        cartItemsList.appendChild(itemDiv);

        total += item.price * item.quantity;
    });

    // Update total and checkout button
    cartTotal.textContent = `Total: ₹${total}`;
    checkoutBtn.textContent = `Pay ₹${total}`;
    checkoutBtn.disabled = false; // Enable Pay button
}


// Razorpay Payment Integration
function handlePayment() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (total === 0) {
        alert("Your cart is empty! Please add some products.");
        return;
    }

    const options = {
        key: "rzp_live_QkNhaFQgWYh3Ce", // Replace with your Razorpay Test API Key
        amount: total * 100, // Razorpay accepts amount in paisa (₹1 = 100 paisa)
        currency: "INR",
        name: "ShopEasy",
        description: "Payment for your cart items",
        image: "assets/images/images.png", // Replace with your logo URL
        handler: function (response) {
            // Show success message
            document.getElementById("payment-success-message").style.display = 'block';
            document.getElementById("payment-success-message").innerHTML = `Payment Successful! Payment ID: ${response.razorpay_payment_id}`;

            // Clear cart after successful payment
            localStorage.removeItem("cart");

            // Optionally, redirect to another page (like shop page or thank you page)
            setTimeout(function() {
                window.location.href = "index.html"; // Redirect to the shop page
            }, 2000); // Delay redirection for 2 seconds to let the user see the message
        },
        prefill: {
            name: "Your Name", // Optional: Replace with user name
            email: "example@example.com", // Optional: Replace with user email
            contact: "9000000000", // Optional: Replace with user contact
        },
        theme: {
            color: "#528ff0", // Customize button color
        },
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

// Call displayCart only on cart page
if (window.location.pathname.includes("cart.html")) {
    displayCart();
}

