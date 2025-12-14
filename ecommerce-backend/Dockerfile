# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client with placeholder DATABASE_URL
# This is only used during build time for code generation, not for actual DB connection
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Regenerate Prisma client in production stage
# Use placeholder for generation, actual DATABASE_URL will be provided at runtime
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]
