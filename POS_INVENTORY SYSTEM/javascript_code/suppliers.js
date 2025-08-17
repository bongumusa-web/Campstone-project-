let supplierList = [];
let categories = [];

const supplierName = document.getElementById("supplier-name");
const supplierCategory = document.getElementById("supplier-category");
const supplierContact = document.getElementById("supplier-contact");
const addSupplierBtn = document.getElementById("add-supplier-btn");
const suppliersTableBody = document.getElementById("suppliers-table-body");
const filterCategorySelect = document.getElementById("filter-category");
const searchInput = document.getElementById("search-supplier");

// Add Supplier
addSupplierBtn.addEventListener("click", function(){
  const name = supplierName.value.trim();
  const category = supplierCategory.value.trim();
  const contact = supplierContact.value.trim();

  if(!name || !category) return alert("Please fill in Name and Category");

  const supplier = { name, category, contact };
  supplierList.push(supplier);

  // Add category to filter if not exists
  if(!categories.includes(category)){
    categories.push(category);
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterCategorySelect.appendChild(option);
  }

  renderSuppliersTable();

  // Reset inputs
  supplierName.value = "";
  supplierCategory.value = "";
  supplierContact.value = "";
});

// Render Table
function renderSuppliersTable(){
  suppliersTableBody.innerHTML = "";
  const search = searchInput.value.toLowerCase();
  const filterCat = filterCategorySelect.value;

  supplierList
    .filter(sup => sup.name.toLowerCase().includes(search) && (filterCat === "" || sup.category === filterCat))
    .forEach((sup, index) => {
      suppliersTableBody.innerHTML += `
        <tr>
          <td>${sup.name}</td>
          <td>${sup.category}</td>
          <td>${sup.contact}</td>
          <td><button onclick="deleteSupplier(${index})">Delete</button></td>
        </tr>
      `;
    });
}

// Delete Supplier
function deleteSupplier(index){
  const removed = supplierList.splice(index,1)[0];

  // Remove category from filter if no longer exists
  if(!supplierList.some(s => s.category === removed.category)){
    categories = categories.filter(c => c !== removed.category);
    Array.from(filterCategorySelect.options).forEach(option => {
      if(option.value === removed.category) option.remove();
    });
  }

  renderSuppliersTable();
}

// Search & Filter
searchInput.addEventListener("input", renderSuppliersTable);
filterCategorySelect.addEventListener("change", renderSuppliersTable);
