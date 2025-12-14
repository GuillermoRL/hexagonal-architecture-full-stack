# E-commerce Full Stack Application

Aplicación full-stack de e-commerce construida con Next.js, NestJS y PostgreSQL.

## Estructura del Proyecto

```
.
├── ecommerce-db/         # PostgreSQL database setup
├── ecommerce-backend/    # NestJS REST API
├── ecommerce-ui/         # Next.js frontend
├── docker-compose.yml    # Orquestación de todos los servicios
└── CLAUDE.md            # Documentación para Claude Code
```

## Quick Start con Docker Compose

La forma más rápida de ejecutar toda la aplicación es usando Docker Compose:

### 1. Clonar el repositorio

```bash
git clone git@github.com:GuillermoRL/hexagonal-architecture-full-stack.git
cd acueducto
```

### 2. Iniciar todos los servicios

```bash
docker-compose up --build
```

Esto iniciará:
- **PostgreSQL** en puerto `5432`
- **Backend API** en puerto `8080`
- **Frontend** en puerto `3000`

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **PostgreSQL**: localhost:5432

### 4. Detener los servicios

```bash
docker-compose down
```

### 5. Reiniciar con base de datos limpia

```bash
docker-compose down -v
docker-compose up --build
```

## Desarrollo Local (Sin Docker)

Si prefieres ejecutar los servicios directamente en tu máquina:

### 1. Iniciar PostgreSQL

```bash
cd ecommerce-db/database
docker-compose up -d
```

### 2. Iniciar Backend

```bash
cd ecommerce-backend
npm install
npx prisma generate
npm run start:dev
```

### 3. Iniciar Frontend

```bash
cd ecommerce-ui
npm install
cp .env.example .env.local
npm run dev
```

## Variables de Entorno

Puedes personalizar las variables de entorno creando un archivo `.env` en la raíz:

```bash
cp .env.example .env
```

Edita `.env` según tus necesidades.

## Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│             │      │              │      │            │
│  Next.js    │─────▶│  NestJS API  │─────▶│ PostgreSQL │
│  Frontend   │      │   Backend    │      │  Database  │
│  (Port 3000)│      │  (Port 8080) │      │ (Port 5432)│
└─────────────┘      └──────────────┘      └────────────┘
```

## Características

- **Frontend**: Next.js 16 con React 19, TailwindCSS, Radix UI
- **Backend**: NestJS con Prisma ORM
- **Database**: PostgreSQL 15 con datos de prueba pre-cargados
- **State Management**: nuqs para estado en URL
- **Containerización**: Docker y Docker Compose

## Documentación Detallada

Cada servicio tiene su propia documentación:

- [Database README](./ecommerce-db/README.md)
- [Backend README](./ecommerce-backend/README.md)
- [Frontend README](./ecommerce-ui/README.md)
- [CLAUDE.md](./CLAUDE.md) - Guía para Claude Code

## Pruebas

### Probar búsqueda de productos

```bash
# Buscar productos
curl "http://localhost:8080/api/products?query=laptop"

# Búsqueda con paginación
curl "http://localhost:8080/api/products?query=radar&page=0&pageSize=10"
```

### Probar funcionalidad de descuento por palíndromo

El sistema aplica automáticamente un descuento del 50% cuando buscas palabras que son palíndromos.

**Palíndromos para probar:**

```bash
# Búsqueda con "radar" (palíndromo)
curl "http://localhost:8080/api/products?query=radar"
# ✅ Debería mostrar isPalindromeDiscount: true
# ✅ Productos con descuento < 50% se actualizan a 50%
# ✅ Productos con descuento ≥ 50% mantienen su descuento original

# Búsqueda con "ana" (palíndromo)
curl "http://localhost:8080/api/products?query=ana"

# Búsqueda con "oso" (palíndromo)
curl "http://localhost:8080/api/products?query=oso"

# Búsqueda con "reconocer" (palíndromo)
curl "http://localhost:8080/api/products?query=reconocer"
```

**Comparación con no-palíndromos:**

```bash
# Búsqueda con "laptop" (NO es palíndromo)
curl "http://localhost:8080/api/products?query=laptop"
# ✅ Debería mostrar isPalindromeDiscount: false
# ✅ Mantiene los descuentos originales de cada producto
```

**Verificar el campo en la respuesta:**

```bash
# Usar jq para filtrar solo el campo isPalindromeDiscount
curl -s "http://localhost:8080/api/products?query=radar" | jq '.products[0].isPalindromeDiscount'
# Debería retornar: true

curl -s "http://localhost:8080/api/products?query=laptop" | jq '.products[0].isPalindromeDiscount'
# Debería retornar: false
```

### Frontend con búsquedas

El frontend implementa estado en URL y muestra visualmente los productos con descuento por palíndromo:

**Búsquedas con palíndromo (bordeado verde):**
```
http://localhost:3000/?query=radar
http://localhost:3000/?query=ana
http://localhost:3000/?query=oso
```
✅ Los productos con descuento por palíndromo se muestran con un **anillo verde brillante**

**Búsquedas sin palíndromo (sin bordeado especial):**
```
http://localhost:3000/?query=laptop
http://localhost:3000/?query=mouse
```
✅ Los productos mantienen su apariencia normal

## Comandos Útiles de Docker

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Reiniciar un servicio específico
docker-compose restart backend

# Verificar estado de los servicios
docker-compose ps

# Limpiar todo (contenedores, volúmenes, imágenes)
docker-compose down -v --rmi all
```

## Troubleshooting

### Puerto ya en uso

Si algún puerto está ocupado:

```bash
# Ver qué proceso usa un puerto
lsof -i :3000
lsof -i :8080
lsof -i :5432

# Matar el proceso
kill -9 <PID>
```

### La base de datos no se inicializa

```bash
# Eliminar volúmenes y reiniciar
docker-compose down -v
docker-compose up --build
```

### Problemas de permisos con PostgreSQL

En Mac/Linux:

```bash
sudo chown -R $(whoami) ecommerce-db/database/pgdata/
```

## Licencia

Este proyecto es para propósitos educativos.
