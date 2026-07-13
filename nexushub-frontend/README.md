cat > /mnt/user-data/outputs/README.md << 'ENDOFFILE'
# NexusHub — Smart Operations Management Portal

> A full-stack PERN (PostgreSQL, Express, React, Node.js) web application built as a Developer Internship Technical Assessment for Teamwork IT Solution PLC.

NexusHub replaces the classic "one spreadsheet for staff, another for equipment, a WhatsApp group for maintenance requests" with a single, role-aware operations portal that brings team members, work requests, and resources under one roof.

---



**Demo credentials (local):**
| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin123 |


---

## Tech Stack

| Layer | Technology | Why chosen |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, modern React, HMR |
| Styling | Tailwind CSS v4 | Utility-first, no heavy component library |
| Routing | React Router DOM v6 | Client-side routing with protected routes |
| HTTP Client | Axios | Centralized interceptor for automatic JWT attachment |
| Backend | Node.js + Express | Lightweight REST API matching the assessment stack |
| Database | PostgreSQL 18 | Relational data with real constraints and foreign keys |
| Auth | JWT + bcryptjs | Stateless auth, secure one-way password hashing |

---

## Project Structure

```
Nexushub/
├── README.md
├── nexushub_database.sql          # Complete database export (schema + seed data)
├── nexushub-backend/              # Express REST API
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection pool (local + Neon support)
│   ├── controllers/
│   │   ├── authController.js      # Register, login, updateProfile, changePassword
│   │   ├── memberController.js    # Team Members CRUD with role-based data scoping
│   │   ├── requestController.js   # Work Requests CRUD with SQL JOIN for requester name
│   │   ├── resourceController.js  # Resources CRUD + department resource view
│   │   ├── statsController.js     # System-wide + department-level aggregation queries
│   │   └── searchController.js    # Global cross-module search
│   ├── middleware/
│   │   └── authMiddleware.js      # protect (JWT verify) + adminOnly + adminOrManagerOwn
│   ├── routes/                    # URL → controller mappings
│   ├── .env.example               # Environment variable template
│   └── server.js                  # Express app entry point with all routes wired
│
└── nexushub-frontend/             # React application
    └── src/
        ├── api/
        │   └── axios.js           # Axios instance with JWT interceptor
        ├── components/            # Reusable UI components
        │   ├── Layout.jsx         # Fixed sidebar + sticky top bar with search + notifications
        │   ├── GlobalSearch.jsx   # Debounced cross-module search with grouped dropdown
        │   ├── NotificationBell.jsx # Real-time activity bell with dismiss functionality
        │   ├── ThemeToggle.jsx    # Dark/light mode toggle
        │   ├── Modal.jsx          # Reusable modal wrapper
        │   ├── ConfirmDialog.jsx  # Delete confirmation dialog
        │   ├── Toast.jsx          # Success/error notification toast
        │   ├── AddMemberModal.jsx
        │   ├── EditMemberModal.jsx
        │   ├── MemberDetailModal.jsx
        │   ├── AddRequestModal.jsx
        │   ├── EditRequestModal.jsx
        │   ├── RequestDetailModal.jsx
        │   ├── AddResourceModal.jsx
        │   ├── EditResourceModal.jsx
        │   └── ResourceDetailModal.jsx
        ├── context/
        │   ├── AuthContext.jsx    # Global auth state with localStorage persistence
        │   └── ThemeContext.jsx   # Dark/light mode state with localStorage persistence
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── TeamMembers.jsx
        │   ├── WorkRequests.jsx
        │   ├── Resources.jsx
        │   ├── Statistics.jsx
        │   └── Profile.jsx
        └── App.jsx                # Route definitions with protected routes
```

---

## Prerequisites

Before starting, make sure you have installed:
- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher
- **npm** (comes with Node.js)
- **git**

---

## Setup from Zero

### 1. Clone the repository

```bash
git clone https://github.com/sihambirhanu24/nexushub.git
cd nexushub
```

### 2. Database setup

Start PostgreSQL and create the database and user:

```bash
sudo -i -u postgres
psql
```

```sql
CREATE DATABASE nexushub;
CREATE USER nexushub_admin WITH PASSWORD 'your_chosen_password';
GRANT ALL PRIVILEGES ON DATABASE nexushub TO nexushub_admin;
\q
```

Connect to the database and grant schema permissions (required on PostgreSQL 15+):

