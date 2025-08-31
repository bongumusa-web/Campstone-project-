document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('category-table');
    const tbody = table.querySelector('tbody');
    const csrfToken = getCookie('csrftoken');
    const baseUrl = '/products/';

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            document.cookie.split(';').forEach(cookie => {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                }
            });
        }
        return cookieValue;
    }

    // Add Category
    const addBtn = document.querySelector('.add-row .add-btn');
    addBtn.addEventListener('click', async () => {
        const row = addBtn.closest('tr');
        const name = row.querySelector('#new-name').value.trim();
        const categoryType = row.querySelector('#new-type').value;

        if (!name) {
            alert('Please enter a category name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category_type', categoryType);

        try {
            const res = await fetch(baseUrl + 'add-category-row/', {
                method: 'POST',
                headers: { 'X-CSRFToken': csrfToken },
                body: formData
            });
            const data = await res.json();
            if (data.status === 'success') {
                addCategoryRowToTable(data);
                row.querySelector('#new-name').value = '';
                row.querySelector('#new-type').selectedIndex = 0;
            } else {
                alert(data.message || 'Error adding category.');
            }
        } catch (error) {
            console.error(error);
            alert('Request failed.');
        }
    });

    function addCategoryRowToTable(data) {
        const row = document.createElement('tr');
        row.dataset.id = data.id;
        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.category_type}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="save-btn" disabled>Save</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    }

    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const row = btn.closest('tr');
        const categoryId = row.dataset.id;

        // Delete
        if (btn.classList.contains('delete-btn')) {
            if (!confirm('Are you sure you want to delete this category?')) return;
            try {
                const res = await fetch(`${baseUrl}delete-category-row/${categoryId}/`, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': csrfToken }
                });
                const data = await res.json();
                if (data.status === 'success') row.remove();
                else alert('Error deleting category.');
            } catch (error) {
                console.error(error);
                alert('Request failed.');
            }
            return;
        }

        // Edit
        if (btn.classList.contains('edit-btn')) {
            const nameTd = row.children[0];
            const typeTd = row.children[1];

            const name = nameTd.textContent.trim();
            const type = typeTd.textContent.trim();

            nameTd.innerHTML = `<input type="text" value="${name}">`;

            const selectTemplate = document.querySelector('#new-type');
            const select = selectTemplate.cloneNode(true);
            for (let option of select.options) {
                if (option.value === type) option.selected = true;
            }
            typeTd.innerHTML = '';
            typeTd.appendChild(select);

            row.querySelector('.save-btn').disabled = false;
            btn.disabled = true;
            return;
        }

        // Save
        if (btn.classList.contains('save-btn')) {
            const nameInput = row.querySelector('input');
            const typeSelect = row.querySelector('select');

            const name = nameInput.value.trim();
            const category_type = typeSelect.value;

            if (!name) {
                alert('Category name cannot be empty.');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('category_type', category_type);

            try {
                const res = await fetch(`${baseUrl}edit-category-row/${categoryId}/`, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': csrfToken },
                    body: formData
                });
                const data = await res.json();
                if (data.status === 'success') {
                    row.innerHTML = `
                        <td>${data.name}</td>
                        <td>${data.category_type}</td>
                        <td>
                            <button class="edit-btn">Edit</button>
                            <button class="save-btn" disabled>Save</button>
                            <button class="delete-btn">Delete</button>
                        </td>
                    `;
                } else {
                    alert(data.message || 'Error saving category.');
                }
            } catch (error) {
                console.error(error);
                alert('Request failed.');
            }
        }
    });
});
