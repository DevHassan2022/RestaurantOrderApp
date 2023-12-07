// Import of menuArray from data.js
import { menuArray } from "./data.js";

// DOM elements
const menuOptionsContainer = document.getElementById('menu-items-container');
const completeOrderBtn = document.getElementById('complete-order-btn');
const paymentForm = document.getElementById('payment-modal--form');
const paymentModal = document.getElementById('payment-modal');
const checkoutSection = document.getElementById('checkout-section');
const orderSummaryContainer = document.getElementById('ordered-items-container');
const starIcons = document.querySelectorAll('.fa-star');
const eyeIcons = document.querySelectorAll('.eye-icon');
const creditCardInput = document.getElementById('customerCreditCard');
const creditCardErrorMessage = document.getElementById('creditcard-errormessage');
const cvvInput = document.getElementById('cvv');
const cvvErrorMessage = document.getElementById('cvv-errormessage');

//  Event listener for various clicks
document.addEventListener('click', e => {
    if (e.target.dataset.add) {
        handleAddBtnClick(e.target.dataset.add);
    } else if (e.target.dataset.remove) {
        handleRemoveBtnClick(e.target.dataset.remove);
    } else if (e.target.dataset.star) {
        handleStarClick(e.target.dataset.star);
    } else if (e.target.id === 'modal-close-btn') {
        handleCloseModalClick();
    } else if(e.target.id === 'complete-order-btn') {
        handleCompleteOrderBtnClick()
    }
     else if(e.target.dataset.toggle) {
        toggleVisibility(e.target.dataset.toggle, e.target)
    }
});


// Initialize orderArray to store selected items
const orderArray = [];

// Function to generate menu HTML
function getMenuHtml() {
    let menuHtml = '';
    
    menuArray.forEach(function (menu) {
        menuHtml += `
            <div class="menu-item">
                <p class="menu-item--emojis">${menu.emoji}</p>
                <div class="menu-item--details">
                    <h2 class="menu-item--name">${menu.name}</h2>
                    <p class="menu-item--ingredients">${menu.ingredients}</p>
                    <h4 class="menu-item--price">$${menu.price}</h4>
                </div>
                <button class="menu-item--add_btn" data-add='${menu.id}'> + </button>
            </div>
        `;
    });

    return menuHtml;
}


// Function to render menu items
function renderMenuItems() {
    const menuHtml = getMenuHtml();
    menuOptionsContainer.innerHTML = menuHtml;
}


// Function to handle 'Add' button click
function handleAddBtnClick(itemId) {
    const targetOrderObj = menuArray.find(menuItem => menuItem.id == itemId);
    checkoutSection.style.display = 'block';
    orderArray.push(targetOrderObj);
    
    renderOrder();
    calculateAndRenderTotal();
}

// Function to handle 'Remove' button click
function handleRemoveBtnClick(removedItemId) {
    const targetRemovedOrderObj = orderArray.find(order => order.id == removedItemId);
    const index = orderArray.indexOf(targetRemovedOrderObj);
    if (index !== -1) {
        orderArray.splice(index, 1);
        renderOrder();
        calculateAndRenderTotal();
    }
}

// Function to handle 'X' button click on modal
function handleCloseModalClick(){
     document.getElementById('modal').style.display = 'none'
}

// Function to ensure numeric inputs for credit card and cvv.
handleNumericInput(creditCardInput, creditCardErrorMessage);
handleNumericInput(cvvInput, cvvErrorMessage);


// Function to render the order summary
function renderOrder() {
    let orderHtml = '';
    const aggregatedItemsArray = [];
   
    orderArray.forEach(orderItem => {
        const { name, price, id } = orderItem;
        const existingItem = aggregatedItemsArray.find(item => item.id === id);

        if (!existingItem) {
            aggregatedItemsArray.push({
                id,
                name,
                price,
                quantity: 1
            });
        } else {
            existingItem.quantity++;
            existingItem.price += price;
        }
    });

    aggregatedItemsArray.forEach(order => {
        const { name, price, id, quantity } = order;
        orderHtml += `
            <div class="order-item">
                <p class="order-item-name">${name} (${quantity}x)</p>
                <button class="remove-btn" data-remove="${id}">remove</button>
                <p class="order-item-price">$${price}</p>
            </div>
        `;
    });

    orderSummaryContainer.innerHTML = orderHtml;
}

// Function to calculate and render total price
function calculateAndRenderTotal() {
    const total = calculateTotal(orderArray);
    const totalPrice = document.getElementById('total-price');
    const discountedPrice = document.getElementById('discounted-price');

    if (total === 0) {
        completeOrderBtn.disabled = true;
    } else {
        completeOrderBtn.disabled = false;
    }

    if (total < 50) {
        totalPrice.innerHTML = ` $${total}`;
        discountedPrice.innerHTML = `$0`;
    } else {
        totalPrice.innerHTML = ` $${total}`;
        discountedPrice.innerHTML = `<span class="discount">50% discount applied</span>$${total / 2}`;
    }

    // Check if total drops below 50 after removing items
    if (total < 50 && total > 0) {
        discountedPrice.innerHTML = `$0`;
    }
}

