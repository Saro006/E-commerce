# SK Mart

A simplified e-commerce app with Django REST API and React frontend.

## Features
- **Authentication**: JWT-based login/signup with auto-logout on 401
- **Products & Categories**: Admin/owner can manage, others can view
- **Shopping Cart**: Add/update/remove items with real-time updates
- **Orders**: Place orders with confirmation emails (Celery tasks)
- **Admin Panel**: Product and order management interface
- **User Profiles**: Profile pages and order history for all users
-- **User Profiles**: Profile page (read-only details) + order history
-- **Account Settings**: Dedicated page to update username and email
- **Payment Options**: UI for Cash on Delivery and Online Payment
- **Responsive Design**: Polished Tailwind CSS UI with animations
- **Docker Ready**: Complete containerization with PostgreSQL
- **Auto Seeding**: Default users, categories, and products on startup

## Tech Stack
- **Backend**: Django 4.2 + DRF + SimpleJWT + PostgreSQL + Celery + Redis
- **Frontend**: React 19 + Vite + Tailwind CSS + React Router
- **Database**: PostgreSQL (Docker) / SQLite (local dev)
- **Tasks**: Celery with Redis broker
- **Containerization**: Docker + Docker Compose + Nginx

## Quick Start (Docker - Recommended)

### Prerequisites
- Docker + Docker Compose (or Podman + Podman Compose)

### One Command Setup
```bash
docker compose up --build
```

**Access Points:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/swagger
- **Admin Panel**: http://localhost:8000/admin
- **PostgreSQL**: localhost:5432 (user: postgres, password: postgres, db: postgres)

**Default Accounts (Auto-created):**
- **Admin**: `admin` / `admin` (email: admin@gmail.com)
- **User**: `user` / `user` (email: user@example.com)

**Sample Data:**
- Categories: Electronics, Clothing, Books
- Products: Smartphone, Laptop, T-Shirt, Jeans, Programming Book

## Local Development (No Docker)

### Backend Setup
```bash
cd Backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Use SQLite for local development
export DB_ENGINE=django.db.backends.sqlite3
export DB_NAME=db.sqlite3
python manage.py migrate
python manage.py seed_data  # Create default users and sample data
python manage.py runserver
```
API available at http://localhost:8000/api

### Frontend Setup
```bash
cd Dashboard
npm install
npm run dev
```
App available at http://localhost:5173

### Environment Variables
Copy `.env.example` to `.env` at repo root for custom overrides. Docker Compose uses sensible defaults.

## API Documentation

### Authentication (JWT)
- **Login**: `POST /api/auth/jwt/create/` `{ username, password }`
- **Refresh**: `POST /api/auth/jwt/refresh/` `{ refresh }`
- **Me (read)**: `GET /api/auth/me/` (Authorization: Bearer <access>)
- **Me (update)**: `PATCH /api/auth/me/` `{ username?, email? }` (auth required)
- **Register**: `POST /api/auth/register/` `{ username, email, password }`

### Key Endpoints
- **Products**: `/api/products/` (list/create), `/api/products/:id/`
- **Categories**: `/api/categories/`
- **Cart**: `/api/cart/`, `/api/cart/add/`, `/api/cart/update/`, `/api/cart/remove/`
- **Orders**: `/api/orders/` (list/create), `/api/orders/:id/`

## 📧 Real-Time Email Confirmation

The app sends beautiful HTML email confirmations when orders are placed. 

### Quick Setup for Real Emails

1. **Copy environment template**:
   ```bash
   cp env.example .env
   ```

2. **Configure Gmail (recommended for testing)**:
   - Enable 2-Factor Authentication on Gmail
   - Generate App Password (Security → 2-Step Verification → App passwords)
   - Update `.env` file:
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=true
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-16-char-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   ```

3. **Update docker-compose.yml** to use .env:
   ```yaml
   backend:
     env_file:
       - .env
   worker:
     env_file:
       - .env
   ```

4. **Restart containers**:
   ```bash
   docker compose down && docker compose up --build
   ```

### Test Email Functionality

1. **Login** as `user` / `user`
2. **Add products** to cart and place an order
3. **Check your email** for the beautiful confirmation!

### Email Features

- **Professional HTML Design** with SK Mart branding
- **Order Details**: Order number (SK-0001), date, status
- **Itemized List**: Product names, quantities, prices
- **Responsive Design**: Works on all devices
- **Fallback Text Version**: For all email clients

### Monitor Email Sending

```bash
# Check worker logs
docker compose logs -f worker

# Check backend logs
docker compose logs -f backend

# Manual test
docker compose exec backend python manage.py shell
# In shell: from api.tasks import send_order_confirmation_email; send_order_confirmation_email.delay(1, "test@example.com")
```

### 📚 Detailed Email Setup

For comprehensive email configuration including other providers (SendGrid, Mailgun, AWS SES), see [EMAIL_SETUP.md](EMAIL_SETUP.md).

## Account & Profile

- **Profile page** (`/profile`):
  - Shows username, email, member-since, quick actions
  - Read-only account details (no inline editing)
- **Account Settings** (`/settings`):
  - Update `username` and `email`
  - Backend validates uniqueness and persists changes

If you don’t see the Account Settings form in Docker, rebuild the frontend:
```bash
docker compose build frontend && docker compose up -d frontend
```

## Testing

### Run Unit Tests
```bash
# In Docker
docker compose exec backend python manage.py test

# Locally
cd Backend
python manage.py test
```

### Test Coverage
- User registration and authentication
- Product CRUD operations
- Cart functionality
- Order placement and history
- Admin permissions

## Development Notes

- **Frontend**: Served by Nginx in Docker, Vite dev server locally
- **Auto-logout**: Enabled on 401 responses
- **Database**: PostgreSQL in Docker, SQLite for local development
- **Seeding**: Automatic on container startup via `entrypoint.sh`
- **CORS**: Configured for development (allows all origins)

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8000, 5173, 5432 are available
2. **Database connection**: Check if PostgreSQL container is running
3. **Celery tasks**: Verify Redis container and worker are running
4. **Frontend routing**: Nginx configured for SPA routing
5. **CORS errors**: Backend configured to allow all origins in development

