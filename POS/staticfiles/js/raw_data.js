document.addEventListener('DOMContentLoaded', () => {

    const table = document.getElementById('raw-data-table');
    const searchBox = document.getElementById('search-box');
    const categoryFilter = document.getElementById('category-filter');

    // Event delegation for edit, save, delete
    table.addEventListener('click', e => {
        const btn = e.target;
        const row = btn.closest('tr');
        if (!row) return;

        if (btn.classList.contains('edit-btn')) editRow(row);
        if (btn.classList.contains('save-btn')) saveRow(row);
        if (btn.classList.contains('delete-btn')) deleteRow(row);
    });

    // Edit row
    function editRow(row) {
        row.querySelectorAll('input, select').forEach(el => {
            el.removeAttribute('readonly');
            el.removeAttribute('disabled');
        });
        row.querySelector('.save-btn').disabled = false;
        row.querySelector('.edit-btn').disabled = true;
    }

    // Save row
    function saveRow(row) {
        const productId = row.dataset.productId;
        const usageId = row.dataset.usageId;
        const inputs = row.querySelectorAll('input, select');
        const formDataProduct = new URLSearchParams();
        const formDataUsage = new URLSearchParams();

        // Map inputs to fields
        formDataProduct.append('name', inputs[0].value);
        formDataProduct.append('category', inputs[1].value);
        formDataProduct.append('selling_price', inputs[4].value);
        formDataProduct.append('stock_quantity', inputs[5].value);
        formDataProduct.append('unit', inputs[6].value);

        formDataUsage.append('product', productId);
        formDataUsage.append('raw_material', inputs[2].value);
        formDataUsage.append('quantity_used', inputs[3].value);

        // Update Product
        fetch(`/product/edit-product-row/${productId}/`, {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
            body: formDataProduct
        }).then(res => res.json())
          .then(data => {
              if (data.status === 'success') {
                  inputs.forEach(el => { el.setAttribute('readonly', true); el.setAttribute('disabled', true); });
                  row.querySelector('.edit-btn').disabled = false;
                  row.querySelector('.save-btn').disabled = true;
              } else alert('Error saving product');
          });

        // Update Usage
        fetch(`/product/edit-usage-row/${usageId}/`, {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
            body: formDataUsage
        }).then(res => res.json())
          .then(data => {
              if (data.status !== 'success') console.warn('Usage not updated');
          });
    }

    // Delete row
    function deleteRow(row) {
        if (!confirm('Delete this row?')) return;
        const productId = row.dataset.productId;
        const usageId = row.dataset.usageId;

        if (productId) {
            fetch(`/product/delete-product-row/${productId}/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') }
            }).then(res => res.json())
              .then(data => { if (data.status === 'success') row.remove(); else alert('Error deleting product'); });
        }

        if (usageId) {
            fetch(`/product/delete-usage-row/${usageId}/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') }
            });
        }
    }

    // Search & category filter
    function filterTable() {
        const searchValue = searchBox.value.toLowerCase();
        const selectedCat = categoryFilter.value;

        document.querySelectorAll('#raw-data-table tbody tr').forEach(row => {
            const name = row.querySelector('td input').value.toLowerCase();
            const cat = row.querySelector('td select').value;
            row.style.display = (name.includes(searchValue) && (selectedCat === 'all' || cat === selectedCat)) ? '' : 'none';
        });
    }

    searchBox.addEventListener('input', filterTable);
    categoryFilter.addEventListener('change', filterTable);

    // Get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            document.cookie.split(';').forEach(cookie => {
                if (cookie.trim().startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.trim().substring(name.length + 1));
                }
            });
        }
        return cookieValue;
    }

});
