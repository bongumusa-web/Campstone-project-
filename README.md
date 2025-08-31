Ztkings POS System

A web-based Point of Sale (POS) + invetory system built with Django for inventory, sales, and supplier management.

Features
User Management

Superuser login & dashboard

Staff registration & login

Role-based access control

Point of Sale (Cashier)

Product selection with stock validation

Real-time receipt generation

Cash & card payments with VAT calculation

Cancel & complete sales

Product & Supplier Management

Add, edit, delete products

Manage stock levels

Add suppliers and supplier products

Search and filter products

Dashboard & Analytics

Total sales, total stock, low stock alerts, most sold product

Interactive charts using Chart.js

Recent sales table and notifications

Technologies Used

Backend: Python, Django, Django REST Framework

Frontend: HTML, CSS, JavaScript

Charts & Icons: Chart.js, Font Awesome

Database: SQLite (default) / Django ORM

Installation

Clone the repository:

git clone <repo_url>
cd pos


Create and activate a virtual environment:

python -m venv env
source env/bin/activate  # Linux/Mac
env\Scripts\activate     # Windows


Install dependencies:

pip install -r requirements.txt


Apply migrations:

python manage.py migrate


Create a superuser:

python manage.py createsuperuser


Run the server:

python manage.py runserver


Access the app at:

http://127.0.0.1:8000/