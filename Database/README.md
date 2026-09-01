# Gestor de Inventario - Base de Datos (PostgreSQL)

Guía completa para la creación del esquema DDL, restricciones de integridad, índices y carga de datos iniciales en **PostgreSQL**.

---

## 📁 Archivos del Módulo

- **[`schema.sql`](file:///c:/Users/pc/Downloads/Gestor%20inventario/Database/schema.sql):** Script DDL con la creación de tablas (`products`, `stock_movements`), claves primarias, claves foráneas, restricciones de validación `CHECK`, triggers automáticos para `updated_at` e índices B-Tree de rendimiento.
- **[`seed.sql`](file:///c:/Users/pc/Downloads/Gestor%20inventario/Database/seed.sql):** Script DML transaccional (`BEGIN / COMMIT`) con datos de prueba realistas para productos y movimientos de auditoría con métodos de pago (`Efectivo` y `Transferencia`).

---

## 🗄️ Esquema Relacional

```text
+-------------------------------------------------------------+
|                          products                           |
+-------------------------------------------------------------+
| id             : SERIAL (PK)                                |
| sku            : VARCHAR(50) UNIQUE NOT NULL                |
| name           : VARCHAR(150) NOT NULL                      |
| category       : VARCHAR(50) NOT NULL                       |
| purchase_price : NUMERIC(10, 2) NOT NULL (CHECK >= 0)       |
| sale_price     : NUMERIC(10, 2) NOT NULL (CHECK >= 0)       |
| current_stock  : INT NOT NULL DEFAULT 0 (CHECK >= 0)        |
| min_stock      : INT NOT NULL DEFAULT 5 (CHECK >= 0)        |
| created_at     : TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP     |
| updated_at     : TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP     |
+-------------------------------------------------------------+
                              | 1
                              |
                              | N (ON DELETE CASCADE)
                              v
+-------------------------------------------------------------+
|                       stock_movements                       |
+-------------------------------------------------------------+
| id             : SERIAL (PK)                                |
| product_id     : INT (FK -> products.id)                    |
| type           : VARCHAR(10) (CHECK: IN, OUT, ENTRADA, etc) |
| quantity       : INT (CHECK > 0)                            |
| reason         : VARCHAR(255) NOT NULL                      |
| payment_method : VARCHAR(50) NULL (Efectivo | Transferencia)|
| notes          : TEXT NULL                                  |
| created_at     : TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP     |
+-------------------------------------------------------------+
```

---

## 🚀 Guía de Ejecución Paso a Paso

### Opción A: Desde la Terminal (`psql` CLI)

1. **Acceder a PostgreSQL y crear la base de datos:**
   ```bash
   psql -U postgres
   ```
   Dentro de la consola interactiva de PostgreSQL:
   ```sql
   CREATE DATABASE inventory_db;
   \c inventory_db
   ```

2. **Ejecutar el esquema DDL (`schema.sql`):**
   ```bash
   psql -U postgres -d inventory_db -f Database/schema.sql
   ```

3. **(Opcional) Cargar los datos de prueba (`seed.sql`):**
   ```bash
   psql -U postgres -d inventory_db -f Database/seed.sql
   ```

---

### Opción B: Mediante Interfaz Gráfica (pgAdmin 4)

1. Abre **pgAdmin 4** y conéctate a tu servidor local.
2. Haz clic derecho sobre **Databases** -> **Create** -> **Database...**
   - Nombre: `inventory_db` -> Haz clic en **Save**.
3. Selecciona la base de datos `inventory_db` recién creada.
4. Abre la herramienta de consultas (**Tools** -> **Query Tool**).
5. Abre y pega el contenido de `Database/schema.sql` y presiona **Execute / F5**.
6. (Opcional) Abre y pega el contenido de `Database/seed.sql` y presiona **Execute / F5**.

---

### Opción C: Mediante DBeaver

1. Crea una nueva conexión hacia PostgreSQL (Host: `localhost`, Puerto: `5432`, Usuario: `postgres`, BD: `postgres`).
2. Haz clic derecho en **Databases** -> **Create New Database** -> Nombre: `inventory_db`.
3. Haz doble clic en `inventory_db` para seleccionarla como la conexión activa.
4. Abre un nuevo SQL Editor (**SQL Editor** -> **New SQL Script**).
5. Ejecuta primero el contenido de `schema.sql` y posteriormente el de `seed.sql`.

---

## 🔍 Consultas de Verificación y Diagnóstico

### 1. Resumen general de stock y alertas
```sql
SELECT 
    p.sku,
    p.name,
    p.category,
    p.current_stock,
    p.min_stock,
    CASE 
        WHEN p.current_stock <= 0 THEN 'AGOTADO'
        WHEN p.current_stock <= p.min_stock THEN 'STOCK BAJO'
        ELSE 'EN STOCK'
    END AS estado_alerta,
    p.purchase_price,
    p.sale_price,
    (p.current_stock * p.purchase_price) AS valor_inventario
FROM products p
ORDER BY p.current_stock ASC;
```

### 2. Historial de movimientos con producto y método de pago
```sql
SELECT 
    sm.id,
    sm.created_at AS fecha,
    sm.type AS tipo_movimiento,
    p.sku,
    p.name AS producto,
    sm.quantity AS cantidad,
    sm.payment_method AS metodo_pago,
    sm.reason AS motivo,
    sm.notes
FROM stock_movements sm
JOIN products p ON sm.product_id = p.id
ORDER BY sm.created_at DESC;
```
