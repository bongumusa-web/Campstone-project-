// File: static/js/add_supplier_product.js

const SUPPLIER_API = "/suppliers/api/suppliers/";
const SUPPLIER_PRODUCT_API = "/suppliers/api/supplier-products/";

// filter
// -----------------------------
// Search
// -----------------------------
const searchInput = document.getElementById("search-product");
const searchBtn = document.getElementById("search-btn");

// Trigger search on button click
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchSupplierProducts(query);
});

// Trigger search on Enter key
searchInput.addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
        const query = searchInput.value.trim();
        fetchSupplierProducts(query);
    }
});


// -----------------------------
// CSRF Token
// -----------------------------
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            const cookie = c.trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// -----------------------------
// DOM Elements
// -----------------------------
const supplierSelect = document.getElementById("new-supplier");
const productInput = document.getElementById("new-product");
const categorySelect = document.getElementById("new-category");
const costInput = document.getElementById("new-cost");
const qtyInput = document.getElementById("new-qty");
const totalInput = document.getElementById("new-total");
const addBtn = document.getElementById("add-product-btn");
const tableBody = document.querySelector("#supplier-product-table tbody");

// -----------------------------
// Calculate total dynamically
// -----------------------------
function calculateTotal() {
    const cost = parseFloat(costInput.value) || 0;
    const qty = parseInt(qtyInput.value) || 0;
    totalInput.value = (cost * qty).toFixed(2);
}
costInput.addEventListener("input", calculateTotal);
qtyInput.addEventListener("input", calculateTotal);

// -----------------------------
// Fetch suppliers for dropdown
// -----------------------------
async function fetchSuppliers() {
    try {
        const res = await fetch(SUPPLIER_API);
        const data = await res.json();
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        data.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = s.name;
            supplierSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching suppliers:", error);
    }
}

// -----------------------------
// Fetch and render supplier products table
// -----------------------------
async function fetchSupplierProducts(query="") {
    try {
        let url = SUPPLIER_PRODUCT_API;
        if(query) url += `?search=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();

        const addRow = document.querySelector(".add-row");
        tableBody.innerHTML = "";
        tableBody.appendChild(addRow);

        data.forEach(sp => {
            const row = document.createElement("tr");
            row.dataset.spId = sp.id;
            row.dataset.supplierId = sp.supplier; // store supplier ID
            row.innerHTML = `
                <td>${sp.supplier_name || "-"}</td>
                <td>${sp.product_name}</td>
                <td>${sp.category_type}</td>
                <td>${sp.cost_price}</td>
                <td>${sp.quantity_purchased}</td>
                <td>${sp.total}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching supplier products:", error);
    }
}

// -----------------------------
// Add new supplier product
// -----------------------------
async function addSupplierProduct() {
    const supplier = supplierSelect.value;
    const productName = productInput.value.trim();
    const categoryType = categorySelect.value;
    const cost = parseFloat(costInput.value) || 0;
    const qty = parseInt(qtyInput.value) || 0;

    if(!supplier || !productName || !categoryType || cost <= 0 || qty <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }

    try {
        const res = await fetch(SUPPLIER_PRODUCT_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({
                supplier: supplier,
                product_name: productName,
                category_type: categoryType,
                cost_price: cost,
                quantity_purchased: qty
            })
        });

        if(res.ok) {
            // Clear inputs
            productInput.value = "";
            categorySelect.value = "";
            costInput.value = "";
            qtyInput.value = "";
            totalInput.value = "";

            // Refresh table
            fetchSupplierProducts();
        } else {
            const err = await res.json();
            console.error("Error adding supplier product:", err);
            alert("Failed to add product.");
        }
    } catch (error) {
        console.error(error);
    }
}

// -----------------------------
// Edit/Delete Inline
// -----------------------------
tableBody.addEventListener("click", async (e) => {
    const row = e.target.closest("tr");
    if(!row || !row.dataset.spId) return;
    const spId = row.dataset.spId;

    // DELETE
    if(e.target.classList.contains("delete-btn")) {
        if(!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${SUPPLIER_PRODUCT_API}${spId}/`, {
                method: "DELETE",
                headers: {"X-CSRFToken": csrftoken}
            });
            if(res.ok) fetchSupplierProducts();
            else alert("Failed to delete.");
        } catch (error) {
            console.error(error);
        }
    }

    // EDIT
    if(e.target.classList.contains("edit-btn")) {
        const cells = row.querySelectorAll("td");
        const supplierId = row.dataset.supplierId;

        cells[0].innerHTML = `
            <select class="edit-supplier">
                <option value="">Select Supplier</option>
            </select>
        `;
        const supplierSelectEdit = cells[0].querySelector(".edit-supplier");
        fetchSuppliers().then(() => {
            const options = supplierSelect.options;
            for(let opt of options) {
                const newOpt = document.createElement("option");
                newOpt.value = opt.value;
                newOpt.textContent = opt.textContent;
                if(opt.value === supplierId) newOpt.selected = true;
                supplierSelectEdit.appendChild(newOpt);
            }
        });

        cells[1].innerHTML = `<input type="text" class="edit-product" value="${cells[1].textContent}">`;
        cells[2].innerHTML = `
            <select class="edit-category">
                <option value="Consumable" ${cells[2].textContent === "Consumable" ? "selected": ""}>Consumable</option>
                <option value="Mass Product" ${cells[2].textContent === "Mass Product" ? "selected": ""}>Mass Product</option>
                <option value="Quantity Product" ${cells[2].textContent === "Quantity Product" ? "selected": ""}>Quantity Product</option>
                <option value="Normal Product" ${cells[2].textContent === "Normal Product" ? "selected": ""}>Normal Product</option>
            </select>
        `;
        cells[3].innerHTML = `<input type="number" class="edit-cost" value="${cells[3].textContent}">`;
        cells[4].innerHTML = `<input type="number" class="edit-qty" value="${cells[4].textContent}">`;

        e.target.textContent = "Save";
        e.target.classList.replace("edit-btn", "save-btn");
    }

    // SAVE
    if(e.target.classList.contains("save-btn")) {
        const supplierId = row.querySelector(".edit-supplier").value;
        const productName = row.querySelector(".edit-product").value.trim();
        const categoryType = row.querySelector(".edit-category").value;
        const cost = parseFloat(row.querySelector(".edit-cost").value) || 0;
        const qty = parseInt(row.querySelector(".edit-qty").value) || 0;

        if(!supplierId || !productName || !categoryType || cost <= 0 || qty <= 0) {
            alert("Please fill all fields correctly.");
            return;
        }

        try {
            const res = await fetch(`${SUPPLIER_PRODUCT_API}${spId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify({
                    supplier: supplierId,
                    product_name: productName,
                    category_type: categoryType,
                    cost_price: cost,
                    quantity_purchased: qty
                })
            });

            if(res.ok) {
                fetchSupplierProducts();
            } else {
                const err = await res.json();
                console.error("Update failed:", err);
                alert("Failed to update product.");
            }
        } catch (error) {
            console.error(error);
        }
    }
});

// -----------------------------
// Search
// -----------------------------
document.getElementById("search-btn").addEventListener("click", () => {
    fetchSupplierProducts(document.getElementById("search-product").value);
});
document.getElementById("search-product").addEventListener("keyup", (e) => {
    if(e.key === "Enter") fetchSupplierProducts(e.target.value);
});

// -----------------------------
// Add product button
// -----------------------------
addBtn.addEventListener("click", addSupplierProduct);

// -----------------------------
// Initial load
// -----------------------------
fetchSuppliers();
fetchSupplierProducts();