// Calculate total price
function calculateTotal(ordersArr) {
    return ordersArr.reduce((total, currentItem) => total + currentItem.price, 0);
}

// Function to start the confetti animation
function startConfettiAnimation() {
    const confettiColors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#FFA500', '#C71585', '#FF6347', '#ADFF2F', '#800080', '#00FF00', '#4682B4', '#FFD700', '#8A2BE2', '#BC8F8F', '#32CD32', '#20B2AA', '#FF8C00'];
    const confettiCount = 800;

    const fullscreenCelebration = document.createElement('div');
    fullscreenCelebration.classList.add('fullscreen-celebration');

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * -100}vh`;
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        fullscreenCelebration.appendChild(confetti);
    }

    document.body.appendChild(fullscreenCelebration);

    setTimeout(() => {
        document.body.removeChild(fullscreenCelebration);
    }, 10000);
}

// Function to render thanks message
function renderThanksMessage(customerName) {
    const clientName = document.getElementById('clientName');
    clientName.textContent = customerName;
}

// Function to initialize the menu rendering
function initializeMenu() {
    renderMenuItems();
}

// Event listener for payment form submission
paymentForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const paymentFormData = new FormData(paymentForm);
    const name = paymentFormData.get('customerName');
    
    paymentModal.style.display = 'none';
    checkoutSection.style.display = 'none';
    document.getElementById('thanks-message-section').style.display = 'flex';
    startConfettiAnimation();
    renderThanksMessage(name);
});


let selectedRating = 0;

function handleStarClick(starNumber) {
    // Convert NodeList to an array using Array.from()
    const starIconsArray = Array.from(document.querySelectorAll('.star'));

    // Remove 'gold' class from all stars
    starIconsArray.forEach((star, index) => {
        if (index < starNumber) {
            star.classList.add('gold');
            star.classList.add('star-spin-animation'); // Add spinning animation class
            // Remove spinning animation class after 1000ms (1s)
            setTimeout(() => {
                star.classList.remove('star-spin-animation');
            }, 1000);
        } else {
            star.classList.remove('gold');
        }
    });

    selectedRating = starNumber;
    document.getElementById('rating-in-words').textContent = `${selectedRating} stars`;
}

function handleNumericInput(inputElement, errorMessageElement) {
    inputElement.addEventListener('input', function(e) {
        const enteredValue = e.target.value;
        const formattedValue = enteredValue.replace(/[^\d\s]/g, ''); // Remove non-digits and non-spaces

        if (enteredValue !== formattedValue) {
            errorMessageElement.textContent = 'Please enter only numbers.';
            inputElement.parentElement.classList.add('has-error'); // Add 'has-error' class
            e.target.value = formattedValue; // Update input value with formatted content
        } else {
            errorMessageElement.textContent = '';
            inputElement.parentElement.classList.remove('has-error'); // Remove 'has-error' class
        }

        // Remove spaces for digit counting
        const withoutSpaces = formattedValue.replace(/\s/g, '');
        const digitCount = withoutSpaces.length;

        if (digitCount > 0 && digitCount % 4 === 0) {
            const regex = /\d{4}(?=\d)/g;
            e.target.value = formattedValue.replace(regex, '$& '); // Add space after every 4 digits
        } else {
            e.target.value = formattedValue; // Update input value with formatted content (with spaces)
        }

    });
}

function toggleVisibility(inputId, icon) {
    icon.classList.toggle('uncross')
    const inputField = document.getElementById(inputId);
    if (inputField.getAttribute('type') === 'text') {
        inputField.setAttribute('type', 'password');
        
    } else {
        inputField.setAttribute('type', 'text');
    }
}

// Event handler for the 'Complete Order' button
function handleCompleteOrderBtnClick() {
    paymentModal.style.display = 'block';
};


// Function to hide the modal after a specified time
function hideModalAfterDelay() {
    setTimeout(() => {
        const modalElement = document.getElementById('modal');
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }, 7000); // Hides the modal after 5 seconds (5000 milliseconds)
}

// Function to start the process of hiding the modal
hideModalAfterDelay();

// Countdown timer
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    const todaysDate = new Date().getDate();
    const endDate = new Date().getDate() + 30;

    setInterval(() => {
        const days = endDate - todaysDate;
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();

        if (days > 0) {
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            countdownElement.innerHTML = 'Countdown Ended';
        }
    }, 1000);
}

// Start the countdown when the window loads
window.onload = startCountdown();

// Initialize menu rendering when the page loads
initializeMenu();
        