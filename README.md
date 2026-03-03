  Revenue Tracker System
 Smart Business Financial Management



 📋 Project Overview
A web-based application that helps small businesses manage products, track sales, monitor expenses, and calculate profit/loss in real-time.



🎯 Problem Statement
Small businesses struggle with:
- ❌ Manual bookkeeping errors
- ❌ Disorganized records  
- ❌ Poor inventory tracking
- ❌ Inaccurate profit calculations
- ❌ No real-time insights



 ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Secure JWT-based login/registration |
| **📦 Products** | Add, edit, delete, and track inventory |
| **💰 Sales** | Record sales with auto stock update |
| **📝 Expenses** | Track business expenses |
| **🔍 View Records** | Search & filter all data |
| **📊 Profit & Loss** | Auto-calculated with monthly filters |
| **📱 Dashboard** | Quick stats and activity overview |



 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript, Font Awesome |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Auth** | JWT, bcrypt |
| **Version Control** | Git, GitHub |

---

📁 Database Schema

4 Tables: `users`, `products`, `sales`, `expenses`

**Relationships:**
- `users` ←→ `products` (one-to-many)
- `users` ←→ `sales` (one-to-many)
- `users` ←→ `expenses` (one-to-many)
- `products` ←→ `sales` (one-to-many)

Foreign keys maintain data integrity with `ON DELETE CASCADE`.

---

 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/sales` | Get all sales |
| POST | `/api/sales` | Record sale |
| PUT | `/api/sales/:id` | Update sale |
| DELETE | `/api/sales/:id` | Delete sale |
| GET | `/api/expenses` | Get expenses |
| POST | `/api/expenses` | Add expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/profit-loss` | Get financial summary |

---

 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/haniyyaahmad06-hub/Revenue-System.git

# Install dependencies
npm install

# Setup database (MySQL)
# Run SQL scripts from database folder

# Configure environment
# Create .env file with:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=revenue_tracker
# JWT_SECRET=your_secret_key
# PORT=3000

# Start server
npm start

# Open browser
# http://localhost:3000
```

---

📸 Pages Included
- Landing Page
- Dashboard
- Products Management
- Sales Recording
- Expenses Tracking
- View Records (Search)
- Profit & Loss Statement

---



