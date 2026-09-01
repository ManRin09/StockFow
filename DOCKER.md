# Guía de Despliegue con Docker y Docker Compose

Esta guía te permitirá desplegar todo el sistema (**PostgreSQL 15**, **API Express** y **Frontend React Nginx**) en contenedores aislados con un solo comando.

---

## 🏗️ Servicios Orquestados

| Servicio | Contenedor | Puerto Host | Descripción |
| :--- | :--- | :--- | :--- |
| **`postgres_db`** | `inventory_postgres` | `5432` | Base de datos PostgreSQL con carga automática de `schema.sql` y `seed.sql`. |
| **`backend_api`** | `inventory_backend` | `5000` | API REST en Node.js Express conectada internamente a la base de datos. |
| **`frontend_client`** | `inventory_frontend` | `3000` | SPA React optimizada servida con servidor web Nginx y proxy inverso a la API. |

---

## 🚀 Comandos de Ejecución

### 1. Iniciar todos los contenedores
Desde la raíz del proyecto (`/Gestor inventario`):
```bash
docker compose up -d --build
```
> **Nota:** La bandera `-d` ejecuta los contenedores en segundo plano (detached mode) y `--build` compila las imágenes actualizadas.

### 2. Acceder a las aplicaciones
- **Frontend Web:** [http://localhost:3000](http://localhost:3000)
- **API REST (Health Check):** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Base de Datos PostgreSQL:** `localhost:5432` (Usuario: `postgres`, Password: `postgres`, BD: `inventory_db`)

---

## 🛠️ Comandos de Monitoreo y Mantenimiento

### Ver el estado de los contenedores:
```bash
docker compose ps
```

### Ver logs en tiempo real:
```bash
# Todos los servicios
docker compose logs -f

# Solo del backend API
docker compose logs -f backend_api

# Solo del frontend
docker compose logs -f frontend_client

# Solo de PostgreSQL
docker compose logs -f postgres_db
```

### Detener los servicios:
```bash
docker compose down
```

### Detener y eliminar volúmenes (Reinicio desde cero de la base de datos):
```bash
docker compose down -v
```

### Reiniciar un servicio específico:
```bash
docker compose restart backend_api
```

---

## 🔒 Variables de Entorno Opcionales

Puedes crear un archivo `.env` en la raíz del proyecto para personalizar los parámetros:
```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=inventory_db
DB_PORT=5432
```
