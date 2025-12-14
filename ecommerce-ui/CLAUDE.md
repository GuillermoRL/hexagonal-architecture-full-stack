# Ecommerce Frontend - Contexto del Proyecto

## Descripción General

Frontend de ecommerce construido con Next.js 16 + React 19 siguiendo **Arquitectura Hexagonal (Ports & Adapters)**. Implementa búsqueda de productos con indicador visual (bordeado verde) para productos con descuento por palíndromo.

## Stack Tecnológico

- **Framework**: Next.js 16.0 (App Router)
- **React**: 19.x
- **TypeScript**: 5.x
- **Styling**: TailwindCSS 3.x
- **Components**: Radix UI (primitivos accesibles)
- **State Management**: nuqs (estado en URL)
- **HTTP Client**: Axios
- **Testing**: Vitest + @testing-library/react
- **Runtime**: Node.js 20

## Arquitectura Hexagonal

El proyecto sigue el patrón **Ports and Adapters** con separación de capas:

### Estructura de Capas

```
src/
├── domain/                          # Capa de Dominio (Core)
│   ├── entities/                    # Entidades de negocio
│   │   ├── product.entity.ts        # Product con métodos de formato
│   │   └── promotion.entity.ts      # Promotion con descuentos
│   └── repositories/                # Ports (interfaces)
│       └── product.repository.ts    # Interfaz del repositorio
├── application/                     # Capa de Aplicación
│   └── use-cases/
│       └── search-products/
│           └── search-products.use-case.ts   # Orquesta búsqueda
├── infrastructure/                  # Capa de Infraestructura (Adapters)
│   └── http/
│       ├── repositories/
│       │   └── http-product.repository.ts    # Implementa Port
│       └── mappers/
│           └── product.mapper.ts             # API Response → Entity
├── hooks/                           # React Hooks
│   └── useProductSearch.ts          # Hook que usa el use case
├── components/                      # Componentes React
│   ├── ui/                          # Componentes base (Radix UI)
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── ProductCard.tsx              # Muestra bordeado verde
│   └── SearchPage.tsx               # Página de búsqueda
└── app/                             # Next.js App Router
    ├── layout.tsx                   # Root layout con NuqsAdapter
    └── page.tsx                     # Home page
```

### Principios Aplicados

✅ **Dependency Inversion**: Hooks usan interfaces, no implementaciones directas
✅ **Single Responsibility**: Componentes enfocados, hooks específicos
✅ **Separation of Concerns**: UI separada de lógica de negocio
✅ **Testability**: Fácil mock de repositorios y use cases

## Reglas de Negocio (Frontend)

### Indicador Visual de Palíndromo

Cuando `product.isPalindromeDiscount === true`:
- **ProductCard** aplica clases CSS: `ring-4 ring-green-500`
- Muestra badge "PALINDROME" con 50% OFF
- Precio original tachado, precio final en verde

**Implementación**:
```tsx
<Card className={`... ${
  product.isPalindromeDiscount ? 'ring-4 ring-green-500' : ''
}`}>
```

### Estado en URL (nuqs)

El query de búsqueda se sincroniza con la URL:
```tsx
const [query, setQuery] = useQueryState('query', {
  defaultValue: '',
  shallow: false,
});
```

**Beneficios**:
- URLs compartibles: `/?query=radar`
- Navegación con back/forward funciona
- Estado persiste en refresh

## Componentes Principales

### ProductCard

**Props**: `{ product: Product }`

**Responsabilidades**:
- Renderiza imagen o placeholder
- Muestra badge de promoción
- Aplica bordeado verde si `isPalindromeDiscount`
- Formatea precios usando métodos de la entidad

**Testing**: 7 tests cubriendo todos los casos

### SearchBar

**Props**: `{ query, isLoading, onQueryChange }`

**Responsabilidades**:
- Input controlado para búsqueda
- Muestra estado de loading
- Emite cambios al parent

### SearchPage

**Responsabilidades**:
- Usa `useQueryState` para estado en URL
- Llama a `useProductSearch` hook
- Renderiza grid de ProductCards
- Maneja estados: loading, error, empty

### Header

**Responsabilidades**:
- Barra de navegación
- Logo/título de la app

## Hooks Personalizados

### useProductSearch

