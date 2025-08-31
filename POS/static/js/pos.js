// Simple JS to add product to cart

document.addEventListener("DOMContentLoaded", () => {
  const products = document.querySelectorAll(".product-box");
  const receiptBody = document.getElementById("receipt-body");

  let cart = [];

  products.forEach(product => {
    product.addEventListener("click", () => {
      const id = product.dataset.id;
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      renderCart();
    });
  });

  function renderCart() {
    receiptBody.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const row = document.createElement("tr");
      const subtotal = item.price * item.quantity;
      total += subtotal;
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>R${subtotal.toFixed(2)}</td>
      `;
      receiptBody.appendChild(row);
    });

    document.getElementById("total").textContent = `R${total.toFixed(2)}`;
    document.getElementById("vat").textContent = `R${(total * 0.15).toFixed(2)}`;
    document.getElementById("paid").textContent = `R${total.toFixed(2)}`;
    document.getElementById("change").textContent = `R0.00`;
    const now = new Date();
    document.getElementById("receipt-datetime").textContent = now.toLocaleString();
  }
});