# E-commerce Database

A PostgreSQL database setup for an e-commerce application with Docker support. Includes a complete schema and seed data for products and promotions.

## Features

- PostgreSQL 15 Alpine container
- Pre-configured schema with products and promotions tables
- 100+ seed products across 10 categories
- 6 pre-defined promotion codes
- Docker Compose for easy setup
- Automatic database initialization
- Health checks included

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Navigate to the database directory:
```bash
cd database
```

2. Start the database:
```bash
docker-compose up -d
```

3. Verify the database is running:
```bash
docker-compose ps
```

The database will be available at `localhost:5432`.

## Database Connection

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `ecommerce_db`
- **User:** `postgres`
- **Password:** `postgres`

## Database Schema

### Promotions Table

| Column   | Type         | Constraints              |
|----------|--------------|--------------------------|
| id       | SERIAL       | PRIMARY KEY              |
| code     | VARCHAR(50)  | UNIQUE, NOT NULL         |
| discount | INTEGER      | NOT NULL, CHECK (0-100)  |

### Products Table

| Column      | Type          | Constraints                      |
|-------------|---------------|----------------------------------|
| id          | SERIAL        | PRIMARY KEY                      |
| title       | VARCHAR(255)  | NOT NULL                         |
| description | TEXT          | NULL                             |
| price       | DECIMAL(10,2) | NOT NULL, CHECK (>= 0)           |
| image_url   | TEXT          | NULL                             |
| promo_id    | INTEGER       | FOREIGN KEY → promotions(id)     |

**Note:** When a promotion is deleted, associated products will have their `promo_id` set to NULL (ON DELETE SET NULL).

## Seed Data

The database comes pre-loaded with:

- **6 Promotions:** WELCOME20, FLASH50, NO_TAX, SUMMER10, CYBER25, FALL30
- **100+ Products** across categories:
  - Electronics (laptops, monitors, peripherals, tablets)
  - Home & Kitchen (appliances, cookware)
  - Furniture & Decor (chairs, desks, lighting)
  - Sports & Fitness (equipment, accessories)
  - Technology & Gadgets (drones, powerbanks, audio)
  - Office Supplies (desk items, organizers)
  - Audio & Video (TVs, soundbars, projectors)
  - Personal Care (grooming, wellness)
  - Accessories (bags, travel items, apparel)
  - Toys & Entertainment (games, puzzles)

## Common Operations

### Access the PostgreSQL CLI

```bash
docker exec -it ecommerce_postgres psql -U postgres -d ecommerce_db
```

### Stop the Database

```bash
cd database
docker-compose down
```

### Reset the Database

To completely reset the database and reinitialize with seed data:

```bash
cd database
docker-compose down -v
docker-compose up -d
```

### View Database Logs

```bash
docker logs ecommerce_postgres
```

## Example Queries

### Get all products with their promotions

```sql
SELECT
    p.id,
    p.title,
    p.price,
    pr.code as promo_code,
    pr.discount
FROM products p
LEFT JOIN promotions pr ON p.promo_id = pr.id;
```

### Find products on sale

```sql
SELECT
    p.title,
    p.price,
    p.price * (1 - pr.discount / 100.0) as discounted_price,
    pr.code
FROM products p
INNER JOIN promotions pr ON p.promo_id = pr.id
ORDER BY pr.discount DESC;
```

### Products by price range

```sql
SELECT title, price
FROM products
WHERE price BETWEEN 50 AND 150
ORDER BY price;
```

### Count products by promotion

```sql
SELECT
    pr.code,
    COUNT(p.id) as product_count
FROM promotions pr
LEFT JOIN products p ON pr.id = p.promo_id
GROUP BY pr.code
ORDER BY product_count DESC;
```

## Data Persistence

Database data is persisted in the `./database/pgdata/` directory. This directory is automatically created by Docker and contains all PostgreSQL data files.

**Important:** The `pgdata` directory should not be committed to version control.

## Troubleshooting

### Database won't start

Check if port 5432 is already in use:
```bash
lsof -i :5432
```

### Reset isn't working

Make sure to use the `-v` flag to remove volumes:
```bash
docker-compose down -v
```

### Can't connect to database

Wait for the health check to pass (may take 10-20 seconds after startup):
```bash
docker-compose ps
```

Look for `healthy` status in the output.

## License

This project is for educational purposes.
