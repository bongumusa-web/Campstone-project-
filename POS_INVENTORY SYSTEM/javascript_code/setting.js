// ===== Password Form =====
document.getElementById("password-form").addEventListener("submit", function(e){
  e.preventDefault();
  const newPass = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;
  if(newPass !== confirm){
    alert("New password and confirm password do not match!");
    return;
  }
  alert("Password saved successfully!");
  this.reset();
});

// ===== Theme Form =====
document.getElementById("theme-form").addEventListener("submit", function(e){
  e.preventDefault();
  const theme = document.getElementById("theme").value;
  alert("Theme saved: " + theme);
});

// ===== Currency Form =====
document.getElementById("currency-form").addEventListener("submit", function(e){
  e.preventDefault();
  const currency = document.getElementById("currency").value;
  alert("Currency saved: " + currency);
});

// ===== Language Form =====
document.getElementById("language-form").addEventListener("submit", function(e){
  e.preventDefault();
  const lang = document.getElementById("language").value;
  alert("Language saved: " + lang);
});

// ===== Low Stock Alert =====
document.getElementById("lowstock-form").addEventListener("submit", function(e){
  e.preventDefault();
  const checked = document.getElementById("low-stock-alert").checked;
  alert("Low Stock Alert " + (checked ? "Enabled" : "Disabled"));
});
