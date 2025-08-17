// ===== Sample categories =====
const categories = ["Spices", "Sauce", "Vinegar", "Other"];

// Fill categories in form & filter
const categorySelect = document.getElementById("product-category");
const filterSelect = document.getElementById("filter-category");

categories.forEach(cat => {
  let option1 = document.createElement("option");
  option1.value = cat;
  option1.textContent = cat;
  categorySelect.appendChild(option1);

  let option2 = document.createElement("option");
  option2.value = cat;
  option2.textContent = cat;
  filterSelect.appendChild(option2);
});

// ===== Products Array =====
let products = [
  {name: "abcd", category: "Spices", price: 100, stock: 10},
  {name: "efgh", category: "Sauce", price: 50, stock: 20},
];

// ===== Render Table =====
function renderTable() {
  const tbody = document.getElementById("products-table-body");
  tbody.innerHTML = ""; // clear table

  products.forEach((prod, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${prod.name}</td>
      <td>${prod.category}</td>
      <td>${prod.price}</td>
      <td>${prod.stock}</td>
      <td>
        <button onclick="deleteProduct(${index})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ===== Add Product =====
document.getElementById("product-form").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("product-name").value;
  const category = document.getElementById("product-category").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const stock = parseInt(document.getElementById("product-stock").value);

  products.push({name, category, price, stock});

  // Clear form
  this.reset();

  renderTable();
});

// ===== Delete Product =====
function deleteProduct(index) {
  products.splice(index, 1);
  renderTable();
}

// ===== Search & Filter =====
document.getElementById("search-product").addEventListener("keyup", function() {
  renderTableFiltered();
});

document.getElementById("filter-category").addEventListener("change", function() {
  renderTableFiltered();
});

function renderTableFiltered() {
  const searchValue = document.getElementById("search-product").value.toLowerCase();
  const filterValue = document.getElementById("filter-category").value;

  const tbody = document.getElementById("products-table-body");
  tbody.innerHTML = "";

  products.forEach((prod, index) => {
    if(
      prod.name.toLowerCase().includes(searchValue) &&
      (filterValue === "" || prod.category === filterValue)
    ) {
      let row = document.createElement("tr");

      row.innerHTML = `
        <td>${prod.name}</td>
        <td>${prod.category}</td>
        <td>${prod.price}</td>
        <td>${prod.stock}</td>
        <td>
          <button onclick="deleteProduct(${index})">Delete</button>
        </td>
      `;

      tbody.appendChild(row);
    }
  });
}

// ===== Initial render =====
renderTable();
