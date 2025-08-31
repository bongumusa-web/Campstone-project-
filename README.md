
#  Ztkings POS System

A **web-based Point of Sale (POS) and Inventory Management System** built with **Django** and **Django REST Framework**, designed for managing **sales, products, and suppliers** with real-time analytics.

---

##  Features

### 👥 User Management

* Superuser login & dashboard
* Cashier registration & login
* Role-based access control

###  Point of Sale (Cashier)

* Product selection with stock validation
* Real-time receipt generation
* Cash & card payments (with VAT & change calculation)
* Cancel & complete sales

###  Product & Supplier Management

* Add, edit, delete products
* Manage stock levels
* Add suppliers & supplier products
* Search & filter products

###  Dashboard & Analytics (Admin)

* Total sales, total stock, stock alerts
* Top-selling products (Pie chart)
* Daily sales (Bar chart)
* Recent sales table
* Interactive analytics with **Chart.js**

---

##  Tech Stack

* **Backend:** Python, Django, Django REST Framework
* **Frontend:** HTML, CSS, JavaScript
* **Charts & Icons:** Chart.js, Font Awesome
* **Database:** SQLite (default) / Django ORM

---

## Installation & Setup

Clone the repository:

```bash
git clone <repo_url>
cd pos
```

Create & activate a virtual environment:

```bash
# Linux/Mac
python -m venv env
source env/bin/activate  

# Windows
env\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

Run the server:

```bash
python manage.py runserver
```

Access the app at:
👉 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

##  Authentication & User Flow

* **Admin Login:** `/admin-login/` → Redirects to **Dashboard**
* **Cashier Login:** `/login/` → Redirects to **Point of Sale**
* **Register Staff:** `/register/`
* **Logout:** `/logout/`

---

##  API Endpoints

### Supplier APIs

```json
{
  "suppliers": "http://127.0.0.1:8000/suppliers/api/suppliers/",
  "supplier-products": "http://127.0.0.1:8000/suppliers/api/supplier-products/",
  "categories": "http://127.0.0.1:8000/suppliers/api/categories/"
}
```

###  Product APIs

```json
{
  "products": "http://127.0.0.1:8000/products/api/products/",
  "categories": "http://127.0.0.1:8000/products/api/categories/"
}
```

### 💳 POS APIs

```json
{
  "sales": "http://127.0.0.1:8000/api/pos/sales/"
}
```

### 🔐 Authentication Routes

```
/setup/               → initial setup
/login/               → cashier login
/admin-login/         → admin login
/dashboard/           → admin dashboard
/pos/                 → cashier POS
/logout/              → log out
/register/            → register users
/products/            → product app
/suppliers/           → supplier app
/api/pos/             → POS app API
```

---

##  Dashboard Preview

✔️ Bar chart for daily sales
✔️ Pie chart for top-selling products
✔️ KPIs for total sales, stock, and alerts
✔️ Table for recent sales

*(You can add screenshots here for more appeal)*

---

## 📄 Documentation

For detailed system design, database schema, and extended API usage examples:

[📘 View Full Documentation on Google Docs](https://docs.google.com/document/d/1qnreRTBMn6BPtO4U4MOZqOW2M2toNhR46DgxaTCypt4/edit?usp=sharing)

---

## ✅ Roadmap / Next Steps

* [ ] Add PDF receipt generation
* [ ] Integrate with external payment gateways
* [ ] Multi-branch support
* [ ] Dockerize for deployment

---

## 👨‍💻 Author

**Ztkings**
💼 Django Developer | 💡 POS & Inventory Systems

---