**Signature**:
```typescript
function useProductSearch(query: string | null): {
  products: Product[],
  isLoading: boolean,
  error: string,
  hasSearched: boolean
}
```

**Implementación**:
```typescript
const searchProductsUseCase = useMemo(() => {
  const repository = new HttpProductRepository();
  return new SearchProductsUseCase(repository);
}, []);

useEffect(() => {
  // Ejecuta búsqueda cuando query cambia
  const result = await searchProductsUseCase.execute(query, 0, 20);
  setProducts(result.products);
}, [query, searchProductsUseCase]);
```

**Decisiones**:
- **useMemo** para evitar recrear use case en cada render
- **useEffect** para búsqueda automática al cambiar query
- Maneja estados: loading, error, empty results

## Testing

### Configuración: Vitest + Testing Library

**Scripts**:
```bash
npm test              # Ejecutar tests
npm run test:watch    # Modo watch
npm run test:cov      # Con cobertura
```

### Cobertura de Tests (26 tests)

✅ **Domain Entities**:
- `product.entity.test.ts` (9 tests)
- `promotion.entity.test.ts` (4 tests)

✅ **Infrastructure Mappers**:
- `product.mapper.test.ts` (6 tests)

✅ **Components**:
- `ProductCard.test.tsx` (7 tests)

### Estrategia de Testing

- **Componentes**: Renderizado, props, estilos condicionales
- **Entidades**: Métodos de cálculo y formato
- **Mappers**: Transformación API → Domain
- **No se testean pages** (solo componentes)

## Configuración

### Variables de Entorno (.env.local)

```bash
NEXT_PUBLIC_API_URL="http://localhost:8080"
```

**Importante**: Variables con `NEXT_PUBLIC_` se exponen al cliente.

### Next.js Config

**next.config.ts**:
```typescript
export default {
  output: 'standalone',  // Para Docker
  // ...
}
```

### Tailwind Config

Configurado con Radix UI colors y componentes personalizados en `components/ui/`.

## Docker

### Multi-stage Build

**Stage 1 (builder)**:
1. Instala dependencias
2. Copia código fuente
3. Ejecuta `next build` (genera `.next/` y standalone)

**Stage 2 (runner)**:
1. Copia solo standalone output
2. Copia archivos estáticos (.next/static, public)
3. Usuario no-root (nextjs:nodejs)
4. Expone puerto 3000

### Variables de Entorno en Docker

```yaml
environment:
  NEXT_PUBLIC_API_URL: "http://localhost:8080"
  NODE_ENV: production
```

## Decisiones de Arquitectura

### 1. Por qué Arquitectura Hexagonal

✅ **Separación de concerns**: UI no conoce detalles HTTP
✅ **Testabilidad**: Fácil mockear HTTP con repository fake
✅ **Reutilización**: Entidades compartibles entre componentes
✅ **Mantenibilidad**: Cambiar de axios a fetch no afecta componentes

### 2. Entidades en Frontend

**Sí incluir lógica de negocio**:
```typescript
class Product {
  get finalPrice(): number { ... }
  getFormattedPrice(): string { ... }
  hasPromotion(): boolean { ... }
}
```

**Beneficios**:
- Evita lógica duplicada en componentes
- Único lugar de verdad para cálculos
- Más fácil de testear

### 3. Estado en URL (nuqs) vs useState

**nuqs** para:
- ✅ Query de búsqueda (compartible, persistente)
- ✅ Filtros (page, sort, etc.)

**useState** para:
- ✅ Estado temporal de UI (modales, dropdowns)
- ✅ Estados efímeros

### 4. Server vs Client Components

**Server Components** (default):
- Layout
- Pages estáticas

**Client Components** (`"use client"`):
- SearchPage (usa hooks de estado)
- ProductCard (interactividad)
- SearchBar (input controlado)

### 5. Suspense para useQueryState

Next.js 16 requiere `<Suspense>` para componentes que usan search params:
```tsx
<Suspense fallback={<LoadingGrid />}>
  <SearchPage />
</Suspense>
```

### 6. Mappers: API → Domain

**No usar tipos API en componentes**:
```typescript
// ❌ Malo
interface ProductCardProps {
  product: ApiProduct  // Tipo de API
}

// ✅ Bueno
interface ProductCardProps {
  product: Product  // Entidad de dominio
}
```

