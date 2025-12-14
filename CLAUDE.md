# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack e-commerce application monorepo with three main components:

- **ecommerce-db**: PostgreSQL database with Docker setup
- **ecommerce-backend**: NestJS REST API
- **ecommerce-ui**: Next.js 16 frontend with nuqs state management

All three components are containerized with Docker and can run independently or together.

## Quick Start Commands

### Start All Services (Development)

```bash
# 1. Start database
cd ecommerce-db/database
docker-compose up -d

# 2. Start backend (in new terminal)
cd ecommerce-backend
npm install
npx prisma generate
npm run start:dev

# 3. Start frontend (in new terminal)
cd ecommerce-ui
npm install
cp .env.example .env.local  # Edit with your values
npm run dev
```

### Database Commands

```bash
# Start database
cd ecommerce-db/database && docker-compose up -d

# Stop database
cd ecommerce-db/database && docker-compose down

# Reset database (wipes all data)
cd ecommerce-db/database && docker-compose down -v && docker-compose up -d

# Access PostgreSQL CLI
docker exec -it ecommerce_postgres psql -U postgres -d ecommerce_db

# View database logs
docker logs ecommerce_postgres
```

### Backend Commands

```bash
cd ecommerce-backend

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Prisma operations
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run migrations
npx prisma db seed          # Seed database

# Docker
docker build -t ecommerce-backend .
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/ecommerce_db?schema=public" \
  ecommerce-backend
```

### Frontend Commands

```bash
cd ecommerce-ui

# Development
npm run dev

# Production build
npm run build
npm run start

# Docker
docker build -t ecommerce-ui .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:8080" \
  ecommerce-ui
```

## Architecture

### System Overview

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│             │      │              │      │            │
│  Next.js    │─────▶│  NestJS API  │─────▶│ PostgreSQL │
│  Frontend   │      │   Backend    │      │  Database  │
│  (Port 3000)│      │  (Port 8080) │      │ (Port 5432)│
└─────────────┘      └──────────────┘      └────────────┘
```

### Database Schema

**promotions**
- id (SERIAL PRIMARY KEY)
- code (VARCHAR(50), UNIQUE) - Promotion code
- discount (INTEGER) - Percentage (0-100)

**products**
- id (SERIAL PRIMARY KEY)
- title (VARCHAR(255))
- description (TEXT, NULLABLE)
- price (DECIMAL(10,2))
- image_url (TEXT, NULLABLE)
- promo_id (INTEGER, NULLABLE) - FK to promotions(id), ON DELETE SET NULL

The database is seeded with 100+ products across 10 categories and 6 promotion codes. Many products contain palindromes in their titles/descriptions for testing search functionality.

### Backend Architecture (NestJS)

**Module Structure:**
- AppModule (root)
  - PrismaModule (database connection)
  - ProductsModule (product logic)

**Design Pattern:** Each module follows Controller → Service → Prisma pattern
- Controllers handle HTTP requests and define endpoints
- Services contain business logic
- DTOs validate input data
- Interfaces define output structure

**API Endpoint:**
- `GET /api/products` - Paginated product search
  - Query params: `query` (string, optional), `page` (number, default 0), `pageSize` (number, default 20)
  - Returns: `{ pages, page, size, products[] }` with promotions included
  - **Important**: Search parameter should NOT include quotes (use `?query=radar` not `?query='radar'`)

**Configuration:**
- CORS enabled for all origins
- Global prefix: `/api`
- Port: 8080
- Prisma client output: `generated/prisma/` (CommonJS format)

### Frontend Architecture (Next.js)

**App Router Structure:**
- src/app/ - Pages and layouts
- src/components/ - Reusable components
  - src/components/ui/ - Radix UI components
- src/hooks/ - Custom hooks (useProductSearch)
- src/lib/ - Utilities
- src/types/ - TypeScript types

**Features:**
- Server-side rendering (SSR) and Static Site Generation (SSG)
- Product search with pagination and URL state (nuqs)
- Responsive design with TailwindCSS 4
- React Compiler enabled for automatic optimizations
- Shareable search URLs

**Configuration:**
- Port: 3000
- Standalone build enabled for Docker
- Environment variables:
  - `NEXT_PUBLIC_API_URL` - Backend API URL (public, accessible from browser)

## Docker Configuration

### Database (ecommerce-db)

Uses `postgres:15-alpine` image with automatic initialization via `init.sql`. Data persists in `./database/pgdata/` (ignored in git).

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public
```

