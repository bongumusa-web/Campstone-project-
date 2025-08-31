// static/js/add_product.js.


// search bar

// Live search filter
const searchInput = document.getElementById("search-product");
searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#product-table tbody tr:not(.add-row)");

    rows.forEach(row => {
        const productName = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
        if (productName.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("product-table");
    const addBtn = document.querySelector(".add-btn");

    // Auto-fill stock & stock price when supplier product changes
    const supplierSelect = document.getElementById("new-supplier-product");
    const stockInput = document.getElementById("new-stock");
    const costInput = document.getElementById("new-stock-price");

    supplierSelect.addEventListener("change", function () {
        const selected = supplierSelect.options[supplierSelect.selectedIndex];
        stockInput.value = selected.dataset.stock || "";
        costInput.value = selected.dataset.cost || "";
    });

    // Handle adding new product
    addBtn.addEventListener("click", function () {
        const supplierProductId = supplierSelect.value;
        const categoryName = document.getElementById("new-category").value.trim();
        const price = document.getElementById("new-price").value;
        const unit = document.getElementById("new-unit").value;
        const imageInput = document.getElementById("new-image");

        if (!supplierProductId || !categoryName || !price || !unit) {
            alert("Please fill in all required fields.");
            return;
        }

        let formData = new FormData();
        formData.append("supplier_product", supplierProductId); // backend expects "supplier_product"
        formData.append("category_name", categoryName);
        formData.append("selling_price", price);
        formData.append("unit", unit);
        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }

        fetch("/products/add-product-row/", {
            method: "POST",
            headers: { "X-CSRFToken": getCSRFToken() },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    location.reload(); // refresh to show new row
                } else {
                    alert("Error adding product: " + (data.message || "Unknown error"));
                }
            })
            .catch((err) => console.error("Error:", err));
    });

    // Edit product row
    table.addEventListener("click", function (e) {
        if (e.target.classList.contains("edit-btn")) {
            const row = e.target.closest("tr");
            toggleEditable(row, true);
        } else if (e.target.classList.contains("save-btn")) {
            const row = e.target.closest("tr");
            saveRow(row);
        } else if (e.target.classList.contains("delete-btn")) {
            const row = e.target.closest("tr");
            deleteRow(row);
        }
    });

    // Toggle edit mode
    function toggleEditable(row, editable) {
        const cells = row.querySelectorAll("td");
        if (editable) {
            cells[3].innerHTML = `<input type="number" value="${cells[3].innerText}" step="0.01">`; // selling_price
            cells[6].innerHTML = `<input type="text" value="${cells[6].innerText}">`; // unit
            row.querySelector(".save-btn").disabled = false;
            row.querySelector(".edit-btn").disabled = true;
        } else {
            row.querySelector(".save-btn").disabled = true;
            row.querySelector(".edit-btn").disabled = false;
        }
    }

    // Save product row
    function saveRow(row) {
    const id = row.dataset.id;
    const price = row.querySelector("td:nth-child(4) input").value;
    const unit = row.querySelector("td:nth-child(7) input").value;

    let formData = new FormData();
    formData.append("selling_price", price);
    formData.append("unit", unit);

    fetch(`/products/edit-product-row/${id}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            } else {
                alert("Error saving product: " + (data.error || "Unknown error"));
            }
        })
        .catch((err) => console.error("Error:", err));
}


    // Delete product row
    function deleteRow(row) {
        const id = row.dataset.id;
        if (!confirm("Are you sure you want to delete this product?")) return;

        fetch(`/products/delete-product-row/${id}/`, {
            method: "POST",
            headers: { "X-CSRFToken": getCSRFToken() },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    row.remove();
                } else {
                    alert("Error deleting product: " + (data.message || "Unknown error"));
                }
            })
            .catch((err) => console.error("Error:", err));
    }

    // Helper: Get CSRF token
    function getCSRFToken() {
        let cookieValue = null;
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith("csrftoken=")) {
                cookieValue = cookie.substring("csrftoken=".length);
                break;
            }
        }
        return cookieValue;
    }
});