### 7. Axios vs Fetch

Decidimos **Axios** por:
- Interceptors fáciles
- Transformación automática de JSON
- Manejo de errores más limpio
- Cancelación de requests

## Componentes UI (Radix UI)

Base primitivos en `components/ui/`:
- `card.tsx` - Contenedor con variantes
- `badge.tsx` - Labels y tags
- `button.tsx` - Botones accesibles

Todos siguen patrón:
```tsx
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("...", className)} {...props} />
))
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Modo desarrollo (puerto 3000)

# Producción
npm run build         # Build optimizado
npm run start         # Servir build

# Testing
npm test              # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:cov      # Tests con cobertura

# Linting
npm run lint          # ESLint
```

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar .env.local
cp .env.example .env.local

# Iniciar desarrollo
npm run dev

# Ejecutar tests
npm test

# Ver cobertura
npm run test:cov

# Build para producción
npm run build
npm run start
```

## Convenciones de Código

### Naming

- **Componentes**: `PascalCase.tsx`
- **Hooks**: `use*.ts`
- **Utilities**: `kebab-case.ts`
- **Types**: `PascalCase` (sin prefijo I)

### Estructura de Componentes

```tsx
// 1. Imports
import { ... } from '...'

// 2. Types
interface ComponentProps { ... }

// 3. Component
export const Component = ({ prop }: ComponentProps) => {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Handlers
  const handleClick = () => { ... }

  // 6. Render
  return (...)
}
```

### CSS Classes

- Usar TailwindCSS utility-first
- Agrupar por responsabilidad:
  ```tsx
  className="
    flex items-center gap-2     // Layout
    p-4 rounded-lg              // Spacing & borders
    bg-white text-gray-900      // Colors
    hover:shadow-lg             // Interactive states
  "
  ```

### Testing

- Tests junto al componente: `Component.test.tsx`
- Usar `describe` y `it`
- Testing Library queries: `getByRole`, `getByText`
- Aserciones: `expect().toBeInTheDocument()`

## Troubleshooting

### Error: "useSearchParams() should be wrapped in a suspense boundary"

**Solución**: Envolver componente que usa `useQueryState` en `<Suspense>`:
```tsx
<Suspense fallback={<Loading />}>
  <ComponentWithQueryState />
</Suspense>
```

### Error: Module not found '@/...'

**Solución**: Verificar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tests fallan con error de imports

**Solución**: Agregar alias en `vitest.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Componentes Radix no se ven correctamente

**Solución**: Verificar que TailwindCSS procesa `components/ui/*.tsx`:
```javascript
// tailwind.config.ts
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
]
```

## Sugerencias para Extender el Proyecto

### Features de Usuario
- Sistema de carrito de compras (con persistencia local)
- Wishlist / favoritos
- Historial de búsquedas
- Comparador de productos
- Reviews y ratings

### Navegación y UX
- Paginación con page param en URL
- Infinite scroll como alternativa
- Filtros avanzados (precio, categorías, rating)
- Ordenamiento (precio, popularidad, fecha)
- Breadcrumbs para navegación
- Detalle de producto (ruta dinámica `/products/[id]`)

### Performance
- Skeleton loaders mejorados
- Lazy loading de imágenes
- Prefetching de datos
- Optimistic UI updates
- Service Worker para offline

### Autenticación y Personalización
- Login/Registro (si backend lo soporta)
- Perfil de usuario
- Direcciones guardadas
- Métodos de pago guardados

### Testing Avanzado
- Tests E2E con Playwright o Cypress
- Visual regression testing (Percy, Chromatic)
- Accessibility testing (axe-core)
- Performance testing (Lighthouse CI)

### Analytics y Monitoreo
- Google Analytics o Plausible
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- A/B testing

### Progressive Web App
- Service worker para offline
- Manifest.json
- Push notifications
- Install prompts

### Accesibilidad
- ARIA labels completos
- Keyboard navigation mejorado
- Screen reader testing
- Contraste de colores WCAG AAA

## Recursos

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Radix UI](https://www.radix-ui.com)
- [nuqs](https://nuqs.47ng.com)
- [TailwindCSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com/react)
