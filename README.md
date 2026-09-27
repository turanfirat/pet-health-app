# Pet Health Center — Reservation System

A full-stack web application for managing pet health center appointments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · Vite · Tailwind CSS · React Router v6 |
| Backend | Spring Boot 3.2 · Java 21 · Spring Security · JWT |
| Database | MySQL 8 · Hibernate JPA |
| Auth | JWT (JJWT 0.12.5) · BCrypt · Role-based (OWNER / ADMIN) |

## Architecture

See [architecture.drawio](./architecture.drawio) — open with [draw.io](https://app.diagrams.net).

## Features

- **User Auth** — Register / Login with JWT tokens
- **Pet Management** — Add, edit, delete pets (owner-scoped)
- **Appointment Booking** — 4-step wizard: pick pet → vet → service → date/time
- **My Appointments** — View and cancel upcoming bookings
- **Admin Dashboard** — Appointment stats overview
- **Manage Appointments** — Update status (Pending → Confirmed → Completed)
- **Manage Vets** — Full CRUD for veterinarians
- **Manage Services** — Full CRUD for clinic services

## Project Structure

```
pet-health-app/
├── architecture.drawio        ← System architecture diagram
├── backend/                   ← Spring Boot Maven project
│   └── src/main/java/com/pethealth/
│       ├── config/            ← SecurityConfig, DataSeeder
│       ├── controller/        ← REST controllers
│       ├── dto/               ← Request/Response DTOs
│       ├── model/             ← JPA entities
│       ├── repository/        ← Spring Data repositories
│       ├── security/          ← JWT filter, UserDetailsService
│       └── service/           ← Business logic
└── frontend/                  ← React + Vite project
    └── src/
        ├── api/               ← Axios instance with JWT interceptor
        ├── components/        ← Layout, Navbar, Sidebar, ProtectedRoute
        ├── context/           ← AuthContext
        └── pages/             ← Owner + Admin pages
```

## Running Locally

### Prerequisites
- Java 21
- Maven
- Node.js 18+
- MySQL 8

### Backend
```bash
cd backend
# Edit src/main/resources/application.properties with your MySQL credentials
mvn spring-boot:run
# Starts on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

### Default Admin Account
Seeded automatically on first startup:
- Email: `admin@pethealth.com`
- Password: `admin123`

## API Endpoints

| Method | Path | Role |
|--------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET/POST/PUT/DELETE | `/api/pets` | OWNER |
| GET/POST/PATCH | `/api/appointments` | OWNER |
| GET | `/api/vets` | Public |
| GET | `/api/services` | Public |
| GET | `/api/admin/appointments` | ADMIN |
| PATCH | `/api/admin/appointments/{id}/status` | ADMIN |
| POST/PUT/DELETE | `/api/admin/vets` | ADMIN |
| POST/PUT/DELETE | `/api/admin/services` | ADMIN |
