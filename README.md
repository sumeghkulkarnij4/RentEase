# 🏠 RentEase – Furniture & Appliance Rental Platform

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 📖 Overview

**RentEase** is a full-stack MERN application that allows users to rent furniture and home appliances with a seamless online experience. The platform offers secure authentication, product browsing, shopping cart, wishlist, rental management, checkout, and an admin dashboard for managing products and orders.

The application is designed with a modern, responsive UI inspired by premium rental platforms like **Furlenco**, **IKEA**, and **Airbnb**.

---

# ✨ Features

## 👤 User Features

- Secure User Registration & Login (JWT Authentication)
- Profile Management
- Browse Furniture & Appliances
- Search, Filter & Sort Products
- Product Details Page
- Wishlist
- Shopping Cart
- Rental Duration Selection
- Checkout System
- Multiple Payment Methods
- Order History
- Active Rentals
- Responsive Design
- Dark / Light Mode

---

## 🛒 Shopping Features

- Product Categories
- Product Search
- Wishlist
- Add to Cart
- Quantity Management
- Rental Duration
- Order Summary
- Coupon Support
- Delivery Details
- Secure Checkout

---

## 📦 Rental Management

- View Active Rentals
- Rental Timeline
- Order Tracking
- Rental History
- Delivery Information
- Invoice Support

---

## 👨‍💼 Admin Features

- Admin Login
- Dashboard Analytics
- Product Management
- Add Products
- Edit Products
- Delete Products
- Order Management
- User Management
- Revenue Statistics

---

# 🛠 Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- CSS3
- Context API

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT
- bcrypt

### Image Storage

- Cloudinary

### Payment

- Razorpay

---

# 📂 Folder Structure

```text
RentEase
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   └── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   ├── uploads
│   └── server.js
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/sumeghkulkarnij4/RentEase.git
```

```bash
cd RentEase
```

---

## Install Frontend

```bash
cd client
npm install
```

---

## Install Backend

```bash
cd ../server
npm install
```

---

# ▶ Running the Project

## Backend

```bash
cd server
npm start
```

or

```bash
npm run dev
```

---

## Frontend

```bash
cd client
npm run dev
```

---

# 🌐 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret
```

---

# 📸 Screenshots

## 🏠 Home

![Home](screenshots/home.png)

---

## 📦 Products

> Add screenshot here

---

## 🛒 Cart

> Add screenshot here

---

## 💳 Checkout

> Add screenshot here

---

## 📦 Orders

> Add screenshot here

---

## 👨‍💼 Admin Dashboard

> Add screenshot here

---

# 🎯 Future Improvements

- Email Notifications
- Product Reviews & Ratings
- AI Product Recommendations
- Chat Support
- PWA Support
- Multi-language Support
- Advanced Analytics
- Inventory Forecasting

---

# 👨‍💻 Author

**Sumegh Kulkarni**

- GitHub: https://github.com/sumeghkulkarnij4
- LinkedIn: *(Add your LinkedIn profile here)*

---

# 🙏 Acknowledgements

Inspired by:

- Furlenco
- IKEA
- Airbnb
- Pepperfry
- React.js
- Node.js
- MongoDB

---

# ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

---

## 📜 License

This project is licensed under the **MIT License**.
