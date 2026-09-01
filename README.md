# StockFlow - Gestor de Inventario (Fullstack)

Sistema profesional para la gestión de inventario, catálogo de productos, control de stock por umbrales de alerta y auditoría transaccional de movimientos (entradas y salidas con métodos de pago).

---

## 🏗️ Arquitectura del Monorepo

```text
StockFlow/
├── .gitignore              # Configuración de exclusiones de Git
├── docker-compose.yml      # Orquestación de todos los servicios
├── DOCKER.md               # Guía de despliegue con Docker
├── Database/               # Capa de Base de Datos PostgreSQL
│   ├── schema.sql          # Esquema DDL, constraints, triggers e índices
│   ├── seed.sql            # Datos iniciales de prueba
│   └── README.md           # Guía de base de datos
├── API/                    # Backend REST en Express y PostgreSQL
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── index.js
│   ├── src/                # Arquitectura por capas (routes, controllers, services, repositories)
│   └── README.md
└── Client/                 # Frontend SPA en React (Vite) y Tailwind CSS
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    ├── src/                # Componentes modulares, hooks, páginas y contexto
    └── README.md
```

---

## ⚡ Inicio Rápido

### Opción 1: Con Docker Compose (Recomendado)
```bash
docker compose up -d --build
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **PostgreSQL:** `localhost:5432`

---

### Opción 2: Desarrollo Local

1. **Base de Datos:**
   Ejecuta `Database/schema.sql` y `Database/seed.sql` en tu instancia de PostgreSQL.

2. **Backend API:**
   ```bash
   cd API
   npm install
   npm run dev
   ```

3. **Frontend Client:**
   ```bash
   cd Client
   npm install
   npm run dev
   ```