```bash
psql -d nexushub
```

```sql
GRANT ALL ON SCHEMA public TO nexushub_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nexushub_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nexushub_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO nexushub_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO nexushub_admin;
\q
```

Exit back to your normal user:
```bash
exit
```

### 3. Import the database schema and seed data

The repository includes a complete database export:

```bash
sudo -u postgres psql -d nexushub -f nexushub_database.sql
```

This creates all tables with constraints and imports existing test data.

**If you prefer to create tables manually**, run these in `psql -d nexushub`:

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

### 4. Backend setup

```bash
cd nexushub-backend
npm install
cp .env.example .env
```

Edit `.env` with your actual values:

```env
DB_USER=nexushub_admin
DB_PASSWORD=your_chosen_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexushub
PORT=5000
JWT_SECRET=generate_a_long_random_string_here
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start the backend:
```bash
node server.js
```

Confirm it's working:
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","dbTime":"..."}
```

### 5. Bootstrap the first Admin account

Since public registration always creates Staff accounts and Admin creation requires an existing Admin, the first Admin must be created manually. First generate a bcrypt hash for your password:

```bash
node -e 'const bcrypt = require("bcryptjs"); bcrypt.hash("YourPassword123", 10).then(h => console.log(h));'
```

Copy the hash, then run in `psql -d nexushub`:

```sql
INSERT INTO users (name, email, password, role, department, status)
VALUES ('Admin User', 'admin@yourdomain.com', 'PASTE_HASH_HERE', 'admin', 'IT', 'active');
```

### 6. Frontend setup

Open a new terminal:

```bash
cd nexushub-frontend
npm install
cp .env.example .env
```

The default `.env` points to localhost — no changes needed for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser and log in with the admin account you just created.

---

## Environment Variables

### Backend (`nexushub-backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DB_USER` | PostgreSQL username | `nexushub_admin` |
| `DB_PASSWORD` | PostgreSQL password | `securepassword` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `nexushub` |
| `PORT` | Express server port | `5000` |
| `JWT_SECRET` | JWT signing secret — must be long and random | 64+ random bytes |
| `DATABASE_URL` | Full connection string (for Neon/production only) | `postgresql://...` |

### Frontend (`nexushub-frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Reference

### Authentication (public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register (always creates `staff` role) |
| POST | `/api/auth/login` | Login, returns JWT token |
| PUT | `/api/auth/profile` | Update own name (requires auth) |
| PUT | `/api/auth/change-password` | Change own password (requires auth) |

### Team Members
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/members` | Any | List members (Managers see own dept only) |
| GET | `/api/members/:id` | Any | View one member |
| POST | `/api/members` | Admin only | Add member |
| PUT | `/api/members/:id` | Admin or Manager | Edit member |
| DELETE | `/api/members/:id` | Admin only | Delete member |

### Work Requests
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/requests` | Any | List requests (Staff see own only) |
| GET | `/api/requests/:id` | Any | View one request |
| POST | `/api/requests` | Any | Create request |
| PUT | `/api/requests/:id` | Admin or Manager | Update request |
| DELETE | `/api/requests/:id` | Admin only | Delete request |

### Resources
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/resources` | Any | List all resources |
| GET | `/api/resources/:id` | Any | View one resource |
| GET | `/api/resources/department` | Any | Resources assigned to dept members |
| POST | `/api/resources` | Admin only | Add resource |
| PUT | `/api/resources/:id` | Admin only | Edit resource |
| DELETE | `/api/resources/:id` | Admin only | Delete resource |

### Search and Statistics
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/search?q=term` | Any | Search across all modules |
| GET | `/api/stats` | Any | System-wide aggregation stats |
| GET | `/api/stats/dashboard-counts` | Any | Lightweight count queries for dashboard |
| GET | `/api/stats/department` | Manager | Department-level statistics |

---

## Features by Module

### Module 1 — Authentication
- Register (public, always `staff` role — new Admins created by existing Admin only)
- Login with JWT (1-day expiry)
- Logout clears localStorage
- Protected routes on both frontend (`ProtectedRoute` component) and backend (`protect` middleware)
- Role-based authorization: `protect` + `adminOnly` + `adminOrManagerOwn` middleware chain
- Generic error messages prevent user enumeration attacks
- Passwords hashed with bcryptjs (cost factor 10) — never stored or returned in plain text

