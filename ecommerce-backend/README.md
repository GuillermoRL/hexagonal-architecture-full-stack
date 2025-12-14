# Ecommerce Backend API

API REST construida con NestJS y Prisma para un sistema de ecommerce.

## Requisitos

- Node.js 18+
- Docker y Docker Compose

## Inicio Rápido

### 1. Iniciar la base de datos PostgreSQL

```bash
# Iniciar PostgreSQL con Docker Compose
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker ps
```

### 2. Configuración de la Base de Datos

La variable `DATABASE_URL` en el archivo `.env` ya está configurada con estos valores:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"
```

Configuración del contenedor Docker:
```
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: ecommerce_db
```

### 3. Instalación y Configuración

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones (crear las tablas)
npx prisma migrate dev --name init

# (Opcional) Poblar la base de datos con datos de prueba
npx prisma db seed
```

## Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:8080/api`

## Endpoints

### GET /api/products

Obtiene una lista paginada de productos con búsqueda opcional.

**Query Parameters:**

- `query` (string, opcional): Busca en el título o descripción del producto (case insensitive)
- `page` (number, opcional, default: 0): Número de página
- `pageSize` (number, opcional, default: 20): Cantidad de items por página

**Ejemplo de respuesta:**

```json
{
  "pages": 5,
  "page": 0,
  "size": 20,
  "products": [
    {
      "id": 1,
      "title": "Producto 1",
      "description": "Descripción del producto 1",
      "price": 99.99,
      "image_url": "https://example.com/image.jpg",
      "promo_id": 1,
      "promotion": {
        "id": 1,
        "code": "SUMMER2024",
        "discount": 20
      }
    }
  ]
}
```

**Ejemplos de uso:**

```bash
# Obtener todos los productos (primera página)
curl http://localhost:8080/api/products

# Buscar productos que contengan "laptop"
curl http://localhost:8080/api/products?query=laptop

# Obtener la segunda página con 10 items
curl http://localhost:8080/api/products?page=1&pageSize=10

# Buscar "laptop" en la segunda página
curl http://localhost:8080/api/products?query=laptop&page=1&pageSize=10
```

## Ejecutar con Docker

El backend puede ejecutarse completamente dentro de un contenedor Docker.

### Construir la imagen Docker

```bash
docker build -t ecommerce-backend .
```

### Ejecutar el contenedor

**Opción 1: Base de datos local (en tu máquina)**

Si tienes PostgreSQL corriendo localmente en tu máquina, usa `host.docker.internal`:

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/ecommerce_db?schema=public" \
  ecommerce-backend
```

**Opción 2: Base de datos en otro servidor**

Si tu base de datos está en otro servidor o dirección IP:

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://usuario:password@tu-servidor.com:5432/ecommerce_db?schema=public" \
  ecommerce-backend
```

**Notas importantes:**
- El contenedor expone el puerto 8080
- La variable `DATABASE_URL` debe apuntar a una base de datos PostgreSQL accesible
- `host.docker.internal` es un hostname especial de Docker que apunta a tu máquina local
- Asegúrate de que la base de datos esté corriendo y accesible antes de iniciar el contenedor
- El contenedor ya incluye todas las dependencias necesarias y el código compilado

### Verificar que el contenedor está corriendo

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs del contenedor
docker logs <container-id>
```

## Estructura del Proyecto

```
src/
├── app.module.ts           # Módulo principal
├── app.controller.ts       # Controlador principal
├── app.service.ts          # Servicio principal
├── main.ts                 # Punto de entrada (Puerto 8080, CORS, prefijo /api)
├── prisma/                 # Módulo de Prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── products/               # Módulo de productos
    ├── products.module.ts
    ├── products.controller.ts
    ├── products.service.ts
    ├── dto/
    │   └── query-products.dto.ts
    └── interfaces/
        └── paginated-response.interface.ts

prisma/
└── schema.prisma           # Schema de base de datos (Promotion, Product)
```

## Modelos de Base de Datos

### Promotion

```prisma
model Promotion {
  id       Int       @id @default(autoincrement())
  code     String    @unique
  discount Int
  products Product[]
}
```

### Product

```prisma
model Product {
  id          Int        @id @default(autoincrement())
  title       String
  description String
  price       Float
  image_url   String?
  promo_id    Int?
  promotion   Promotion? @relation(fields: [promo_id], references: [id])
}
```

## Características

- Puerto: 8080
- CORS habilitado (acepta peticiones de cualquier origen)
- Prefijo global: `/api`
- Búsqueda insensible a mayúsculas/minúsculas
- Paginación con cálculo automático de páginas totales
- Relaciones incluidas (productos con sus promociones)
- Dockerizado (listo para deploy en contenedores)

## Reglas de Negocio

### Descuento por Búsqueda de Palíndromo

El sistema aplica automáticamente un descuento especial del **50%** cuando el término de búsqueda es un **palíndromo** (palabra que se lee igual de izquierda a derecha y de derecha a izquierda).

**Lógica de aplicación:**

1. **Detección de palíndromo:**
   - El sistema valida si el query de búsqueda es un palíndromo
   - Ignora espacios, mayúsculas/minúsculas y caracteres especiales
   - Ejemplos válidos: `radar`, `ana`, `oso`, `reconocer`, `anita lava la tina`

2. **Aplicación del descuento:**
   - Si el producto **NO tiene promoción** → Se aplica 50% de descuento con código `PALINDROME`
   - Si el producto tiene promoción **< 50%** → Se reemplaza por el descuento de palíndromo (50%)
   - Si el producto tiene promoción **≥ 50%** → Se mantiene el descuento original (es mejor)

3. **Indicador en la respuesta:**
   - El campo `isPalindromeDiscount: true` indica que se aplicó el descuento por palíndromo
   - El campo `isPalindromeDiscount: false` indica que se mantiene la promoción original

**Ejemplos:**

```bash
# Búsqueda con palíndromo - descuento 50% aplicado
curl "http://localhost:8080/api/products?query=radar"
# Respuesta:
# {
#   "id": 1,
#   "title": "Laptop Gamer Pro",
#   "price": 1299.99,
#   "finalPrice": 649.995,
#   "isPalindromeDiscount": true,
#   "promotion": {
#     "code": "PALINDROME",
#     "discount": 50
#   }
# }

# Búsqueda sin palíndromo - mantiene promoción original
curl "http://localhost:8080/api/products?query=laptop"
# Respuesta:
# {
#   "id": 1,
#   "title": "Laptop Gamer Pro",
#   "price": 1299.99,
#   "finalPrice": 1039.992,
#   "isPalindromeDiscount": false,
#   "promotion": {
#     "code": "WELCOME20",
#     "discount": 20
#   }
# }
```

**Implementación:**

La lógica de palíndromo sigue la arquitectura hexagonal:
- **Domain Layer:** `SearchQuery` Value Object detecta palíndromos
- **Domain Layer:** Entidad `Product` con método `applyPalindromeDiscount()`
- **Application Layer:** `SearchProductsUseCase` aplica la regla de negocio
- **Infrastructure Layer:** Repositorios y mappers mantienen la separación de concerns
