# KaryaHub – Employee Management System

KaryaHub is a full-stack Employee Management System built using the MERN stack. It enables organizations to efficiently manage employees, departments, attendance, leave requests, reports, notifications, and user roles through a modern and responsive web application.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT Authentication
- Secure Login
- Protected Routes
- Role-Based Access Control (Admin, HR, Employee)

### 📊 Dashboard
- Employee Statistics
- Attendance Overview
- Leave Summary
- Dashboard Charts
- Recent Activities

### 👥 Employee Management
- Add Employee
- Edit Employee
- Delete Employee
- View Employee Details
- Employee Search
- Pagination

### 🏢 Department Management
- Create Department
- Update Department
- Delete Department
- Department-wise Employee Management

### 📅 Attendance Management
- Mark Attendance
- Edit Attendance
- Attendance Calendar
- Attendance Statistics
- Attendance History
- Search & Filters

### 🌴 Leave Management
- Apply Leave
- View Leave Requests
- Approve / Reject Leave
- Leave History
- Leave Status Tracking

### 📈 Reports
- Employee Reports
- Attendance Reports
- Leave Reports
- CSV Export
- Report Filters

### 🔔 Notifications
- Real-time Notifications
- Read/Unread Status
- Notification Filters
- Clear Notifications

### 📜 Activity Logs
- Track User Activities
- Audit History
- Search Logs

### 👤 Profile
- View Profile
- Update Personal Information
- Profile Dashboard

### 🎨 UI Features
- Dark / Light Mode
- Responsive Design
- Modern Dashboard
- Mobile Friendly

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router
- Axios
- CSS3

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- JSON Web Token (JWT)
- bcryptjs

---

# 📁 Project Structure

```
KaryaHub
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── seeders
│   ├── config
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── contexts
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/karyahub.git
```

```bash
cd karyahub
```

---

# Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run Frontend

```bash
npm run dev
```

Application runs on

```
http://localhost:5173
```

Backend runs on

```
http://localhost:5000
```

---

# 🔑 Default User Roles

### Admin
- Employee Management
- Department Management
- Attendance
- Leave Approval
- Reports
- Notifications
- Activity Logs

### HR
- Employee Management
- Attendance
- Leave Management
- Reports

### Employee
- Dashboard
- Attendance
- Leave Requests
- Profile
- Notifications

---

# 📦 Main Modules

- Authentication
- Dashboard
- Employees
- Departments
- Attendance
- Attendance Calendar
- Leave Requests
- Reports
- Notifications
- Activity Logs
- Profile

---

# 📤 CSV Export

Supports exporting:

- Employees
- Attendance
- Leave Requests

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcryptjs
- Protected API Routes
- Role-Based Authorization
- Secure REST APIs

---

# 📱 Responsive Design

The application is fully responsive and works on:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# Future Enhancements

- Email Verification
- Payroll Management
- Salary Module
- Performance Reviews
- AI-powered Analytics
- Multi-Company Support

---

# 👨‍💻 Developed By

**Mridul Krishan**

Full Stack MERN Project – KaryaHub Employee Management System

---

# 📄 License

This project is developed for educational and internship purposes.