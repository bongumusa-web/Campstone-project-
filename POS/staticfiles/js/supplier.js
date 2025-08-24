// ====== MENU TOGGLE ======
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.menu').classList.toggle('active');
});

// API URLs
const apiUrlSupplier = "/suppliers/api/supplier/";
const apiUrlCategory = "/suppliers/api/category/";
const apiUrlProduct = "/suppliers/api/product/";

// CSRF helper
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    document.cookie.split(";").forEach(cookie => {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
      }
    });
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

// Elements
const nameInput = document.getElementById("supplier-name");
const categoryInput = document.getElementById("supplier-category");
const productInput = document.getElementById("supplier-product");
const contactInput = document.getElementById("supplier-contact");
const addressInput = document.getElementById("supplier-address");
const emailInput = document.getElementById("supplier-email");
const stockInput = document.getElementById("supplier-stock");
const quantityInput = document.getElementById("supplier-quantity");
const totalInput = document.getElementById("supplier-total");
const addBtn = document.getElementById("add-supplier-btn");
const tableBody = document.getElementById("suppliers-table-body");
const searchInput = document.getElementById("search-supplier");
const filterCategory = document.getElementById("filter-category");

let editingId = null;
let allProducts = [];

// Auto-calculate total
[stockInput, quantityInput].forEach(el => {
  el.addEventListener("input", () => {
    const stock = parseFloat(stockInput.value) || 0;
    const qty = parseFloat(quantityInput.value) || 0;
    totalInput.value = (stock * qty).toFixed(2);
  });
});

// Load suppliers
async function loadSuppliers() {
  const res = await fetch(apiUrlSupplier);
  const data = await res.json();
  renderTable(data);
  updateFilter(data);
}

// Load categories and products
async function loadCategoriesAndProducts() {
  const resCat = await fetch(apiUrlCategory);
  const categories = await resCat.json();
  categoryInput.innerHTML = `<option value="">Select Category</option>`;
  categories.forEach(c => categoryInput.innerHTML += `<option value="${c.id}">${c.name}</option>`);

  const resProd = await fetch(apiUrlProduct);
  allProducts = await resProd.json();
  productInput.innerHTML = `<option value="">Select Product</option>`;
}

// Update products dropdown based on selected category
categoryInput.addEventListener("change", () => {
  const catId = categoryInput.value;
  const filteredProducts = allProducts.filter(p => p.category === parseInt(catId));
  productInput.innerHTML = `<option value="">Select Product</option>`;
  filteredProducts.forEach(p => productInput.innerHTML += `<option value="${p.id}">${p.name}</option>`);
});

// Render table rows
function renderTable(suppliers) {
  tableBody.innerHTML = "";
  suppliers
    .filter(s => s.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
      (filterCategory.value === "" || s.category === filterCategory.value))
    .forEach(sup => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sup.name}</td>
        <td>${sup.category_name || ''}</td>
        <td>${sup.contact}</td>
        <td>${sup.address}</td>
        <td>${sup.email}</td>
        <td>${sup.product_name || ''}</td>
        <td>${sup.stock_price}</td>
        <td>${sup.quantity}</td>
        <td>${sup.total}</td>
        <td>
          <button onclick="startEdit(${sup.id}, '${sup.name}', '${sup.category}', '${sup.contact}', '${sup.address}', '${sup.email}', '${sup.product}', ${sup.stock_price}, ${sup.quantity})">Edit</button>
          <button onclick="deleteSupplier(${sup.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
}

// Start editing
function startEdit(id, name, category, contact, address, email, product, stock, quantity) {
  editingId = id;
  nameInput.value = name;
  categoryInput.value = category;
  contactInput.value = contact;
  addressInput.value = address;
  emailInput.value = email;
  productInput.value = product;
  stockInput.value = stock;
  quantityInput.value = quantity;
  totalInput.value = (parseFloat(stock) * parseFloat(quantity)).toFixed(2);
  addBtn.textContent = "Update";
}

// Save new or update supplier
async function saveSupplier() {
  const body = {
    name: nameInput.value.trim(),
    category: categoryInput.value,
    contact: contactInput.value.trim(),
    address: addressInput.value.trim(),
    email: emailInput.value.trim(),
    product: productInput.value,
    stock_price: parseFloat(stockInput.value) || 0,
    quantity: parseFloat(quantityInput.value) || 0
  };

  if (!body.name || !body.category) {
    alert("Please fill in Name and Category");
    return;
  }

  let url = apiUrlSupplier;
  let method = "POST";
  if (editingId) {
    url = `${apiUrlSupplier}${editingId}/`;
    method = "PUT";
  }

  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    nameInput.value = categoryInput.value = productInput.value = contactInput.value = addressInput.value = emailInput.value = stockInput.value = quantityInput.value = totalInput.value = "";
    addBtn.textContent = "Add";
    editingId = null;
    loadSuppliers();
  } else {
    alert("Error saving supplier");
  }
}

// Delete supplier
async function deleteSupplier(id) {
  const res = await fetch(`${apiUrlSupplier}${id}/`, {
    method: "DELETE",
    headers: { "X-CSRFToken": csrftoken }
  });
  if (res.ok) loadSuppliers();
}

// Filter/search
searchInput.addEventListener("input", loadSuppliers);
filterCategory.addEventListener("change", loadSuppliers);

// Add/update button
addBtn.addEventListener("click", saveSupplier);

// Update category filter
function updateFilter(suppliers) {
  const cats = [...new Set(suppliers.map(s => s.category_name).filter(c => c))];
  filterCategory.innerHTML = `<option value="">All Categories</option>`;
  cats.forEach(c => filterCategory.innerHTML += `<option value="${c}">${c}</option>`);
}

// Initial load
loadCategoriesAndProducts();
loadSuppliers();
