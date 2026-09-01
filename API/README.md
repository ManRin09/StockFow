# Gestor de Inventario - Backend API (Express.js & PostgreSQL)

API REST modular construida con Node.js, Express y PostgreSQL para la gestión integral de productos, control transaccional de inventario (entradas y salidas) y estadísticas agregadas.

---

## 🏛️ Arquitectura por Capas

El backend sigue el patrón arquitectónico en capas con separación estricta de responsabilidades:

```text
API/
├── index.js                      # Punto de entrada y arranque del servidor
├── package.json                  # Dependencias y scripts
├── .env                          # Variables de entorno locales
├── .env.example                  # Plantilla de variables de entorno
└── src/
    ├── app.js                    # Configuración de Express, CORS y middlewares
    ├── config/
    │   └── db.js                 # Pool de conexiones a PostgreSQL (pg)
    ├── routes/                   # Definición de rutas HTTP y endpoints
    │   ├── index.js              # Enrutador central (/api)
    │   ├── product.routes.js     # Endpoints de productos
    │   ├── movement.routes.js    # Endpoints de movimientos de stock
    │   └── dashboard.routes.js   # Endpoints de estadísticas y métricas
    ├── controllers/              # Manejo de request/response y códigos de estado
    │   ├── product.controller.js
    │   ├── movement.controller.js
    │   └── dashboard.controller.js
    ├── services/                 # Lógica de negocio pura, validaciones y reglas
    │   ├── product.service.js
    │   ├── movement.service.js
    │   └── dashboard.service.js
    ├── repositories/             # Capa de persistencia y consultas SQL directas
    │   ├── product.repository.js
    │   ├── movement.repository.js
    │   └── dashboard.repository.js
    └── middlewares/              # Middlewares compartidos
        ├── errorHandler.js       # Manejador centralizado de errores y excepciones
        └── validateRequest.js    # Validación de sintaxis y campos requeridos
```

---

## ⚙️ Variables de Entorno (.env)

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto donde corre el servidor Express | `5000` |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) | `development` |
| `DATABASE_URL` | Cadena de conexión completa a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/inventory_db` |
| `DB_HOST` | Host de la base de datos (alternativa a `DATABASE_URL`) | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `DB_NAME` | Nombre de la base de datos | `inventory_db` |
| `CORS_ORIGIN` | Origen permitido para solicitudes frontend | `http://localhost:3000` |

---

## 🔌 Especificación de Endpoints

Base URL: `http://localhost:5000/api`

### 1. Módulo de Productos (`/api/products`)
- **`GET /api/products`**: Obtiene la lista de productos.
  - *Query Params opcionales:* `search`, `category`, `stockStatus` (`IN_STOCK` | `LOW_STOCK` | `OUT_OF_STOCK`), `sortBy`, `sortOrder` (`ASC` | `DESC`).
- **`GET /api/products/low-stock`**: Lista productos con stock menor o igual a su stock mínimo.
- **`GET /api/products/:id`**: Obtiene el detalle de un producto específico.
- **`POST /api/products`**: Registra un nuevo producto.
  - *Body (JSON):*
    ```json
    {
      "sku": "PROD-101",
      "name": "Monitor Curvo 34\"",
      "category": "Monitores",
      "purchasePrice": 320.00,
      "sellingPrice": 489.99,
      "currentStock": 8,
      "minStock": 3
    }
    ```
- **`PUT /api/products/:id`**: Actualiza los datos de un producto.
- **`DELETE /api/products/:id`**: Elimina un producto.

---

### 2. Módulo de Movimientos (`/api/movements`)
- **`GET /api/movements`**: Obtiene el historial de movimientos ordenados por fecha descendente.
  - *Query Params opcionales:* `productId`, `type` (`ENTRADA` | `SALIDA`), `search`, `limit`, `offset`.
- **`POST /api/movements`**: Registra una entrada o salida con **transacción SQL atómica** y bloqueo pesimista (`FOR UPDATE`) para actualizar el stock del producto de forma segura.
  - *Body (JSON):*
    ```json
    {
      "productId": "1",
      "type": "ENTRADA",
      "quantity": 15,
      "reason": "Reabastecimiento de Proveedor",
      "notes": "Factura #F-8921"
    }
    ```
- **`GET /api/movements/summary`**: Resumen numérico agrupado por tipo de movimiento.

---

### 3. Módulo de Dashboard (`/api/dashboard`)
- **`GET /api/dashboard/stats`**: Retorna métricas cuantitativas y económicas:
  - `totalProducts`: Total de artículos registrados.
  - `totalStockUnits`: Unidades físicas totales en almacén.
  - `totalInventoryValue`: Valor total monetario calculado a costo de compra.
  - `totalPotentialRevenue`: Valor total potencial estimado a precio de venta.
  - `lowStockCount`: Conteo de productos con stock bajo.
  - `outOfStockCount`: Conteo de productos agotados.
  - `recentMovements`: Últimos 5 movimientos con datos del producto asociado.
  - `criticalProducts`: Lista de productos prioritarios para reabastecimiento.

---

## 🚀 Instalación y Ejecución

1. Entra al directorio `API`:
   ```bash
   cd API
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la API en modo desarrollo con recarga automática:
   ```bash
   npm run dev
   ```
   O en modo producción:
   ```bash
   npm start
   ```
