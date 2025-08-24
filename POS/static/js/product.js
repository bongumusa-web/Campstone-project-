const apiUrl = "products/api/product/";


// ====== MENU TOGGLE ======
 document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.menu').classList.toggle('active');
  });

// ====== CSRF HELPER ======
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

// Load all products
async function loadProducts() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  renderTable(data);
  updateCategoryFilter(data);
}

// Render products in the table
function renderTable(products) {
  const tbody = document.getElementById("products-table-body");
  tbody.innerHTML = "";
  products.forEach((prod) => {
    tbody.innerHTML += `
      <tr>
        <td>${prod.image ? `<img src="${prod.image}" alt="${prod.name}" style="width:50px;height:50px;">` : ''}</td>
        <td>${prod.name}</td>
        <td>${prod.category}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td><button onclick="deleteProduct(${prod.id})">Delete</button></td>
      </tr>
    `;
  });
}

// Update category filter dropdown
function updateCategoryFilter(products) {
  const filter = document.getElementById("filter-category");
  const categories = [...new Set(products.map(p => p.category))];
  filter.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    filter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

// Add new product with CSRF
async function addProduct() {
  const name = document.getElementById("product-name").value;
  const category = document.getElementById("product-category").value;
  const price = document.getElementById("product-price").value;
  const stock = document.getElementById("product-stock").value;
  const image = document.getElementById("product-image").files[0];

  if (!name || !category) {
    alert("Please enter name and category!");
    return;
  }

  let formData = new FormData();
  formData.append("name", name);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("stock", stock);
  if (image) formData.append("image", image);

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrftoken
    },
    body: formData
  });

  if (res.ok) {
    document.getElementById("product-name").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-stock").value = "";
    document.getElementById("product-image").value = "";
    loadProducts();
  } else {
    alert("Error adding product!");
  }
}

// Delete product
async function deleteProduct(id) {
  const res = await fetch(`${apiUrl}${id}/`, { 
    method: "DELETE",
    headers: { "X-CSRFToken": csrftoken }
  });
  if (res.ok) loadProducts();
}

// Filter products
document.getElementById("filter-category").addEventListener("change", async () => {
  const selectedCategory = document.getElementById("filter-category").value;
  const res = await fetch(apiUrl);
  const products = await res.json();
  const filtered = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;
  renderTable(filtered);
});

// Search products
document.getElementById("search-product").addEventListener("input", async () => {
  const searchTerm = document.getElementById("search-product").value.toLowerCase();
  const res = await fetch(apiUrl);
  const products = await res.json();
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
  renderTable(filtered);
});

// Add button listener
document.getElementById("add-product-btn").addEventListener("click", addProduct);

// Initial load
loadProducts();