### Module 2 — Dashboard
- 6 live summary cards: Total Members, Active Members, Total Requests, Total Resources, Pending Requests, Completed Requests
- 3 recent activity feeds: New Team Members, New Work Requests, Recently Added Resources
- All data fetched in parallel via `Promise.all` — single round trip per dashboard load

### Module 3 — Team Members
- Full CRUD: Add (Admin only), Edit (Admin + Manager), Delete (Admin only), View Details
- Search by name or email — backend `ILIKE` parameterized query
- Filter by Department (dynamic from real data) and Status (Active/Inactive)
- Role-based data scoping: Managers see only their own department's members
- Duplicate email prevention at both application level (SELECT check) and database level (UNIQUE constraint)
- Mobile-responsive: card view on small screens, table on desktop

### Module 4 — Work Requests
- Full CRUD: Create, Edit (Admin + Manager), Delete (Admin only), View Details
- Auto-generated request numbers (`REQ-0001`, `REQ-0002`, ...) — UNIQUE constraint enforced at DB level
- Requester name shown via SQL JOIN — no second database round trip
- Filter by Status and Priority simultaneously (client-side, instant)
- Search by title, request number, or requester name
- Role-based data scoping: Staff see only their own requests
- Mobile-responsive: card view on small screens, table on desktop

### Module 5 — Resource Registry
- Full CRUD: Add (Admin only), Edit (Admin only), Delete (Admin only), View Details
- Card grid layout with category filter and status filter
- Search by resource name or resource code
- Unique resource codes enforced at database level (UNIQUE constraint)
- Department resource view — shows resources assigned to members of a specific department

### Module 6 — Global Search
- Single search bar in the sticky top navigation bar
- Searches Team Members, Work Requests, and Resources simultaneously via `Promise.all`
- Debounced 300ms to avoid excessive API calls
- Case-insensitive matching using PostgreSQL `ILIKE`
- Grouped, clickable results navigate to the relevant page
- Click-outside closes the dropdown automatically

### Module 7 — Statistics
- Members per Department
- Requests by Status
- Resources by Category
- Members by Status (Active vs Inactive)
- Department-level statistics for Managers (own department only)
- All computed via PostgreSQL `GROUP BY COUNT(*)` aggregation — never fetches full row sets
- CSS-based bar charts — no external charting library dependency

### Additional Features
- Dark/Light mode toggle with animated switch — preference saved to localStorage
- Notification bell with unread count badge — polls every 15 seconds
- Individual notification dismiss and "Clear all"
- Toast notifications on every create/edit/delete action
- My Profile page — update display name, change password (with current password verification)
- Confirmation dialog before every delete action

---

## Role-Based Access Control

| Permission | Admin | Manager | Staff | Viewer |
|---|---|---|---|---|
| View all members | ✅ | Own dept only | ✅ | ✅ |
| Add members | ✅ | ❌ | ❌ | ❌ |
| Edit members | ✅ | ✅ | ❌ | ❌ |
| Delete members | ✅ | ❌ | ❌ | ❌ |
| View all requests | ✅ | ✅ | Own only | ✅ |
| Create requests | ✅ | ✅ | ✅ | ❌ |
| Edit/assign requests | ✅ | ✅ | ❌ | ❌ |
| Delete requests | ✅ | ❌ | ❌ | ❌ |
| Manage resources | ✅ | ❌ | ❌ | ❌ |
| View dashboard/stats | ✅ | Dept-level | ✅ | ✅ |
| Create Admin accounts | ✅ | ❌ | ❌ | ❌ |

**Security note:** frontend button-hiding is UX only. All permissions are enforced by backend middleware on every request — bypassing the UI still results in 403 Forbidden.

---

## Security Design

### Password Storage
bcryptjs with salt factor 10. One-way hash — passwords cannot be recovered even with full database access. `bcrypt.compare()` on login never decrypts — it re-hashes and compares.

### JWT Security
- Signed with HMAC-SHA256 using `JWT_SECRET`
- Payload modification detected by signature mismatch → 401
- 1-day expiry
- Secret generated with `crypto.randomBytes(64)` — 2^512 brute-force space

### SQL Injection Prevention
All queries use parameterized statements (`$1`, `$2`, ...) throughout. User input is never concatenated into SQL strings.

### Enumeration Attack Prevention
Login returns identical "Invalid email or password" message regardless of whether the email exists or the password is wrong — attackers cannot determine which accounts are registered.

