# --- ETAPA 1: Construcción de estáticos (Builder) ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Variable de entorno en tiempo de compilación para Vite
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- ETAPA 2: Servidor Web Nginx (Production) ---
FROM nginx:alpine AS production

# Reemplazamos la configuración por defecto de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos la carpeta dist/ generada por Vite hacia la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]