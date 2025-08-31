document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('usage-table');
    const tbody = table.querySelector('tbody');

    const csrfToken = getCookie('csrftoken');

    // -----------------------------
    // Utility: Get CSRF token
    // -----------------------------
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const baseUrl = '/products/';

    // -----------------------------
    // Add Usage
    // -----------------------------
    const addBtn = document.querySelector('.add-btn');
    addBtn.addEventListener('click', async () => {
        const row = addBtn.closest('tr');
        const productId = row.querySelector('#new-product').value;
        const rawMaterialId = row.querySelector('#new-raw-material').value;
        const quantityUsed = row.querySelector('#new-quantity').value;

        if (!quantityUsed || quantityUsed <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const formData = new FormData();
        formData.append('product', productId);
        formData.append('raw_material', rawMaterialId);
        formData.append('quantity_used', quantityUsed);

        try {
            const res = await fetch(baseUrl + 'add-usage-row/', {
                method: 'POST',
                headers: { 'X-CSRFToken': csrfToken },
                body: formData
            });
            const data = await res.json();
            if (data.status === 'success') {
                addUsageRowToTable(data);
                row.querySelector('#new-quantity').value = '';
            } else {
                alert('Error adding usage.');
            }
        } catch (error) {
            console.error(error);
            alert('Request failed.');
        }
    });

    // -----------------------------
    // Add row to table
    // -----------------------------
    function addUsageRowToTable(data) {
        const row = document.createElement('tr');
        row.dataset.id = data.id;
        row.innerHTML = `
            <td>${data.product_name}</td>
            <td>${data.raw_material_name}</td>
            <td>${data.quantity_used}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="save-btn" disabled>Save</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    }

    // -----------------------------
    // Delegate Edit / Save / Delete
    // -----------------------------
    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const row = btn.closest('tr');
        const usageId = row.dataset.id;

        // Delete
        if (btn.classList.contains('delete-btn')) {
            if (!confirm('Are you sure you want to delete this usage?')) return;
            try {
                const res = await fetch(`${baseUrl}delete-usage-row/${usageId}/`, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': csrfToken }
                });
                const data = await res.json();
                if (data.status === 'success') row.remove();
                else alert('Error deleting usage.');
            } catch (error) {
                console.error(error);
                alert('Request failed.');
            }
            return;
        }

        // Edit
        if (btn.classList.contains('edit-btn')) {
            const cells = row.querySelectorAll('td');
            const productName = cells[0].textContent.trim();
            const rawMaterialName = cells[1].textContent.trim();
            const quantityUsed = cells[2].textContent.trim();

            // Clone selects from add row
            const productSelect = document.querySelector('#new-product').cloneNode(true);
            productSelect.value = getProductIdByName(productName);

            const rawMaterialSelect = document.querySelector('#new-raw-material').cloneNode(true);
            rawMaterialSelect.value = getProductIdByName(rawMaterialName);

            cells[0].innerHTML = '';
            cells[0].appendChild(productSelect);
            cells[1].innerHTML = '';
            cells[1].appendChild(rawMaterialSelect);
            cells[2].innerHTML = `<input type="number" value="${quantityUsed}" step="0.01">`;

            row.querySelector('.save-btn').disabled = false;
            btn.disabled = true;
            return;
        }

        // Save
        if (btn.classList.contains('save-btn')) {
            const inputs = row.querySelectorAll('input, select');
            const formData = new FormData();
            formData.append('product', inputs[0].value);
            formData.append('raw_material', inputs[1].value);
            formData.append('quantity_used', inputs[2].value);

            try {
                const res = await fetch(`${baseUrl}edit-usage-row/${usageId}/`, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': csrfToken },
                    body: formData
                });
                const data = await res.json();
                if (data.status === 'success') {
                    row.innerHTML = `
                        <td>${data.product_name}</td>
                        <td>${data.raw_material_name}</td>
                        <td>${data.quantity_used}</td>
                        <td>
                            <button class="edit-btn">Edit</button>
                            <button class="save-btn" disabled>Save</button>
                            <button class="delete-btn">Delete</button>
                        </td>
                    `;
                } else {
                    alert('Error saving usage.');
                }
            } catch (error) {
                console.error(error);
                alert('Request failed.');
            }
            return;
        }
    });

    // -----------------------------
    // Helper: convert product name to id
    // -----------------------------
    function getProductIdByName(name) {
        const options = document.querySelector('#new-product').options;
        for (let opt of options) if (opt.text === name) return opt.value;
        return '';
    }
});
