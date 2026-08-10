# 🍕 Pizza Delivery Full-Stack Application

A production-style, full-stack pizza ordering and inventory management platform built as part of the Oasis Infobyte Summer Internship Program (Web Development & Designing — Level 3).

## 📋 Overview

This application allows users to browse a pizza menu, build custom pizzas, place orders, make payments via Razorpay, and track their orders in real-time. Admins have a dedicated dashboard to manage pizzas, orders, inventory, and users, with automated low-stock email alerts.

## 🛠️ Tech Stack

**Frontend:** React, Vite, React Router, Axios, Tailwind CSS, React Hook Form  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Nodemailer, Cloudinary, Multer  
**Payment:** Razorpay (Test Mode)  
**Real-time:** Socket.io  
**Database:** MongoDB Atlas  
**Deployment:** Frontend on Vercel, Backend on Render

## ✨ Features

### User
- Registration with email verification
- Login/Logout with JWT authentication
- Forgot/Reset password
- Browse pizza menu with category filters
- Custom pizza builder (base, sauce, cheese, veggies)
- Cart management
- Checkout with delivery address
- Razorpay payment integration
- Real-time order status tracking (Socket.io)
- Order history
- Profile management

### Admin
- Separate admin login
- Dashboard with analytics (orders, revenue, users)
- Pizza CRUD (with Cloudinary image upload)
- Order management (status updates)
- Inventory management with low-stock email alerts
- User management

## 🚀 Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```



## 🔗 Live Links

- Frontend: [Deployed link here]
- Backend API: [Deployed link here]

