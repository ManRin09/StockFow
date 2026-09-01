# ==============================================================================
# Dockerfile para la API Backend (Node.js Express)
# ==============================================================================
FROM node:18-alpine AS base

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar el código fuente
COPY src/ ./src/
COPY index.js ./

# Definir variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=5000

# Exponer el puerto de la API
EXPOSE 5000

# Usuario no root para mayor seguridad
USER node

# Comando de arranque
CMD ["node", "index.js"]
