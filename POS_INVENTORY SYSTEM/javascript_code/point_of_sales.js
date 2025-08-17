// ====== DOM ELEMENTS ======
const products = document.querySelectorAll('.product-tile');
const cartBody = document.getElementById('cart-body');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('add-to-cart');

const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');
const changeDueEl = document.getElementById('change-due');

const cancelBtn = document.getElementById('cancel-cart');
const completeBtn = document.getElementById('complete-sale');

const amountPaidInput = document.getElementById('amount-paid');
const calculatorButtons = document.querySelectorAll('.calculator button');

const printBtn = document.getElementById('print-receipt');
const emailBtn = document.getElementById('email-receipt');

const receiptDiv = document.getElementById('receipt');
const receiptCart = receiptDiv.querySelector('#receipt-cart tbody');
const receiptDate = receiptDiv.querySelector('#receipt-date');
const receiptCashier = receiptDiv.querySelector('#receipt-cashier');
const receiptSubtotal = receiptDiv.querySelector('#receipt-subtotal');
const receiptVAT = receiptDiv.querySelector('#receipt-vat');
const receiptTotal = receiptDiv.querySelector('#receipt-total');
const receiptChange = receiptDiv.querySelector('#receipt-change');

const dateTimeEl = document.getElementById('date-time');

// ====== VARIABLES ======
let cart = [];
let calculatorValue = '';
let selectedProduct = null;

// ====== UTILITY FUNCTIONS ======
function updateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let vat = subtotal * 0.15;
    let total = subtotal + vat;

    subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
    vatEl.textContent = `R${vat.toFixed(2)}`;
    totalEl.textContent = `R${total.toFixed(2)}`;

    let amountPaid = parseFloat(amountPaidInput.value) || 0;
    let changeDue = amountPaid - total;
    changeDueEl.textContent = `R${changeDue > 0 ? changeDue.toFixed(2) : '0.00'}`;
}

function renderCart() {
    cartBody.innerHTML = '';
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.quantity}</td>
            <td>${item.name}</td>
            <td>R${item.price.toFixed(2)}</td>
            <td>R${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">X</button></td>
        `;
        cartBody.appendChild(row);
    });

    // Remove item event
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            renderCart();
            updateTotals();
        });
    });

    updateTotals();
}

// ====== PRODUCT SELECTION ======
products.forEach(product => {
    product.addEventListener('click', () => {
        products.forEach(p => p.classList.remove('selected'));
        product.classList.add('selected');
        selectedProduct = product;
    });
});

// ====== ADD TO CART ======
addToCartBtn.addEventListener('click', () => {
    if (!selectedProduct) {
        alert('Please select a product first!');
        return;
    }

    const quantity = parseInt(quantityInput.value) || 1;
    const name = selectedProduct.dataset.name;
    const price = parseFloat(selectedProduct.dataset.price);

    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    renderCart();
    quantityInput.value = 1;
    selectedProduct.classList.remove('selected');
    selectedProduct = null;
});

// ====== CANCEL & COMPLETE SALE ======
cancelBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel the cart?')) {
        cart = [];
        renderCart();
        amountPaidInput.value = '';
        calculatorValue = '';
    }
});

completeBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    evaluateCalculator(); // make sure calculation is finalized
    alert('Sale completed successfully!');
    cart = [];
    renderCart();
    amountPaidInput.value = '';
    calculatorValue = '';
});

// ====== CALCULATOR ======
calculatorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        if (btn.id === 'clear-amount') {
            calculatorValue = '';
            amountPaidInput.value = '';
        } else {
            calculatorValue += value;
            amountPaidInput.value = calculatorValue;
        }
        updateTotals();
    });
});

function evaluateCalculator() {
    if (calculatorValue.trim() === '') return;
    try {
        let result = eval(calculatorValue);
        result = parseFloat(result.toFixed(2));
        calculatorValue = result.toString();
        amountPaidInput.value = calculatorValue;
        updateTotals();
    } catch {
        alert('Invalid calculation!');
        calculatorValue = '';
        amountPaidInput.value = '';
    }
}

// ====== PRINT & EMAIL RECEIPT ======
function populateReceipt() {
    receiptCart.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.quantity}</td>
            <td>${item.name}</td>
            <td>R${item.price.toFixed(2)}</td>
            <td>R${(item.price * item.quantity).toFixed(2)}</td>
        `;
        receiptCart.appendChild(row);
    });

    receiptDate.textContent = new Date().toLocaleString();
    receiptCashier.textContent = document.getElementById('cashier-name').textContent.replace('Cashier: ', '');
    receiptSubtotal.textContent = subtotalEl.textContent;
    receiptVAT.textContent = vatEl.textContent;
    receiptTotal.textContent = totalEl.textContent;
    receiptChange.textContent = changeDueEl.textContent;
}

printBtn.addEventListener('click', () => {
    populateReceipt();
    const printWindow = window.open('', 'PRINT', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Receipt</title>');
    printWindow.document.write('<link rel="stylesheet" href="css code/point_of_sales.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptDiv.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});

emailBtn.addEventListener('click', () => {
    populateReceipt();
    alert('Receipt sent via email (simulation).');
});

// ====== DATE/TIME UPDATE ======
function updateDateTime() {
    const now = new Date();
    dateTimeEl.textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();
