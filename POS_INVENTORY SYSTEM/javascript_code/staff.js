let staffList = [];
let roles = [];

// Elements
const staffName = document.getElementById("staff-name");
const staffEmail = document.getElementById("staff-email");
const staffRoleInput = document.getElementById("staff-role-input");
const staffSalary = document.getElementById("staff-salary");
const addStaffBtn = document.getElementById("add-staff-btn");
const staffTableBody = document.getElementById("staff-table-body");
const filterRoleSelect = document.getElementById("filter-role");
const searchInput = document.getElementById("search-staff");

// Add Staff
addStaffBtn.addEventListener("click", function(){
  const name = staffName.value.trim();
  const email = staffEmail.value.trim();
  const role = staffRoleInput.value.trim();
  const salary = staffSalary.value.trim();

  if(!name || !email || !role) return alert("Please fill in Name, Email, and Role");

  const staff = { name, email, role, salary };
  staffList.push(staff);

  // Add new role to filter if not exists
  if(!roles.includes(role)){
    roles.push(role);
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    filterRoleSelect.appendChild(option);
  }

  renderStaffTable();
  // Reset inputs
  staffName.value = "";
  staffEmail.value = "";
  staffRoleInput.value = "";
  staffSalary.value = "";
});

// Render Table
function renderStaffTable(){
  staffTableBody.innerHTML = "";
  const search = searchInput.value.toLowerCase();
  const filterRole = filterRoleSelect.value;

  staffList
    .filter(staff => staff.name.toLowerCase().includes(search) && (filterRole === "" || staff.role === filterRole))
    .forEach((staff, index) => {
      staffTableBody.innerHTML += `
        <tr>
          <td>${staff.name}</td>
          <td>${staff.email}</td>
          <td>${staff.role}</td>
          <td>${staff.salary}</td>
          <td><button onclick="deleteStaff(${index})">Delete</button></td>
        </tr>
      `;
    });
}

// Delete Staff
function deleteStaff(index){
  const removed = staffList.splice(index,1)[0];

  // If the removed role no longer exists, remove from roles/filter
  if(!staffList.some(s => s.role === removed.role)){
    roles = roles.filter(r => r !== removed.role);
    Array.from(filterRoleSelect.options).forEach(option => {
      if(option.value === removed.role) option.remove();
    });
  }

  renderStaffTable();
}

// Search & Filter
searchInput.addEventListener("input", renderStaffTable);
filterRoleSelect.addEventListener("change", renderStaffTable);
