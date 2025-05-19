# Laravel API – Sanctum Authentication + Custom Role Management

This is the backend API built with **Laravel 12+** using **Laravel Sanctum** for authentication and a **custom-built user role system** (without external packages).

---

## ⚙️ Technologies

- Laravel 12+
- Sanctum (API authentication)
- MySQL
- Custom Role Management (without packages)

---

## 🚀 Getting Started

### 📥 Clone the Repository

```bash
git clone https://github.com/aazankp/react-laravel-fullstack-crud.git
cd backend


# Install PHP dependencies
composer install

# Copy the .env file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in the .env file

# Run migrations
php artisan migrate

# Seed roles and sample data
php artisan db:seed

# Serve the API
php artisan serve --host=127.0.0.1 --port=8000


# React.js Frontend – Laravel Sanctum + CRUD + Custom Roles

This is the frontend for the Laravel API, built with **React.js** and styled using **Tailwind CSS**. It includes **login/registration** with **Sanctum**, full **CRUD operations**, **custom role management**, a **dynamic table**, **confirmation modal**, and **light/dark mode** support.

---

## ⚙️ Technologies Used

- **React.js**
- **Tailwind CSS**
- **Axios** for API communication
- **Laravel Sanctum** integration
- **React Context API** or **Redux** for global state
- **Custom Role Management** (no external packages like Spatie)

---



### 📥 Clone & Setup Front-End

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev