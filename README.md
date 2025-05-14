# Laravel Sanctum + React.js CRUD

This is a full-stack web application built using **Laravel** with **Sanctum authentication** and **React.js** as the frontend framework. It includes features like login, registration, and full CRUD operations.

---

## ⚙️ Technologies Used

- **Backend:** Laravel 12+ (Laravel Sanctum with token-based authentication)
- **Frontend:** React.js (Tailwind CSS)
- **Authentication:** Laravel Sanctum
- **HTTP Requests:** Axios

---

## 🚀 Getting Started

Follow the steps below to set up the project locally.

---

### 📥 Clone the Repository

---

# Backend Setup

cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database credentials in .env
# Then run migrations if needed
php artisan migrate

# Run the Laravel development server
php artisan serve --host=127.0.0.1 --port=8000


---

# Frontend Setup

cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database credentials in .env
# Then run migrations if needed
php artisan migrate

# Run the Laravel development server
php artisan serve --host=127.0.0.1 --port=8000
