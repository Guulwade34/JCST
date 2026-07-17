# JCST College Management and E-Learning Platform

Phase 1 establishes a production-oriented foundation for **Jubbaland College of Science and Technology**.
The root frontend route is a branded public homepage; protected college portals will live on their own routes
in later phases.

## Phase 1 deliverables

- React 19, Vite 8, TypeScript, Tailwind CSS, React Router, TanStack Query, Zustand, React Hook Form, and Zod
- Express 5, TypeScript, MongoDB, Mongoose, JWT, bcrypt, signed cookies, Helmet, CORS, and rate limiting
- Shared API, user, role, permission, and authentication contracts
- User and refresh-session models with indexes and validation
- Login, refresh-token rotation, logout, current-user, and health endpoints
- Backend authentication, role, and permission middleware
- Branded responsive public homepage at `/`
- Accessible login form with real API integration and error states
- Unit and endpoint tests
- Development super-admin seed command
- PM2-ready API process definition

## Requirements

- Node.js 22.12 or newer
- npm 10.9 or newer
- MongoDB 7 or newer, running locally or accessible through a connection string

## Folder structure

```text
jcst-platform/
├── client/
│   ├── public/
│   │   └── branding/
│   │       └── README.md
│   ├── src/
│   │   ├── app/
│   │   │   ├── providers/
│   │   │   ├── App.tsx
│   │   │   └── router.tsx
│   │   ├── components/
│   │   │   ├── public/
│   │   │   └── ui/
│   │   ├── features/
│   │   │   └── auth/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   └── public/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── tests/
│   │   └── types/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── vitest.config.ts
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── health/
│   │   │   ├── sessions/
│   │   │   └── users/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── shared/
│   ├── src/
│   │   ├── constants/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── phase-1-architecture.md
├── .editorconfig
├── .env.example
├── .gitignore
├── ecosystem.config.cjs
├── eslint.config.js
├── package.json
├── prettier.config.js
├── PROJECT_PROGRESS.md
├── README.md
└── tsconfig.base.json
```

## 1. Install

From the project root:

```bash
npm install
```

## 2. Configure the environment

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Replace all example secrets with strong random values of at least 32 characters. Configure `MONGODB_URI`,
`CLIENT_URL`, `SERVER_URL`, and `VITE_API_BASE_URL` for your environment.

## 3. Add the official logo

Copy the original JCST logo without editing it to:

```text
client/public/branding/jcst-logo.png
```

The UI hides a missing image cleanly during initial setup and automatically displays the official file once it
is placed at that path.

## 4. Start MongoDB

Example local connection used by `.env.example`:

```text
mongodb://127.0.0.1:27017/jcst_platform
```

Create a dedicated database user and a restricted connection string for production.

## 5. Create the development super-admin

Review and change these `.env` values first:

```text
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
SEED_ADMIN_FIRST_NAME=
SEED_ADMIN_LAST_NAME=
```

Then run:

```bash
npm run seed:admin
```

The seed command is blocked when `NODE_ENV=production`. Never reuse development credentials in production.

## 6. Run locally

```bash
npm run dev
```

Default addresses:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000/api/v1`
- Health: `http://localhost:5000/api/v1/health`

The root route `/` always renders the JCST public website shell.

## API endpoints

| Method | Endpoint               |          Authentication | Purpose                                          |
| ------ | ---------------------- | ----------------------: | ------------------------------------------------ |
| GET    | `/api/v1/health`       |                      No | Application and database health                  |
| POST   | `/api/v1/auth/login`   |                      No | Verify credentials and create a session          |
| POST   | `/api/v1/auth/refresh` |   Signed refresh cookie | Rotate refresh session and issue an access token |
| POST   | `/api/v1/auth/logout`  | Optional refresh cookie | Revoke the session and clear the cookie          |
| GET    | `/api/v1/auth/me`      |     Bearer access token | Return the current safe user profile             |

## Build and verify

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Run formatting validation:

```bash
npm run format:check
```

## Production build

```bash
npm install
npm run build
NODE_ENV=production npm run start -w @jcst/server
```

The frontend output is created in `client/dist` and should be served by a static web server with SPA fallback to
`index.html`. The API can be managed with PM2 using `ecosystem.config.cjs`. Put a reverse proxy in front of the
API, terminate HTTPS there, forward the original client IP, and keep the API bound to a private interface.

## Security notes

- The access token is held in memory, not local storage.
- The refresh token is stored in a signed, HTTP-only cookie scoped to `/api/v1/auth`.
- MongoDB stores only the refresh-token digest.
- Rotation revokes the previous refresh session.
- Account lockout is configurable.
- Backend middleware reloads the user and validates account status.
- Public responses omit password hashes, refresh tokens, and internal permission arrays.
- Critical authentication events are ready for the append-only audit module in its scheduled phase.

## Phase boundary

This package intentionally implements Phase 1 only. Academic modules, applications, students, course
registration, assessments, results, finance, library, reporting, and the remaining public pages are introduced
in their specified dependency order after this foundation compiles and tests successfully.

## Phase 2 — Database-driven public website and CMS

Phase 2 adds separate routes for the complete public website, MongoDB-backed content, online application submission and status tracking, contact messages, newsletter subscriptions, public verification endpoints, and a protected website CMS.

Run the public content seed after MongoDB is running:

```bash
npm run seed:website
```

Or run both development seeds:

```bash
npm run seed
```

Start the platform:

```bash
npm run dev
```

Public website: `http://localhost:5173`

Admin CMS: `http://localhost:5173/admin/website`

The seeded super-admin can manage content types including pages, departments, programs, courses, lecturers, announcements, FAQs, facilities, testimonials, statistics, and settings. Public pages never read hard-coded institutional content as their primary source; they retrieve published records through `/api/v1/website/*`.
