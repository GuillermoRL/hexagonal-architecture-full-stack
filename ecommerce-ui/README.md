# Ecommerce UI

Aplicación frontend de ecommerce construida con Next.js 16, React 19, y TailwindCSS.

## Requisitos

- Node.js 20+
- Docker (opcional, para ejecutar en contenedor)

## Inicio Rápido

### 1. Instalación

```bash
# Instalar dependencias
npm install
```

### 2. Configuración de Variables de Entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm run start
```

La aplicación estará disponible en: `http://localhost:3000`

## Ejecutar con Docker

El frontend puede ejecutarse completamente dentro de un contenedor Docker.

### Construir la imagen Docker

```bash
docker build -t ecommerce-ui .
```

### Ejecutar el contenedor

**Opción 1: Con API local**

Si tu backend está corriendo en tu máquina local:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://host.docker.internal:8080" \
  ecommerce-ui
```

**Opción 2: Con API remota**

Si tu backend está en otro servidor:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="https://tu-api.com" \
  ecommerce-ui
```

**Opción 3: Usando archivo .env**

```bash
docker run -p 3000:3000 --env-file .env.local ecommerce-ui
```

**Notas importantes:**
- El contenedor expone el puerto 3000
- `NEXT_PUBLIC_API_URL` debe ser accesible desde el navegador del usuario (no desde el contenedor)
- Las variables que empiezan con `NEXT_PUBLIC_` son públicas y se incluyen en el bundle del cliente
- `host.docker.internal` apunta a tu máquina local desde dentro del contenedor
- El contenedor corre como usuario no-root (nextjs:nodejs) por seguridad

### Verificar que el contenedor está corriendo

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs del contenedor
docker logs <container-id>

# Ver logs en tiempo real
docker logs -f <container-id>
```

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2
- **State Management**: nuqs (URL state)
- **Estilos**: TailwindCSS 4
- **UI Components**: Radix UI
- **Iconos**: Lucide React
- **HTTP Client**: Axios
- **TypeScript**: 5+

## Estructura del Proyecto

```
src/
├── app/                  # App Router (páginas y layouts)
├── components/           # Componentes reutilizables
│   └── ui/              # Componentes de UI (shadcn/ui)
├── hooks/               # Custom hooks (useProductSearch)
├── lib/                 # Utilidades y helpers
└── types/               # Tipos de TypeScript
```

## Características

- Server-side rendering (SSR) y Static Site Generation (SSG) con Next.js
- Búsqueda de productos con paginación
- Estado en URL con nuqs (búsquedas shareables)
- Diseño responsive con TailwindCSS
- Componentes accesibles con Radix UI
- React Compiler habilitado para optimizaciones automáticas
- Dockerizado para fácil deployment

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Variables de Entorno

### Públicas (accesibles desde el cliente)

- `NEXT_PUBLIC_API_URL` - URL del backend API

## Deploy

### Vercel (Recomendado)

La forma más fácil de deployar es usar [Vercel](https://vercel.com):

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático en cada push

### Docker

Ver sección "Ejecutar con Docker" arriba.

### Otros servicios

Next.js puede deployarse en cualquier servicio que soporte Node.js:
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Digital Ocean
- Heroku
- Railway
- Render

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [nuqs Documentation](https://nuqs.47ng.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives)
