# Ticketing And Workflow Management System

A backend application for managing organizational support tickets through role-based workflows, automatic staff assignment, SLA tracking, analytics, and background job processing.

The system uses a layered architecture with authentication, authorization, Redis caching, background workers, audit logging, and API documentation.

---

## Tech Stack

| Layer             | Technologies           |
| ----------------- | ---------------------- |
| Backend           | Node.js, Express.js    |
| Database          | PostgreSQL             |
| Caching & Queues  | Redis, BullMQ          |
| Authentication    | JWT, Refresh Tokens    |
| API Documentation | Swagger                |
| Containerization  | Docker, Docker Compose |

---

## Features

### Authentication

* User Registration
* User Login
* Refresh Token Authentication
* Logout
* Refresh Token Revocation

### Ticket Management

* Ticket Creation
* Ticket Assignment
* Automatic Staff Assignment Based On Department Workload
* Ticket Reassignment
* Ticket Status Updates
* Ticket History Tracking
* Priority Based SLA Deadlines

### User Management

* Role Based Access Control
* Staff Management
* User Management

### Organizational Management

* Department Management
* Category Management

### Collaboration

* Ticket Comments

### Analytics

* Ticket Analytics
* Department Analytics
* Staff Workload Analytics

### Background Processing

* SLA Worker
* Email Worker

### Infrastructure

* Redis Integration
* Docker Support
* Swagger Documentation

---

## Key Concepts Implemented

* JWT Authentication
* Refresh Token Authentication
* Role Based Access Control (RBAC)
* Repository Pattern
* Service Layer Architecture
* Background Job Processing
* Redis Caching
* Audit Logging
* SLA Escalation
* Docker Containerization
* API Documentation

---

## System Architecture

```text
                           Client

                              │

                              ▼

                         Express API

                              │

          ┌───────────────────┼───────────────────┐

          │                   │                   │

          ▼                   ▼                   ▼

 Authentication       Authorization        Validation

   Middleware          Middleware          Middleware

                              │

                              ▼

                        Service Layer

                              │

                              ▼

                      Repository Layer

                        │             │

                        ▼             ▼

                  PostgreSQL        Redis

                                         │

                          ┌──────────────┴──────────────┐

                          ▼                             ▼

                    SLA Worker                    Email Worker
```

---

## Ticket Workflow

```text
User

↓

Create Ticket

↓

Select Category

↓

Determine Department

↓

Find Least Busy Staff Member

↓

Assign Ticket

↓

Generate SLA Deadline

↓

Create Audit Logs

↓

Queue Email Job

↓

Emit Real-Time Events
```

> Note: Category selection is currently user-driven. The backend validates the selected category and uses it to determine department ownership and automatic staff assignment.

---

## Project Structure

```text
server/

├── Dockerfile
├── docker-compose.yml

├── src

│   ├── app.js
│   ├── server.js

│   ├── config
│   │   ├── db.js
│   │   ├── emailTransporter.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   ├── swagger.js
│   │   └── swagger-ui.js

│   ├── constants

│   ├── controllers

│   ├── db
│   │   ├── schema.sql
│   │   └── seeds.sql

│   ├── middlewares

│   ├── queues

│   ├── repositories

│   ├── routes

│   ├── services

│   ├── templates

│   ├── testing

│   ├── utils

│   └── workers
```

---

## Database Tables

| Table              | Purpose                   |
| ------------------ | ------------------------- |
| roles              | Stores role definitions   |
| departments        | Stores departments        |
| users              | Stores users and staff    |
| ticket_categories  | Stores categories         |
| tickets            | Stores ticket information |
| ticket_assignments | Stores assignment history |
| comments           | Stores ticket comments    |
| refresh_tokens     | Stores refresh tokens     |
| audit_logs         | Stores audit history      |

---

## User Roles

| Role  | Permissions                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| User  | Create tickets, view own tickets, add comments                                   |
| Staff | View assigned tickets, update statuses, add comments                             |
| Admin | Manage staff, departments, categories, assignments, analytics and SLA processing |

---

## API Modules

### Authentication

```text
POST /api/auth/register

POST /api/auth/login

POST /api/auth/refresh

POST /api/auth/logout
```

### Tickets

```text
POST /api/tickets

GET /api/tickets/my

GET /api/tickets/assigned

GET /api/tickets/:id

PATCH /api/tickets/:id/status

PATCH /api/tickets/:id/assign

GET /api/tickets/:id/history
```

### Comments

```text
POST /api/tickets/:id/comments

GET /api/tickets/:id/comments
```

### Departments

```text
POST /api/departments

GET /api/departments

DELETE /api/departments/:id
```

### Categories

```text
POST /api/categories

GET /api/categories

DELETE /api/categories/:id
```

### Staff

```text
POST /api/staff

GET /api/staff

DELETE /api/staff/:id
```

### Analytics

```text
GET /api/analytics/tickets

GET /api/analytics/departments

GET /api/analytics/staff-workload
```

### SLA

```text
POST /api/sla/process
```

### Health

```text
GET /api/health
```

---

## Installation

Clone the repository.

```bash
git clone <repository-url>

cd server

npm install
```

---

## Running Locally

1. Create a `.env` file.

2. Ensure PostgreSQL and Redis are running.

3. Start the server.

```bash
npm start
```

Server:

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/api-docs
```

---

## Running With Docker

Start containers:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

Reset containers and database:

```bash
docker compose down -v
```

---

## Environment Variables

```env
# Application

PORT=5000

# PostgreSQL

DB_HOST=postgres

DB_PORT=5432

DB_USER=postgres

DB_PASSWORD=password

DB_NAME=ticketing_system

# JWT

JWT_SECRET=your-secret

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=30

# Redis

REDIS_HOST=redis

REDIS_PORT=6379

# Email

SMTP_USER=your-email

SMTP_PASS=your-password

EMAIL_DELAY=5000
```

---

## Swagger Documentation

```text
http://localhost:5000/api-docs
```

---

## Future Improvements

* AI-assisted ticket categorization
* AI-generated priority suggestions
* AI-generated ticket summaries
* File attachments
* Enhanced notifications
* Expanded WebSocket events
* Frontend dashboard

---

## Live Demo

Backend URL:
https://ticketing-and-workflow-management-system.onrender.com/

Swagger Docs:
https://ticketing-and-workflow-management-system.onrender.com/api-docs/

---

## Author

Chenna Sai Charan
