// ===== MENU TOGGLE =====
const menuToggle = document.getElementById('menu-toggle');
menuToggle?.addEventListener('click', () => {
    document.querySelector('.menu')?.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------
    // Elements
    // -----------------------------
    const searchInput = document.getElementById('search-item');
    const table = document.getElementById('all-items-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');

    // -----------------------------
    // Filter table by product name
    // -----------------------------
    const filterTable = () => {
        const filter = searchInput.value.toLowerCase();
        Array.from(tbody.rows).forEach(row => {
            const nameCell = row.cells[1]?.textContent.toLowerCase() || '';
            row.style.display = nameCell.includes(filter) ? '' : 'none';
        });
    };

    searchInput?.addEventListener('input', filterTable);

    // -----------------------------
    // Sort table by column
    // -----------------------------
    const sortTable = (columnIndex, ascending = true) => {
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
            const aText = a.cells[columnIndex]?.textContent.trim().toLowerCase() || '';
            const bText = b.cells[columnIndex]?.textContent.trim().toLowerCase() || '';

            // Numeric comparison if both are numbers
            if (!isNaN(aText) && !isNaN(bText) && aText !== '' && bText !== '') {
                return ascending ? aText - bText : bText - aText;
            }
            return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        rows.forEach(row => tbody.appendChild(row));
    };

    const headers = table.querySelectorAll('th');
    headers[1]?.addEventListener('click', () => sortTable(1, true)); // Product Name
    headers[3]?.addEventListener('click', () => sortTable(3, false)); // Price

    // -----------------------------
    // Highlight row on hover
    // -----------------------------
    Array.from(tbody.rows).forEach(row => {
        row.addEventListener('mouseenter', () => row.classList.add('hover'));
        row.addEventListener('mouseleave', () => row.classList.remove('hover'));
    });
});