### Authorization Layers
1. **Frontend:** conditional rendering based on `user.role` — UX convenience only
2. **Backend:** `protect` middleware verifies JWT; `adminOnly` / `adminOrManagerOwn` enforce role — actual security boundary

---

## Database Schema

```
users
├── id (SERIAL PK — auto-increment)
├── name (VARCHAR NOT NULL)
├── email (VARCHAR UNIQUE NOT NULL)
├── password (VARCHAR NOT NULL) — bcryptjs hash, never plain text
├── role (VARCHAR CHECK: admin|manager|staff|viewer)
├── department (VARCHAR nullable)
├── status (VARCHAR DEFAULT 'active')
└── created_at (TIMESTAMP DEFAULT NOW())

work_requests
├── id (SERIAL PK)
├── request_number (VARCHAR UNIQUE NOT NULL) — auto-generated REQ-0001
├── title (VARCHAR NOT NULL)
├── description (TEXT nullable)
├── type (VARCHAR CHECK: 4 allowed values)
├── status (VARCHAR CHECK: 4 values DEFAULT 'pending')
├── priority (VARCHAR CHECK: 4 values DEFAULT 'medium')
├── requested_by (INTEGER NOT NULL → users.id) — who created it
├── assigned_to (INTEGER nullable → users.id) — who is working on it
└── created_at, updated_at (TIMESTAMP)

resources
├── id (SERIAL PK)
├── resource_code (VARCHAR UNIQUE NOT NULL) — e.g. LP-2201
├── name (VARCHAR NOT NULL) — e.g. MacBook Pro M2
├── category (VARCHAR CHECK: 7 allowed values)
├── status (VARCHAR CHECK: 4 values DEFAULT 'available')
├── assigned_to (INTEGER nullable → users.id)
└── created_at (TIMESTAMP)
```

**Key relationships:**
- `work_requests.requested_by` → `users.id` (NOT NULL — every request has a submitter)
- `work_requests.assigned_to` → `users.id` (nullable — unassigned is a valid state)
- `resources.assigned_to` → `users.id` (nullable — unassigned resources are in inventory)

---



## Known Limitations

These were deliberately deprioritized given the 4-day assessment deadline:

| Gap | Impact | How to fix properly |
|---|---|---|
| No phone number field | Search by phone not possible | `ALTER TABLE users ADD COLUMN phone VARCHAR(20)`; update all member endpoints, forms, and search query |
| No assignee picker UI | Managers cannot assign requests through UI (backend supports it) | Fetch `/api/members` in `EditRequestModal`, populate `<select>` for `assigned_to` field |
| Manager department-scoping incomplete | Backend partially scoped; Statistics page shows system-wide data to all roles | Ensure every query adds `WHERE department = req.user.department` when `role === 'manager'` |
| No automatic 401 redirect | Expired JWT causes silent API failures until manual re-login | Add axios response interceptor catching 401s, redirect to `/login` automatically |
| No refresh tokens | Users must log in again after 24 hours | Implement httpOnly cookie refresh token flow |
| No pagination | All rows fetched at once — won't scale to thousands of records | Add `LIMIT`/`OFFSET` to all list queries; implement pagination UI controls |
| No real-time updates | Changes by other users only visible on manual refresh | Implement WebSocket (socket.io) or Server-Sent Events for live updates |
| Staff "view assigned resources" not implemented | Staff cannot see resources assigned specifically to them | Add `GET /api/resources/mine` endpoint filtering by `assigned_to = req.user.id` |

---

                     

## Git Commit History

This project was built incrementally with meaningful commits at each stage:
- Database setup and schema design
- Authentication (register, login, JWT, middleware)
- Team Members CRUD with role-based access
- Work Requests CRUD with foreign keys and auto-numbering
- Resources CRUD with category/status constraints
- Statistics aggregation queries
- Global cross-module search with debouncing
- React frontend setup (Vite, Tailwind, routing, AuthContext)
- Individual page components with full CRUD modals
- Role-based UI (admin-only buttons, manager edit permissions)
- Dark/light mode toggle
- Notification bell with dismiss functionality
- Profile page with password change
- Mobile-responsive layouts
- Deployment configuration

---

## Author

**Siham Birhanu**
Developer Internship Technical Assessment
Teamwork IT Solution PLC — July 2026

GitHub: [@sihambirhanu24](https://github.com/sihambirhanu24)
ENDOFFILE
echo "Done"
Output

Done