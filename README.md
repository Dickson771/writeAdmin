# Assignment Help Pro

Production-ready single-admin dashboard for managing assignment orders, writers, invoices, payments, reminders, and analytics.

## Stack
- Next.js 14 + TypeScript + Tailwind CSS
- Prisma ORM (SQLite by default, easy to switch to PostgreSQL)
- API Routes for backend endpoints
- JWT cookie login for single admin
- Vitest for lightweight API route tests

## Features
- Dashboard KPIs (revenue, unpaid, due soon, active orders, overdue invoices)
- Full CRUD APIs for clients, writers, orders, invoices, payments, reminders
- Unpaid/refused report with refusal reason breakdown
- Analytics summaries (status/type/client/writer)
- Invoice generation with branded PDF-like stored file
- Admin settings for business profile, tax, invoice prefix, reminder defaults
- Seed script with demo data and admin credentials

## Data Model
See `prisma/schema.prisma` for all entities:
- User, Client, Writer, Order, OrderActivity, Invoice, Payment, Reminder, Setting

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env and edit values:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client + migrate:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

Open http://localhost:3000.

### Default Login
- email: `admin@ahp.local`
- password: `admin123`

## API Endpoints
- `POST /api/auth/login`
- `GET/POST /api/clients`
- `GET/POST /api/writers`
- `GET/POST/PATCH /api/orders`
- `GET/POST/PATCH /api/invoices`
- `POST /api/payments`
- `GET/POST /api/reminders`
- `GET /api/dashboard`
- `GET /api/reports/unpaid`
- `GET /api/analytics`
- `GET/PATCH /api/settings`

## Tests
Run:
```bash
npm test
```
