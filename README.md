# 🎫 TicketPro — Support Ticket Management System

A full-stack support ticket management system with JWT authentication, role-based access control, and full Docker support. Built with Spring Boot, React, and MySQL.

---

## Features

- Secure login & registration (JWT + BCrypt)
- Role-based access — separate User and Admin experiences
- Create, view, and comment on support tickets
- Priority levels and status tracking (Open → In Progress → Resolved → Closed)
- Full audit history of ticket changes
- Admin dashboard to manage all tickets and users
- Fully containerized with Docker Compose

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot, Spring Security, JPA/Hibernate |
| Frontend | React, React Router |
| Database | MySQL 8.0 |
| DevOps | Docker, Docker Compose, Nginx |

---

## Getting Started

### Run with Docker (recommended)

\`\`\`bash
git clone https://github.com/jyotheeshwar7989/Mini-project.git
cd Mini-project
cp .env.example .env   # then fill in your own values
docker-compose up --build
\`\`\`

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |

### Run Locally (without Docker)

**Backend**
\`\`\`bash
cd backend
mvn spring-boot:run
\`\`\`

**Frontend**
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

---

## Environment Variables

Create a \`.env\` file in the project root:

\`\`\`
DB_ROOT_PASSWORD=your_mysql_root_password
DB_NAME=support_ticket_db
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRATION=86400000
\`\`\`

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | \`/api/v1/auth/register\` | Register a new user |
| POST | \`/api/v1/auth/login\` | Login and get a JWT |
| GET | \`/api/v1/tickets/my-tickets\` | Get current user's tickets |
| POST | \`/api/v1/tickets\` | Create a ticket |
| POST | \`/api/v1/tickets/{id}/comments\` | Add a comment |
| GET | \`/api/v1/admin/tickets\` | Get all tickets (admin) |
| GET | \`/api/v1/admin/users\` | Get all users (admin) |

---

## Author

**Jyotheeshwar** — [GitHub](https://github.com/jyotheeshwar7989)
