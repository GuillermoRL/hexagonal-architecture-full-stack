# Ecommerce Backend - Contexto del Proyecto

## Descripción General

Backend de ecommerce construido con NestJS, Prisma y PostgreSQL siguiendo **Arquitectura Hexagonal (Ports & Adapters)**. Implementa búsqueda de productos con descuento automático del 50% para búsquedas de palíndromos.

## Stack Tecnológico

- **Framework**: NestJS 10.4
- **Base de datos**: PostgreSQL 15
- **ORM**: Prisma 7.1
- **Runtime**: Node.js 20
- **Testing**: Jest 30.2 + @nestjs/testing
- **Contenedorización**: Docker (multi-stage build)
- **Module Format**: CommonJS

## Arquitectura Hexagonal

El proyecto sigue el patrón **Ports and Adapters** con clara separación de capas:

### Estructura de Capas

```
src/
├── domain/                          # Capa de Dominio (Core)
│   ├── entities/                    # Entidades de negocio
│   │   ├── product.entity.ts        # Product + lógica de palíndromo
│   │   └── promotion.entity.ts      # Promotion + descuentos
│   ├── repositories/                # Ports (interfaces)
│   │   └── product.repository.ts    # Interfaz del repositorio
│   └── value-objects/               # Objetos de valor
│       ├── pagination.vo.ts         # Lógica de paginación
│       └── search-query.vo.ts       # Detección de palíndromos
├── application/                     # Capa de Aplicación
│   └── use-cases/
│       └── search-products/
│           ├── search-products.use-case.ts    # Orquesta búsqueda
│           ├── search-products.input.ts       # DTO entrada
│           ├── search-products.output.ts      # DTO salida
│           └── search-products.mapper.ts      # Entity → DTO
└── infrastructure/                  # Capa de Infraestructura (Adapters)
    ├── database/prisma/
    │   ├── repositories/
    │   │   └── prisma-product.repository.ts   # Implementa Port
    │   └── mappers/
    │       └── product.mapper.ts              # Prisma → Entity
    └── (controllers, modules, etc.)
```

### Principios Aplicados

✅ **Dependency Inversion**: Use cases dependen de interfaces, no implementaciones
✅ **Single Responsibility**: Cada capa tiene una responsabilidad clara
✅ **Separation of Concerns**: Lógica de negocio aislada de infraestructura
✅ **Testability**: Fácil mock de dependencias (100% cobertura en domain)

## Reglas de Negocio

### Descuento por Palíndromo (50%)

**Lógica**: Cuando el término de búsqueda es un palíndromo, se aplica descuento especial.

**Implementación**:
- `SearchQuery` Value Object detecta palíndromos (ignora espacios, mayúsculas, caracteres especiales)
- `Product.applyPalindromeDiscount()` aplica 50% si:
  - No tiene promoción O
  - Promoción actual < 50%
- Mantiene promoción original si es ≥ 50%

**Ejemplos de palíndromos**: `radar`, `ana`, `oso`, `reconocer`, `anita lava la tina`

**Campo**: `isPalindromeDiscount: boolean` indica si se aplicó el descuento

## Base de Datos

### Modelos Prisma

**Product**
```prisma
model Product {
  id          Int        @id @default(autoincrement())
  title       String     @db.VarChar(255)
  description String?
  price       Decimal    @db.Decimal(10, 2)
  image_url   String?
  promo_id    Int?
  promotion   Promotion? @relation(fields: [promo_id], references: [id])

  @@map("products")
}
```

**Promotion**
```prisma
model Promotion {
  id       Int       @id @default(autoincrement())
  code     String    @unique @db.VarChar(50)
  discount Int
  products Product[]

  @@map("promotions")
}
```

### Generación Prisma Client

- Output: `generated/prisma/`
- Format: CommonJS
- Comando: `npx prisma generate`

## API Endpoints

### GET /api/products

**Query Parameters**:
- `query` (string, opcional): Búsqueda en title/description
- `page` (number, default: 0): Número de página
- `pageSize` (number, default: 20): Items por página

**Respuesta**:
```typescript
{
  products: ProductDto[],
  totalPages: number,
  currentPage: number,
  pageSize: number,
  totalCount: number
}
```

**ProductDto**:
```typescript
{
  id: number,
  title: string,
  description: string | null,
  price: number,
  imageUrl: string | null,
  finalPrice: number,
  isPalindromeDiscount: boolean,  // ← Indica descuento por palíndromo
  promotion?: {
    id: number,
    code: string,
    discount: number
  }
}
```

**Ejemplo con palíndromo**:
```bash
curl "http://localhost:8080/api/products?query=radar"
# isPalindromeDiscount: true, discount: 50%
```

**Ejemplo sin palíndromo**:
```bash
curl "http://localhost:8080/api/products?query=laptop"
# isPalindromeDiscount: false, descuento original
```

## Testing

### Configuración: Jest + ts-jest

**Scripts**:
```bash
npm test              # Ejecutar tests
npm run test:watch    # Modo watch
npm run test:cov      # Con cobertura
```

### Cobertura de Tests (55 tests)

✅ **Domain Layer**: 100%
- `product.entity.spec.ts` (12 tests)
- `promotion.entity.spec.ts` (7 tests)
- `search-query.vo.spec.ts` (6 tests)
- `pagination.vo.spec.ts` (9 tests)

✅ **Application Layer**: ~92%
- `search-products.use-case.spec.ts` (7 tests)
- `search-products.mapper.spec.ts` (5 tests)

✅ **Infrastructure Mappers**: 100%
- `product.mapper.spec.ts` (7 tests)

### Estrategia de Testing

- **Unit tests** con mocks para dependencias
- **Validación de objetos completos** con `toMatchObject`
- **Casos edge**: validaciones, errores, palíndromos
- **No redundantes**: Tests concisos y enfocados

