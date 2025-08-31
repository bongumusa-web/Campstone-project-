const SUPPLIER_API = "/suppliers/api/suppliers/";

// DOM elements
const newNameInput = document.getElementById("new-name");
const newContactInput = document.getElementById("new-contact");
const newEmailInput = document.getElementById("new-email");
const newAddressInput = document.getElementById("new-address");
const addSupplierBtn = document.getElementById("add-supplier-btn");
const tableBody = document.querySelector("#supplier-table tbody");

// CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
        });
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// Fetch suppliers and render
async function fetchSuppliers() {
    try {
        const res = await fetch(SUPPLIER_API);
        const data = await res.json();
        // Remove old supplier rows
        document.querySelectorAll("#supplier-table tr[data-id]").forEach(row => row.remove());

        data.forEach(supplier => {
            const row = document.createElement("tr");
            row.dataset.id = supplier.id;
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.contact_number || ""}</td>
                <td>${supplier.email || ""}</td>
                <td>${supplier.address || ""}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="save-btn" disabled>Save</button>
                    <button class="delete-btn">Delete</button>
                </td>`;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Error fetching suppliers:", err);
    }
}

// Add new supplier
async function addSupplier() {
    const name = newNameInput.value.trim();
    const contact = newContactInput.value.trim();
    const email = newEmailInput.value.trim();
    const address = newAddressInput.value.trim();

    if (!name) return alert("Name is required");

    try {
        const res = await fetch(SUPPLIER_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({ name, contact_number: contact, email, address })
        });

        if (res.ok) {
            newNameInput.value = "";
            newContactInput.value = "";
            newEmailInput.value = "";
            newAddressInput.value = "";
            fetchSuppliers();
        } else {
            const err = await res.json();
            console.error(err);
            alert("Failed to add supplier");
        }
    } catch (err) {
        console.error(err);
    }
}

// Edit/Delete logic
tableBody.addEventListener("click", async e => {
    const row = e.target.closest("tr");
    const supplierId = row.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
        if (!confirm("Are you sure you want to delete this supplier?")) return;
        try {
            const res = await fetch(`${SUPPLIER_API}${supplierId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": csrftoken }
            });
            if (res.ok) fetchSuppliers();
            else alert("Failed to delete");
        } catch (err) { console.error(err); }
        return;
    }

    if (e.target.classList.contains("edit-btn")) {
        const cells = row.querySelectorAll("td");
        cells[0].innerHTML = `<input type="text" value="${cells[0].textContent}">`;
        cells[1].innerHTML = `<input type="text" value="${cells[1].textContent}">`;
        cells[2].innerHTML = `<input type="email" value="${cells[2].textContent}">`;
        cells[3].innerHTML = `<input type="text" value="${cells[3].textContent}">`;
        e.target.disabled = true;
        row.querySelector(".save-btn").disabled = false;
    }

    if (e.target.classList.contains("save-btn")) {
        const inputs = row.querySelectorAll("input");
        const updatedSupplier = {
            name: inputs[0].value.trim(),
            contact_number: inputs[1].value.trim(),
            email: inputs[2].value.trim(),
            address: inputs[3].value.trim()
        };

        try {
            const res = await fetch(`${SUPPLIER_API}${supplierId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(updatedSupplier)
            });
            if (res.ok) fetchSuppliers();
            else alert("Failed to update supplier");
        } catch (err) { console.error(err); }
    }
});

// Initial fetch
fetchSuppliers();
addSupplierBtn.addEventListener("click", addSupplier);
