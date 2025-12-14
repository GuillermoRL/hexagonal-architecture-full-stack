# Motor de Búsqueda de Productos

## Descripción

Sistema de búsqueda de productos conectado a un backend API, implementado siguiendo las mejores prácticas de Next.js 16 y consultando Context7 como referencia.

## Tecnologías Utilizadas

- **Next.js 16** - App Router con Client Components
- **TypeScript** - Tipado estricto para Product y Promotion
- **Axios** - Cliente HTTP para peticiones al backend
- **React Hooks** - `useState` para manejo de estado
- **Tailwind CSS v4** - Estilos modernos
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos

## Estructura de Tipos

### Promotion
```typescript
interface Promotion {
  id: string;
  code: string;
  discount: number;
}
```

### Product
```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  promo_id: string;
  image_url?: string;  // Opcional
  promotion?: Promotion;  // Opcional
}
```

## Características Implementadas

### 1. Búsqueda de Productos
- ✅ Input de búsqueda con estado controlado
- ✅ Búsqueda al hacer clic en el botón
- ✅ Búsqueda al presionar Enter
- ✅ Botón deshabilitado durante la carga
- ✅ Validación de query vacío

### 2. Estados de la Aplicación
```typescript
const [query, setQuery] = useState("");           // Término de búsqueda
const [products, setProducts] = useState<Product[]>([]);  // Productos encontrados
const [isLoading, setIsLoading] = useState(false);        // Estado de carga
const [hasSearched, setHasSearched] = useState(false);    // Si ya se buscó
```

### 3. Integración con API
```typescript
// GET request con axios
axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
  params: { query }
})
```

**Variable de entorno requerida:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. UI de Productos

#### Imagen del Producto
- **Con imagen:** Muestra `<img>` con `image_url`
- **Sin imagen:** Muestra fallback con letra "P" grande

```tsx
{product.image_url ? (
  <img src={product.image_url} alt={product.title}
       className="h-48 w-full rounded-t-lg object-cover" />
) : (
  <div className="bg-secondary h-48 w-full flex items-center justify-center">
    <span className="text-6xl font-bold text-muted-foreground opacity-20">P</span>
  </div>
)}
```

#### Información del Producto
- **Título:** Negrita, tamaño grande
- **Descripción:** Texto gris, truncado a 2 líneas (`line-clamp-2`)

#### Precios y Promociones

**Sin promoción:**
```tsx
<p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
```

**Con promoción:**
- Precio original tachado en gris
- Badge con código de promoción
- Precio final calculado en verde
- Badge de descuento en la esquina de la imagen

```tsx
<span className="line-through text-muted-foreground">
  ${product.price.toFixed(2)}
</span>
<Badge variant="outline">{product.promotion.code}</Badge>
<p className="text-2xl font-bold text-green-600">
  ${calculateDiscountedPrice(price, discount).toFixed(2)}
</p>
```

### 5. Cálculo de Descuentos
```typescript
const calculateDiscountedPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};
```

### 6. Estados Visuales

#### Loading (Skeletons)
```tsx
{isLoading && (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Skeleton className="h-48 w-full" />
    ))}
  </div>
)}
```

#### Sin Resultados
```tsx
{!isLoading && hasSearched && products.length === 0 && (
  <div className="text-center">
    <p>No se encontraron productos</p>
    <p className="text-sm">Intenta con otros términos de búsqueda</p>
  </div>
)}
```

#### Grid de Productos
- **Móvil:** 1 columna
- **Tablet:** 2 columnas
- **Desktop:** 3 columnas

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

## Componentes Creados

### 1. Badge (`src/components/ui/badge.tsx`)
Componente reutilizable para mostrar etiquetas con variantes:
- `default` - Azul
- `secondary` - Gris
- `destructive` - Rojo
- `outline` - Borde
- `success` - Verde (para descuentos)

### 2. Types (`src/types/product.ts`)
Definiciones TypeScript para Product y Promotion

### 3. Page (`src/app/page.tsx`)
Client Component principal con toda la lógica de búsqueda

## Manejo de Errores

```typescript
try {
  const response = await axios.get(url, { params });
  setProducts(response.data);
} catch (error) {
  console.error("Error fetching products:", error);
  setProducts([]);  // Array vacío en caso de error
} finally {
  setIsLoading(false);  // Siempre detener loading
}
```

## Configuración

### 1. Variables de Entorno
Crea un archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

Configura la URL del backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Ejecutar la Aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## API Backend Esperada

### Endpoint
```
GET /api/products?query={término}
```

### Respuesta Esperada
```json
[
  {
    "id": "1",
    "title": "Producto 1",
    "description": "Descripción del producto",
    "price": 99.99,
    "promo_id": "promo1",
    "image_url": "https://ejemplo.com/imagen.jpg",
    "promotion": {
      "id": "promo1",
      "code": "VERANO2024",
      "discount": 20
    }
  }
]
```

## Mejoras Futuras Sugeridas

- [ ] Paginación de resultados
- [ ] Filtros por categoría/precio
- [ ] Ordenamiento (precio, nombre, relevancia)
- [ ] Debounce en la búsqueda
- [ ] Cache de resultados con SWR o React Query
- [ ] Lazy loading de imágenes
- [ ] SEO con metadata dinámica
- [ ] Loading states más granulares
- [ ] Manejo de errores con toast/notifications

## Referencias

Toda la implementación se basa en las mejores prácticas consultadas en Context7:
- Next.js 16 App Router patterns
- Axios documentation
- React Client Components best practices
- TypeScript strict typing

## Stack Completo

- ✅ Next.js 16.0.10
- ✅ React 19.2.1
- ✅ TypeScript 5
- ✅ Tailwind CSS v4
- ✅ Axios
- ✅ Radix UI
- ✅ Lucide React
