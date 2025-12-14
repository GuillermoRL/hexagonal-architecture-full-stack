# Ecommerce Database - Contexto del Proyecto

## Descripción General

Base de datos PostgreSQL 15 para ecommerce con datos de prueba pre-cargados. Incluye **productos con palabras palindrómicas** para probar la funcionalidad de descuento automático del 50% implementada en el backend.

## Stack Tecnológico

- **Database**: PostgreSQL 15 (Alpine)
- **Containerización**: Docker + Docker Compose
- **Volumen**: Persistencia local en `./database/pgdata/`
- **Inicialización**: Script SQL automático

## Configuración de Conexión

### Credenciales (Desarrollo)

```bash
Host: localhost
Port: 5432
Database: ecommerce_db
User: postgres
Password: postgres
```

### Connection String

```bash
postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public
```

### Connection String (Docker Network)

Cuando el backend corre en Docker:
```bash
postgresql://postgres:postgres@postgres:5432/ecommerce_db?schema=public
```

**Importante**: Usar `postgres` (nombre del servicio) en lugar de `localhost`.

## Schema de Base de Datos

### Tabla: promotions

```sql
CREATE TABLE promotions (
  id         SERIAL PRIMARY KEY,
  code       VARCHAR(50) UNIQUE NOT NULL,
  discount   INTEGER NOT NULL
);
```

**Datos de Seed**: 6 promociones
- `WELCOME20` - 20% descuento
- `SUMMER50` - 50% descuento
- `FLASH30` - 30% descuento
- `LOYALTY15` - 15% descuento
- `SAVE10` - 10% descuento
- `VIP40` - 40% descuento

### Tabla: products

```sql
CREATE TABLE products (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url    TEXT,
  promo_id     INTEGER REFERENCES promotions(id) ON DELETE SET NULL
);
```

**Datos de Seed**: 100+ productos distribuidos en categorías:
- Electrónicos (laptops, teléfonos, tablets)
- Hogar (muebles, decoración, electrodomésticos)
- Deportes (bicicletas, kayaks, equipo)
- Oficina (escritorios, sillas, accesorios)
- Audio/Video (auriculares, cámaras, speakers)
- Cuidado Personal (productos de baño)
- Accesorios (mochilas, carteras)
- Juguetes (drones, robots)

## Estrategia de Seed Data: Palíndromos

### Propósito

Los productos incluyen **palabras palindrómicas** en títulos y descripciones para probar la funcionalidad de negocio del backend que aplica descuento del 50% cuando se busca un palíndromo.

### Palíndromos Incluidos

**Comunes**:
- `radar` - "Radar Device", "Laptop con radar"
- `civic` - "Civic Edition Mouse"
- `oso` - "Peluche Oso", "Oso Detector"
- `ana` - "Almohada Ana Memory Foam"
- `kayak` - "Kayak Inflable", "Kayak Pro"
- `level` - "Level Pro Gaming Mouse"
- `noon` - "Reloj Noon Digital"
- `rotor` - "Rotor Fan", "Drone Rotor"
- `somos` - "Silla Somos Ergonómica"
- `tenet` - "Monitor Tenet 4K"

**Con espacios**:
- `anita lava la tina` - "Set de baño Anita lava la tina"

### Distribución de Promociones

Productos con diferentes niveles de descuento para probar la lógica:
- **Sin promoción** (null) → Palíndromo aplica 50%
- **< 50% descuento** (10%, 15%, 20%, 30%, 40%) → Palíndromo reemplaza con 50%
- **≥ 50% descuento** (50%) → Mantiene descuento original

## Comandos Docker

### Iniciar Base de Datos

```bash
cd database
docker-compose up -d
```

### Detener Base de Datos

```bash
cd database
docker-compose down
```

### Reiniciar (útil después de cambios en schema)

```bash
cd database
docker-compose restart
```

### Reiniciar con Datos Limpios

```bash
cd database
docker-compose down -v
docker-compose up -d
```

**Nota**: `-v` elimina volúmenes, forzando re-ejecución de `init.sql`.

### Acceder a PostgreSQL CLI

```bash
docker exec -it ecommerce_postgres psql -U postgres -d ecommerce_db
```

### Ver Logs del Contenedor

```bash
docker logs ecommerce_postgres
docker logs -f ecommerce_postgres  # Follow mode
```

### Verificar Estado

```bash
docker ps | grep postgres
docker-compose ps
```

## Queries Útiles

### Ver Todos los Productos con Promociones

```sql
SELECT
  p.id,
  p.title,
  p.price,
  pr.code AS promo_code,
  pr.discount AS promo_discount
FROM products p
LEFT JOIN promotions pr ON p.promo_id = pr.id
ORDER BY p.id;
```

### Buscar Productos con Palíndromos

```sql
-- Productos con "radar"
SELECT * FROM products
WHERE title ILIKE '%radar%' OR description ILIKE '%radar%';

-- Productos con "oso"
SELECT * FROM products
WHERE title ILIKE '%oso%' OR description ILIKE '%oso%';

-- Productos con "kayak"
SELECT * FROM products
WHERE title ILIKE '%kayak%' OR description ILIKE '%kayak%';
```

### Contar Productos por Promoción

```sql
SELECT
  pr.code,
  pr.discount,
  COUNT(p.id) AS product_count
FROM promotions pr
LEFT JOIN products p ON p.promo_id = pr.id
GROUP BY pr.id, pr.code, pr.discount
ORDER BY pr.discount DESC;
```

### Productos Sin Promoción

```sql
SELECT id, title, price
FROM products
WHERE promo_id IS NULL
LIMIT 10;
```

