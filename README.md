# Inventory Management System (IMS)

## 🚀 Project Overview
The Inventory Management System (IMS) is a web-based application designed to help businesses manage inventory efficiently.  
The system allows users to add, update, and track products, suppliers, categories, stock in/out, and generate inventory reports.  
To enhance usability, the system also includes a **chatbot** that allows users to interact with the system using natural language.

---

## ✅ Main Features

### 🔹 Dashboard
- Shows total products, stock status, and low stock alerts.
- Provides a quick summary of inventory activities.

### 🔹 Product Management
- Add, edit, and delete products.
- Each product includes:
  - Name
  - SKU (Product Code)
  - Category
  - Supplier
  - Purchase Price
  - Selling Price
  - Quantity

### 🔹 Stock In
- Add incoming stock to the inventory.
- Automatically updates product quantity.
- Records supplier and date.

### 🔹 Stock Out
- Manage stock when products are sold or used.
- Automatically reduces product quantity.
- Records date and reason.

### 🔹 Category Management
- Add, edit, and delete product categories.

### 🔹 Supplier Management
- Manage supplier details:
  - Name
  - Contact
  - Email
  - Address

### 🔹 Search & Filter
- Search products by name, category, or supplier.
- Filter products based on stock level and date range.

### 🔹 Reports
- Stock report
- Stock in/out report
- Low stock report
- Supplier-wise report

---

## ⭐ Chatbot Feature (Added to Improve UX)

The chatbot helps users perform inventory tasks using text commands.  
It provides quick answers and supports the following:

- Check product stock  
  Example: “How many iPhones are available?”

- Low stock alert  
  Example: “Show low stock products”

- Add stock using chat  
  Example: “Add 20 units of Product A”

- Generate reports  
  Example: “Show stock report for this month”

- Supplier details  
  Example: “Show details of Supplier X”

---

## 🧱 Technology Stack

### Backend
- Django
- Django REST Framework (DRF)

### Frontend
- React.js

### Database
- SQLite / PostgreSQL (optional)

---

## 🛠 Installation & Setup

### ⚙️ Backend Setup (Django)

    ```bash
    # Clone the project
    git clone <your-repo-url>
    cd backend
    
    # Create virtual environment
    python -m venv venv
    source venv/bin/activate   # for Windows use: venv\Scripts\activate
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Apply migrations
    python manage.py migrate
    
    # Run server
    python manage.py runserver
# ⚙️ Frontend Setup (React)
    ```
    cd frontend

    # Install dependencies
    npm install
    
    # Run React app
    npm start
# 📁 Project Structure
    ```
    inventory-management-system/
    ├── backend/
    │   ├── manage.py
    │   ├── requirements.txt
    │   ├── inventory_app/
    │   │   ├── models.py
    │   │   ├── views.py
    │   │   ├── serializers.py
    │   │   ├── urls.py
    │   │   └── ...
    │   └── ...
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── ...
    │   └── ...
    └── README.md


# 📸 Screenshots:
![Dashboard](assest/dashboard.png)
![Dashboard](assest/billinghistory.png)
![Dashboard](assest/Billing.png)
![Dashboard](assest/report.png)

# 🚧 Project Status

* Status: Ongoing
* This project is continuously being improved with new features and enhancements.

# 🔮 Future Enhancements

* Barcode Scanner Integration

* Expiry Date Tracking

* Multi-warehouse support

* AI-based chatbot using OpenAI