### Backend (ecommerce-backend)

Multi-stage Dockerfile:
1. Builder: Install deps, generate Prisma client, compile TypeScript
2. Production: Only production deps + compiled code

**Environment Variable for Docker:**
- When backend runs in Docker and database on host: use `host.docker.internal` instead of `localhost`

### Frontend (ecommerce-ui)

Multi-stage Dockerfile with standalone build:
1. Builder: Install deps, build Next.js with standalone output
2. Runner: Minimal image with only necessary files, runs as non-root user

**Important for Docker:**
- `NEXT_PUBLIC_API_URL` must be accessible from user's browser (not from container)
- Container runs as `nextjs:nodejs` user for security

## Common Development Workflows

### Adding a New API Endpoint

1. Create DTO in `ecommerce-backend/src/products/dto/`
2. Add method to service in `products.service.ts`
3. Add endpoint to controller in `products.controller.ts`
4. Use Prisma client for database operations
5. Test endpoint: `curl http://localhost:8080/api/your-endpoint`

### Modifying Database Schema

1. Edit `ecommerce-backend/prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name your_migration_name`
3. Regenerate client: `npx prisma generate`
4. Update corresponding TypeScript types/interfaces
5. Restart backend: `npm run start:dev`

### Adding a Frontend Component

1. Create component in `ecommerce-ui/src/components/`
2. Use Radix UI primitives for accessibility
3. Style with TailwindCSS utility classes
4. Import and use in pages from `src/app/`

### Testing Product Search

```bash
# Get all products
curl http://localhost:8080/api/products

# Search for products (case-insensitive)
curl http://localhost:8080/api/products?query=laptop

# Paginated search
curl http://localhost:8080/api/products?query=radar&page=1&pageSize=10
```

## Naming Conventions

**Backend:**
- Files: kebab-case (`products.service.ts`)
- Classes: PascalCase (`ProductsService`)
- DTOs: PascalCase + `Dto` suffix (`QueryProductsDto`)
- Interfaces: PascalCase + descriptive suffix (`PaginatedResponse`)

**Frontend:**
- Components: PascalCase (`ProductCard.tsx`)
- Files: kebab-case or PascalCase depending on content
- Hooks: camelCase with `use` prefix (`useProducts`)

**Database:**
- Tables: snake_case plural (`products`, `promotions`)
- Columns: snake_case (`promo_id`, `image_url`)

## Important Notes

### Database Initialization

The `init.sql` script only runs on first container creation. To re-run after modifications, you must delete the volume with `docker-compose down -v`.

### Prisma Client Location

Backend generates Prisma client to `generated/prisma/` (not `node_modules/@prisma/client`). Import with:
```typescript
import { PrismaClient } from '../../generated/prisma';
```

### Search Query Caveat

When calling the API, do NOT include quotes in the query parameter:
- ✅ Correct: `?query=radar`
- ❌ Incorrect: `?query='radar'` (will search for literal string with quotes)

### Docker Networking

- Backend in Docker connecting to database on host: use `host.docker.internal:5432`
- Frontend `NEXT_PUBLIC_API_URL` should be accessible from user's browser, not the container
- For local development with all services on host, use `localhost`

## Project-Specific Details

### Test Data

The database is pre-seeded with products containing palindromes (radar, civic, somos, oso, kayak, level, etc.) specifically for testing the search functionality.

### Environment Files

- Backend: `.env` (in root, tracked for demo purposes)
- Frontend: `.env.local` (NOT tracked, copy from `.env.example`)

### Port Assignment

- Frontend: 3000
- Backend: 8080
- Database: 5432

All ports are configurable via environment variables or docker-compose.
