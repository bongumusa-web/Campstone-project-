

const SUPPLIER_API = "/suppliers/api/suppliers/"; // returns suppliers with supplier_products nested
const tableBody = document.getElementById("suppliers-table-body");
const searchInput = document.getElementById("search-product");
const searchBtn = document.getElementById("search-btn");

// Utility: create a safe text cell
function td(text = "") {
  return `<td>${text !== null && text !== undefined ? String(text) : ''}</td>`;
}

function createRow(supplier, sp) {
  // sp may be null (supplier without products) -> show dashes
  const productName = sp ? sp.product_name : "-";
  const category = sp ? sp.category_type : "-";
  const cost = sp ? sp.cost_price : "-";
  const qty = sp ? sp.quantity_purchased : "-";
  const total = (sp && sp.cost_price != null && sp.quantity_purchased != null)
    ? (parseFloat(sp.cost_price) * parseInt(sp.quantity_purchased || 0)).toFixed(2)
    : "-";

  return `<tr data-supplier-id="${supplier.id}" data-sp-id="${sp ? sp.id : ''}">
    ${td(supplier.name)}
    ${td(supplier.contact_number || '')}
    ${td(supplier.email || '')}
    ${td(supplier.address || '')}
    ${td(productName)}
    ${td(category)}
    ${td(cost)}
    ${td(qty)}
    ${td(total)}
  </tr>`;
}

async function fetchAndRender(productFilter = "") {
  try {
    const res = await fetch(SUPPLIER_API);
    if (!res.ok) {
      console.error("Failed to fetch suppliers:", res.status, res.statusText);
      tableBody.innerHTML = `<tr><td colspan="9">Failed to load data.</td></tr>`;
      return;
    }
    const suppliers = await res.json();

    const filter = (productFilter || "").trim().toLowerCase();
    let html = "";

    suppliers.forEach(supplier => {
      // If supplier has products, render each product as a separate row
      if (Array.isArray(supplier.supplier_products) && supplier.supplier_products.length) {
        supplier.supplier_products.forEach(sp => {
          // filter by product name if provided
          const pname = (sp.product_name || "").toString().toLowerCase();
          if (!filter || pname.includes(filter)) {
            html += createRow(supplier, sp);
          }
        });
      } else {
        // supplier without products -> show a row (product fields empty)
        if (!filter) { // only show supplier-only rows when no product filter applied
          html += createRow(supplier, null);
        }
      }
    });

    if (!html) {
      tableBody.innerHTML = `<tr><td colspan="9">No matching products / suppliers found.</td></tr>`;
    } else {
      tableBody.innerHTML = html;
    }
  } catch (err) {
    console.error("Error loading suppliers:", err);
    tableBody.innerHTML = `<tr><td colspan="9">Error loading data.</td></tr>`;
  }
}

// events
searchBtn.addEventListener("click", () => fetchAndRender(searchInput.value));
searchInput.addEventListener("keyup", (e) => { if (e.key === "Enter") fetchAndRender(searchInput.value); });

// initial load
fetchAndRender();
