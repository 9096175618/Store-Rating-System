# ⭐ Store Rating System

A full-stack web application developed as part of the **FullStack Intern Coding Challenge**.

The application allows users to view registered stores and submit ratings from **1 to 5**. The system provides different functionality based on three user roles: **System Administrator, Normal User, and Store Owner**.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Node.js
* Express.js
* REST API

### Database

* MySQL

### Authentication & Security

* JWT Authentication
* bcrypt.js for password hashing
* Role-based access control

---

## 👥 User Roles

The application supports three different roles:

1. **System Administrator**
2. **Normal User**
3. **Store Owner**

Each role has different permissions and dashboard functionality.

---

## 👑 System Administrator

The System Administrator can:

* Add new stores
* Add new normal users
* Add new administrator users
* Access the administrator dashboard
* View total number of users
* View total number of stores
* View total number of submitted ratings
* View all registered stores
* View store name, email, address, and rating
* View normal users and administrators
* View user name, email, address, and role
* Search and filter users/stores by Name, Email, Address, and Role
* View complete details of users
* View store owner's rating information
* Log out from the system

---

## 👤 Normal User

Normal users can:

* Sign up on the platform
* Log in to the platform
* Update their password after logging in
* View a list of all registered stores
* Search stores by Name
* Search stores by Address
* View store information
* View overall store rating
* View their submitted rating
* Submit a rating from 1 to 5
* Modify their previously submitted rating
* Log out from the system

### Store Information

Each store listing displays:

* Store Name
* Address
* Overall Rating
* User's Submitted Rating
* Option to Submit a Rating
* Option to Modify Submitted Rating

---

## 🏪 Store Owner

Store Owners can:

* Log in to the platform
* Update their password after logging in
* Access the Store Owner Dashboard
* View a list of users who have submitted ratings for their store
* View the average rating of their store
* Log out from the system

---

## ⭐ Rating System

Users can submit ratings for individual stores using a rating from **1 to 5**.

| Rating  | Description |
| ------- | ----------- |
| ⭐ 1     | Very Poor   |
| ⭐⭐ 2    | Poor        |
| ⭐⭐⭐ 3   | Average     |
| ⭐⭐⭐⭐ 4  | Good        |
| ⭐⭐⭐⭐⭐ 5 | Excellent   |

Users can modify their previously submitted rating.

The system calculates and displays the store's overall rating.

---

## 🔐 Form Validations

The application follows the validation requirements provided in the coding challenge.

### Name

* Minimum: 20 characters
* Maximum: 60 characters

### Address

* Maximum: 400 characters

### Password

* Minimum: 8 characters
* Maximum: 16 characters
* Must contain at least one uppercase letter
* Must contain at least one special character

Example:

```text
Owner@1234
```

### Email

* Must follow standard email validation rules.

---

## 🗄️ Database

The application uses **MySQL** as the database.

The database contains information related to:

* Users
* Stores
* Ratings

### Users

Stores:

* User ID
* Name
* Email
* Password
* Address
* Role

### Stores

Stores:

* Store ID
* Store Name
* Email
* Address
* Store Owner

### Ratings

Stores:

* Rating ID
* User ID
* Store ID
* Rating
* Created Date/Time
* Updated Date/Time

---

## 📊 Application Flow

```text
                    Store Rating System
                           │
          ┌────────────────┼────────────────┐
          │                │                │
        Admin             User             Owner
          │                │                │
     Manage Users      View Stores      View Store
     Manage Stores     Submit Rating    Ratings
     View Ratings      Update Rating    Average Rating
          │                │                │
          └────────────────┼────────────────┘
                           │
                       MySQL Database
```

---

## 📁 Project Structure

The project is organized into separate frontend and backend sections.

```text
Store-Rating-System/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── AdminDashboard.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── Auth.css
│   │   ├── index.css
│   │   ├── Login.jsx
│   │   ├── main.jsx
│   │   ├── OwnerDashboard.css
│   │   ├── OwnerDashboard.jsx
│   │   ├── Register.jsx
│   │   ├── StoreManagement.jsx
│   │   ├── UserDashboard.css
│   │   └── UserDashboard.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── ratings.js
│   │   ├── stores.js
│   │   └── users.js
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ▶️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/9096175618/Store-Rating-System.git
cd Store-Rating-System
```

---

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE store_rating_db;
```

Select the database:

```sql
USE store_rating_db;
```

Configure the required tables:

```text
users
stores
ratings
```

Make sure MySQL is running before starting the backend.

---

### 3. Start Backend

Open a terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

---

### 4. Start Frontend

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

Usually:

```text
http://localhost:5173
```

---

## 🔑 Role-Based Access

The application uses role-based authorization.

```text
ADMIN
  ↓
Admin Dashboard
  ↓
Users + Stores + Ratings


OWNER
  ↓
Owner Dashboard
  ↓
My Store + Customer Ratings


USER
  ↓
User Dashboard
  ↓
Stores + Submit/Update Rating
```

---

## 🔒 Security

The application includes:

* Password hashing using bcrypt.js
* JWT-based authentication
* Protected API routes
* Role-based authorization
* User input validation
* Environment variables for sensitive configuration

> **Important:** Never upload your real `.env` file, database password, JWT secret, or other sensitive credentials to GitHub.

---

## 📋 Additional Requirements

The project follows the additional requirements provided in the coding challenge:

* Tables support sorting in ascending/descending order where applicable
* Search and filtering are provided where required
* Frontend and backend follow structured development practices
* Database uses relational tables
* Authentication and authorization are implemented
* Role-based functionality is provided
* Store ratings are maintained in the database
* Users can modify their submitted ratings
* Rating values are restricted to 1–5

---

## 🎯 Project Objective

The objective of this project is to build a secure and user-friendly **Store Rating System** where:

* **Administrators** manage users, stores, and platform data.
* **Normal Users** can discover stores and submit ratings.
* **Store Owners** can view ratings submitted for their stores and monitor the average rating.
* **Ratings** are securely stored and managed using MySQL.

---

## 👨‍💻 Project Information

**Project:** Store Rating System
**Type:** Full-Stack Web Application
**Frontend:** React.js
**Backend:** Node.js + Express.js
**Database:** MySQL
**Authentication:** JWT + bcrypt.js

---

## ⭐ GitHub Repository

https://github.com/9096175618/Store-Rating-System
