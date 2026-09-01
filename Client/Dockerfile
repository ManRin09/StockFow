# ==============================================================================
# Etapa 1: Build de la aplicación React con Vite
# ==============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Argumentos de compilación opcionales para la URL de la API
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ==============================================================================
# Etapa 2: Servidor Nginx Alpine para servir los archivos compilados
# ==============================================================================
FROM nginx:1.25-alpine AS runner

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el bundle de producción generado por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