### Productos Más Caros

```sql
SELECT id, title, price
FROM products
ORDER BY price DESC
LIMIT 10;
```

## Inicialización Automática

### Comportamiento del init.sql

El script `database/init.sql` se ejecuta **automáticamente** cuando:
1. El contenedor PostgreSQL se crea por primera vez
2. No existe data previa en el volumen

**Proceso**:
1. Crea tabla `promotions`
2. Inserta 6 promociones
3. Crea tabla `products` con constraint `price >= 0`
4. Inserta 100+ productos con categorías variadas
5. Ejecuta queries de verificación

### Re-ejecutar init.sql

Si modificas el script:

```bash
# Opción 1: Eliminar volumen y reiniciar
cd database
docker-compose down -v
docker-compose up -d

# Opción 2: Ejecutar manualmente
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init.sql
```

## Persistencia de Datos

### Volumen Docker

```yaml
volumes:
  - ./pgdata:/var/lib/postgresql/data
```

**Ubicación**: `database/pgdata/`

**Importante**:
- ✅ Este directorio está en `.gitignore`
- ✅ Contiene todos los datos de PostgreSQL
- ✅ Permite persistencia entre reinicios
- ⚠️ Debe eliminarse para reset completo

### Backup Manual

```bash
# Backup
docker exec ecommerce_postgres pg_dump -U postgres ecommerce_db > backup.sql

# Restore
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < backup.sql
```

## Integración con Backend

El backend (NestJS + Prisma) usa esta base de datos:

1. **Prisma Schema** define los mismos modelos
2. **Prisma Client** se genera a partir del schema
3. **Seed Script** (Prisma) puede poblar datos alternativos
4. **Repositorio** ejecuta queries via Prisma ORM

**Connection desde Prisma**:
```typescript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Troubleshooting

### Error: "role postgres does not exist"

**Solución**: El contenedor no se inicializó correctamente.
```bash
docker-compose down -v
docker-compose up -d
```

### Error: "database ecommerce_db does not exist"

**Solución**: El `init.sql` no se ejecutó.
```bash
docker-compose down -v
docker-compose up -d
docker logs ecommerce_postgres  # Verificar logs
```

### Puerto 5432 ya en uso

**Solución**: Otro PostgreSQL está corriendo.
```bash
# Ver qué proceso usa el puerto
lsof -i :5432

# Detener PostgreSQL local (macOS)
brew services stop postgresql

# O cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"  # Usar 5433 en host
```

### Permisos en pgdata/

**Solución** (Linux/macOS):
```bash
sudo chown -R $(whoami) database/pgdata/
```

### Init.sql no se ejecuta después de modificarlo

**Solución**: PostgreSQL solo ejecuta init scripts en contenedores nuevos.
```bash
# Forzar recreación
docker-compose down -v
docker-compose up -d
```

## Decisiones de Diseño

### 1. Por qué PostgreSQL 15

✅ **Robustez**: Base de datos empresarial confiable
✅ **ILIKE**: Búsquedas case-insensitive nativas
✅ **JSON Support**: Extensibilidad futura
✅ **Prisma Support**: ORM compatible

### 2. Por qué Seed Data con Palíndromos

✅ **Testing**: Datos específicos para probar regla de negocio
✅ **Demostrabilidad**: Fácil mostrar funcionalidad
✅ **Cobertura**: Diferentes escenarios (con/sin promo, diferentes %)

### 3. Por qué ON DELETE SET NULL

Cuando se elimina una promoción:
- ✅ Productos mantienen su existencia
- ✅ `promo_id` se vuelve `NULL`
- ✅ No se eliminan productos en cascada

Alternativa considerada: `ON DELETE RESTRICT` (no permite eliminar promo con productos)

### 4. Por qué Volumen Local vs Named Volume

Usamos volumen local (`./pgdata`) en lugar de named volume porque:
- ✅ Más fácil inspeccionar archivos
- ✅ Más fácil hacer backup manual
- ✅ Más explícito en docker-compose.yml

## Sugerencias para Extender el Proyecto

### Normalización de Schema
- Tabla `categories` con relación many-to-many a productos
- Tabla `brands` para marcas de productos
- Tabla `tags` para etiquetado flexible
- Tabla `product_images` para múltiples imágenes por producto

### Sistema de Usuarios y Órdenes
- Tabla `users` con autenticación
- Tabla `addresses` (shipping y billing)
- Tabla `orders` con estados (pending, paid, shipped, delivered)
- Tabla `order_items` (productos en cada orden)
- Tabla `reviews` y `ratings` de productos

### Performance y Búsqueda
- Full-text search con `tsvector` y `tsquery`
- Índices GIN para búsquedas de texto
- Índices B-tree para filtros comunes (price, category_id)
- Índices compuestos para queries frecuentes
- Materialized views para reportes

### Data Management
- Soft deletes con campo `deleted_at`
- Auditoría con campos `created_at`, `updated_at`, `created_by`
- Historial de cambios (tabla `audit_log`)
- Versionado de productos

### Backup y Recuperación
- Scripts automatizados de backup (pg_dump)
- Point-in-time recovery (WAL archiving)
- Backup incremental
- Testing de restore periódico

### Monitoring y Optimización
- Habilitar `pg_stat_statements` para query analysis
- Slow query log
- Connection pooling (PgBouncer)
- Replicación read-only para escalabilidad

### Migrations
- Prisma migrations en lugar de SQL manual
- Schema versioning
- Rollback strategy
- Testing en staging antes de producción

## Recursos

- [PostgreSQL Docs](https://www.postgresql.org/docs/15/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
