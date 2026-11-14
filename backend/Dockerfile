# --- ETAPA 1: Compilación (Builder) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos primero los manifiestos para aprovechar la caché de capas de Docker
COPY package*.json ./
RUN npm ci

# Copiamos el código fuente y compilamos TypeScript a JavaScript (carpeta dist/)
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- ETAPA 2: Producción (Runner) ---
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Instalamos ÚNICAMENTE dependencias de producción (sin TypeScript ni @types)
COPY package*.json ./
RUN npm ci --omit=dev

# Traemos solo el código ya compilado desde la Etapa 1
COPY --from=builder /app/dist ./dist

# Por seguridad, ejecutamos la app con un usuario sin permisos de administrador (root)
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]