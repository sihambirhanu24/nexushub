# NexusHub — Smart Operations Management Portal

A full-stack PERN (PostgreSQL, Express, React, Node.js) application built for the Teamwork IT Solution PLC Developer Internship Technical Assessment. NexusHub brings team member management, work request tracking, resource registry, and system-wide statistics under one roof.

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS v4, React Router DOM, Axios, Lucide Icons
**Backend:** Node.js, Express.js
**Database:** PostgreSQL
**Auth:** JWT (JSON Web Tokens), bcrypt password hashing

---

## Project Structure

This is a monorepo containing two independent projects:

```
Nexushub/
├── nexushub-backend/     # Express API server
└── nexushub-frontend/    # React application
```

---

## Prerequisites

Before you begin, make sure you have installed:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (v14 or higher)
- **npm** (comes with Node.js)

---

## Setup Instructions (from zero)

### 1. Clone the repository

```bash
git clone https://github.com/sihambirhanu24/nexushub.git
cd nexushub
```

### 2. Database Setup

Log into PostgreSQL and create the database and a dedicated user:

```bash
sudo -i -u postgres
psql
```

```sql
CREATE DATABASE nexushub;
CREATE USER nexushub_admin WITH PASSWORD 'your_chosen_password';
GRANT ALL PRIVILEGES ON DATABASE nexushub TO nexushub_admin;
```

Connect to the new database and grant schema-level permissions (required on PostgreSQL 15+):

```bash
psql -d nexushub
```

```sql
GRANT ALL ON SCHEMA public TO nexushub_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nexushub_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nexushub_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO nexushub_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO nexushub_admin;
```

Exit `psql`, then create the tables (run each block in `psql -d nexushub`):

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'staff', 'viewer')),
  department VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE work_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Technical Support', 'Equipment Request', 'Software Installation', 'Office Maintenance')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  requested_by INTEGER NOT NULL REFERENCES users(id),
  assigned_to INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  resource_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Laptop', 'Desktop', 'Printer', 'Meeting Room', 'Vehicle', 'Projector', 'Furniture')),
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'unavailable')),
  assigned_to INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Backend Setup

```bash
cd nexushub-backend
npm install
```

Create a `.env` file in `nexushub-backend/` (copy `.env.example` and fill in real values):

```
DB_USER=nexushub_admin
DB_PASSWORD=your_chosen_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexushub
PORT=5000
JWT_SECRET=generate_a_long_random_string_here
```

Generate a secure `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start the backend:
```bash
node server.js
```

The API will run on `http://localhost:5000`.

### 4. Create the first Admin account

Since new admins can only be created by existing admins through the app, you must bootstrap the very first one manually:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"yourpassword","role":"admin","department":"IT"}'
```

### 5. Frontend Setup

Open a new terminal:

```bash
cd nexushub-frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`. Log in with the admin account created above.

---

## Environment Variables Reference

**Backend (`nexushub-backend/.env`):**
| Variable | Description |
|---|---|
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host (localhost for local dev) |
| `DB_PORT` | Database port (default 5432) |
| `DB_NAME` | Database name (nexushub) |
| `PORT` | Port the Express server runs on |
| `JWT_SECRET` | Secret key used to sign JWTs — must be long and random |

See `.env.example` in each folder for a template.

---

## Features by Module

### Module 1 — Authentication
- Register, Login, Logout
- JWT-based authentication with 1-day token expiry
- Protected routes (frontend) and middleware-based route protection (backend)
- Role-based authorization (`admin`, `manager`, `staff`, `viewer`) via dedicated middleware

### Module 2 — Dashboard
- Summary cards: Total Team Members, Active Members, Total Work Requests, Total Resources, Pending Requests, Completed Requests
- Recent Activity feeds: New Team Members, New Work Requests, Recently Added Resources

### Module 3 — Team Members
- Full CRUD (Add, Edit, Delete, View Details)
- Search by name/email
- Filter by department/status (backend supports query params; UI filter controls are a known limitation, see below)
- Role-restricted write actions (Admin only)

### Module 4 — Work Requests
- Full CRUD (Create, Edit, Delete, View Details)
- Auto-generated request numbers (`REQ-0001`, etc.)
- Status and priority tracking with color-coded badges
- Requester name shown via SQL JOIN with the users table
- Status filter tabs; Edit restricted to Admin/Manager, Delete restricted to Admin

### Module 5 — Resources
- Full CRUD (Add, Edit, Delete, View Details)
- Category filter tabs
- Unique resource codes enforced at the database level

### Module 6 — Global Search
- Single search bar in the top navigation bar
- Searches Team Members, Work Requests, and Resources simultaneously
- Debounced input (300ms) to avoid excessive API calls
- Grouped, clickable results that navigate to the relevant page

### Module 7 — Statistics
- Members per Department
- Requests by Status
- Resources by Category
- Members by Status (Active/Inactive)
- All computed via PostgreSQL `GROUP BY` aggregation queries

---

## Security Notes

- Passwords are hashed with bcrypt (never stored or returned in plain text)
- All database queries use parameterized queries (`$1, $2...`) to prevent SQL injection
- Login/register return a generic "Invalid email or password" message regardless of which field was wrong, to prevent user enumeration attacks
- Role permissions are enforced on the backend via middleware — frontend button-hiding is a UX convenience only, not a security boundary
- Public registration always creates `staff`-role accounts; Admin/Manager accounts can only be created by an existing Admin through the Team Members module

---

## Known Limitations / Cut Corners

Given the assessment's time constraints, the following were deliberately deprioritized:

- **No phone number field** for Team Members — the `users` table and search do not currently include phone, though the assessment lists it as a searchable field.
- **No dedicated Department/Status filter UI** on the Team Members page — the backend endpoint supports these as query parameters, but the frontend only exposes a text search box.
- **No assignee-picker UI** for Work Requests — `assigned_to` can be set via the API, but there's no dropdown to select a team member visually in the Edit form.
- **No Manager department-scoping** — Managers currently see all data system-wide rather than being scoped to their own department, as the role table implies.
- **No Staff-only "my requests" view** — all authenticated users see all work requests; a production version would restrict Staff to their own submissions.
- **No toast/success notifications** — success is reflected by the UI updating (e.g., a new row appearing), but there's no dedicated success banner, only error banners on failure.

These were prioritized against the time available; core CRUD, security, and the primary user flows were treated as higher priority than these polish items.

---

## Author

Siham Birhanu — Developer Internship Technical Assessment submission for Teamwork IT Solution PLC.