# Point of Sale + Inventory System

**By:** Bongumusa Gumede  

---

## Project Layout

### 🛒 Point of Sale (POS)
- **Header / Menu Sidebar**
- **Products by Category**: Displayed as  
  - Image (top)  
  - Product Name  
  - Product Price  
- **Cart**: For purchased products  
  - Slip (receipt preview)  
  - Quantity input  
  - Add button  
  - Cancel button  
  - Complete button  
- **Payment Section**  
  - Calculator  
  - Payment gateway buttons: **Cash**, **FET**, **Card**  
  - Receipt options: **Print** & **Email**  

---

### 📊 Dashboard
- **Menu Sidebar**
- **Right Section**  
  - Total Sales  
  - Total Stock  
  - Low Stock Alerts  
  - Most Sold Product  
- **Charts**  
  - Bar Graph: Sales (Weekly, Monthly, Yearly)  
  - Pie Chart: Top Products  
- **Bottom Section**  
  - Recent Sales (Date, Cashier, Total)  
  - Notifications  

---

### 📦 Product Management
- **Sidebar Menu**
- **Product List**
  - Search with category filter  
  - Table:
    - Name  
    - Category  
    - Price  
    - Stock  
    - Image/Image Link  
    - Actions (**Add / Delete**)  

---

### 🚚 Supplier Management
- **Similar to Product**, but with different table fields:  
  - Name  
  - Category  
  - Contact  
  - Email  
  - Actions (**Add / Delete**)  

---

### 👥 Staff Management
- **Similar to Product**, but with different table fields:  
  - Name  
  - Email  
  - Role  
  - Salary  
  - Actions (**Add / Delete**)  

---

### ⚙️ Settings
- Change Password  
- Default Currency / Change Currency  
- Change Language  
- Low Stock Alert Settings (separate section, each with its own Save button)  

---

### 🔑 Authentication
- **Login Page**: Select user role (Admin / Employee).  
- If **Admin (Superuser)** → Redirect to **Dashboard**.  
- If **Employee (Cashier)** → Redirect to **POS**.  

---

### 🛂 Permissions
- **Employee (Cashier)**  
  - Can **only** access POS  
  - Cannot access Dashboard, Products, Suppliers, or Settings  
  - Can **Logout** (redirected back to Login page)  

- **Admin (Superuser)**  
  - Has access to **all sections**  

---

## ✅ Features

### POS
- Print and Email receipts  
- Select products by category  

### Dashboard
- Bar Graph: Sales over Week, Month, Year  
- Pie Chart: Most sold products  
- Recent Sales Table: Shows Date, Cashier, Total  

### Product / Supplier / Staff
- Full **CRUD** functionality  

### Settings
- Manage system preferences (passwords, currency, language, alerts)  

---

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Django + Django REST Framework  
- **Other**:  
  - Internationalization (languages, currency)  
  - Email support (for receipts)  
  - Print support (receipts)  

---

## 📸 Screenshots

Here are some previews of the system (replace with your actual images later):

### 🔑 Login Page  
![Login Page]()

### 🛒 POS Screen  
![POS](images/pos.png)

### 📊 Dashboard  
![Dashboard](images)

### 📦 Products Page  
![Products](images/products.png)

### 🚚 Suppliers Page  
![Suppliers](images/suppliers.png)

### 👥 Staff Page  
![Staff](images/staff.png)

### ⚙️ Settings  
![Settings](images/settings.png)

---

## 🚀 Setup & Run
1. Clone this repo:  
   ```bash
   git clone https://github.com/yourusername/point-of-sale-inventory.git
   cd point-of-sale-inventory