## Configuración

### Variables de Entorno (.env)

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"
NODE_NO_WARNINGS=1
```

### CORS

Configurado para aceptar cualquier origen:
```typescript
app.enableCors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

### Puerto y Prefijo

- Puerto: **8080**
- Prefijo global: **/api**
- URL base: `http://localhost:8080/api`

## Docker

### Multi-stage Build

**Stage 1 (builder)**:
1. Instala dependencias
2. Genera Prisma Client (con DATABASE_URL placeholder)
3. Compila TypeScript

**Stage 2 (production)**:
1. Instala solo deps de producción (incluye `dotenv` y `prisma`)
2. Regenera Prisma Client
3. Copia código compilado

### Variables de Entorno en Docker

El `DATABASE_URL` se pasa en runtime vía docker-compose:
```yaml
environment:
  DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/ecommerce_db?schema=public"
```

**Importante**: Usa `postgres` (nombre del servicio) como host, no `localhost`.

## Decisiones de Arquitectura

### 1. Por qué Arquitectura Hexagonal

✅ **Testabilidad**: Lógica de negocio aislada y fácil de probar
✅ **Mantenibilidad**: Cambios en infraestructura no afectan dominio
✅ **Claridad**: Separación explícita de responsabilidades
✅ **Flexibilidad**: Fácil cambiar de Prisma a otro ORM sin tocar dominio

### 2. Value Objects vs Primitivos

**SearchQuery** y **Pagination** son Value Objects porque:
- Encapsulan lógica de negocio (detección palíndromos, cálculo skip/take)
- Aseguran invariantes (validaciones)
- Mejoran expresividad del código

### 3. Repository Pattern

**Interface en Domain**, **Implementación en Infrastructure**:
```typescript
// domain/repositories/product.repository.ts
export interface ProductRepository {
  search(query: string, skip: number, take: number): Promise<Product[]>;
}

// infrastructure/database/prisma/repositories/prisma-product.repository.ts
@Injectable()
export class PrismaProductRepository implements ProductRepository { ... }
```

### 4. Mappers en Dos Capas

- **Infrastructure Mapper**: Prisma Model → Domain Entity
- **Application Mapper**: Domain Entity → Output DTO

Esto mantiene el dominio puro y sin dependencias.

### 5. Inmutabilidad en Entidades

`Product.applyPalindromeDiscount()` retorna **nueva instancia**, no muta:
```typescript
applyPalindromeDiscount(): Product {
  // ...
  return new Product(...); // Nueva instancia
}
```

### 6. CommonJS vs ESM

Decidimos CommonJS (`type: "commonjs"`) por:
- Compatibilidad con Prisma Client generado
- Estabilidad con NestJS
- Menos configuración necesaria

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev         # Modo desarrollo con watch
npm run start:debug       # Modo debug

# Producción
npm run build            # Compilar TypeScript
npm run start:prod       # Ejecutar build

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:cov         # Tests con cobertura

# Prisma
npx prisma generate      # Generar cliente
npx prisma db seed       # Poblar base de datos
npx prisma studio        # UI para ver datos
```

## Comandos de Desarrollo

```bash
# Iniciar base de datos
docker compose -f ecommerce-db/database/docker-compose.yml up -d

# Generar Prisma Client
npx prisma generate

# Poblar base de datos
npx prisma db seed

# Iniciar desarrollo
npm run start:dev

# Ejecutar tests
npm test

# Ver cobertura
npm run test:cov
```

## Convenciones de Código

### Naming

- **Archivos**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Interfaces**: `PascalCase` (sin prefijo I)
- **Constants**: `UPPER_SNAKE_CASE`
- **Value Objects**: `PascalCase` con sufijo `.vo.ts`

### TypeScript

- Strict mode habilitado
- No usar `any` (usar `unknown` si necesario)
- Preferir `readonly` en propiedades
- Decoradores habilitados para NestJS

### Testing

- Tests junto al código: `*.spec.ts`
- Usar `describe` y `it` para estructura
- Mocks con `jest.fn()`
- Aserciones con `expect().toMatchObject()` para objetos completos

## Troubleshooting

### Error: "Cannot find module 'dotenv/config'"

**Solución**: Mover `dotenv` de `devDependencies` a `dependencies` en package.json

### Error: "PrismaConfigEnvError: Missing DATABASE_URL"

**Solución**: Agregar `ENV DATABASE_URL="postgresql://..."` en Dockerfile antes de `prisma generate`

### Tests fallan con error de imports

**Solución**: Verificar que `jest.config.js` tenga `preset: 'ts-jest'` y `testEnvironment: 'node'`

## Sugerencias para Extender el Proyecto

### Seguridad y Autenticación
- Implementar autenticación con JWT (Passport.js)
- Agregar roles y permisos (RBAC)
- Rate limiting con @nestjs/throttler

### Features Adicionales
- Endpoints CRUD completos para productos (POST, PUT, DELETE)
- Sistema de carrito de compras
- Gestión de órdenes y checkout
- Búsqueda avanzada con filtros (precio, categorías)

### Performance y Escalabilidad
- Implementar caché con Redis
- Paginación con cursors (en lugar de offset)
- Índices de base de datos optimizados
- Query optimization con Prisma

### Observabilidad
- Logs estructurados (Winston/Pino)
- Monitoreo con Prometheus + Grafana
- Tracing distribuido (OpenTelemetry)
- Health checks mejorados

### DevOps
- CI/CD con GitHub Actions
- Deploy automatizado (Vercel, Railway, Render)
- Database migrations automatizadas
- Environments (staging, production)

### Documentación
- API docs con Swagger/OpenAPI
- Postman/Thunder Client collections
- Diagramas de arquitectura (C4 model)
