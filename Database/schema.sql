-- ==============================================================================
-- GESTOR DE INVENTARIO - ESQUEMA DE BASE DE DATOS POSTGRESQL (DDL)
-- ==============================================================================
-- Motor: PostgreSQL 12+
-- Ubicación: /Database/schema.sql
-- ==============================================================================

-- 1. Eliminación limpia previa (en orden inverso de dependencias)
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS movements CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. Función y Trigger para actualización automática de 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABLA: products (Catálogo de Artículos e Inventario)
-- ==============================================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    purchase_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (purchase_price >= 0),
    sale_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (sale_price >= 0),
    current_stock INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    min_stock INT NOT NULL DEFAULT 5 CHECK (min_stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para mantener actualizado 'updated_at' en products
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. TABLA: stock_movements (Auditoría de Entradas y Salidas de Mercancía)
-- ==============================================================================
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT', 'ENTRADA', 'SALIDA')),
    quantity INT NOT NULL CHECK (quantity > 0),
    reason VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) DEFAULT NULL CHECK (payment_method IS NULL OR payment_method IN ('Efectivo', 'Transferencia', 'EFECTIVO', 'TRANSFERENCIA')),
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_movements_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

-- ==============================================================================
-- 5. VISTA DE COMPATIBILIDAD (Para consultas como 'movements')
-- ==============================================================================
CREATE OR REPLACE VIEW movements AS
SELECT 
    id,
    product_id,
    type,
    quantity,
    reason,
    payment_method,
    notes,
    created_at
FROM stock_movements;

-- ==============================================================================
-- 6. ÍNDICES DE RENDIMIENTO (B-TREE)
-- ==============================================================================
-- Optimización de búsquedas por SKU (código único de producto)
CREATE INDEX idx_products_sku ON products (sku);

-- Optimización de filtros por categoría
CREATE INDEX idx_products_category ON products (category);

-- Optimización de consultas de stock crítico / alertas
CREATE INDEX idx_products_stock_alert ON products (current_stock, min_stock);

-- Optimización de consultas de historial y joins por producto
CREATE INDEX idx_stock_movements_product_id ON stock_movements (product_id);

-- Optimización de ordenamiento cronológico de auditoría
CREATE INDEX idx_stock_movements_created_at ON stock_movements (created_at DESC);

-- ==============================================================================
-- 7. COMENTARIOS DE DOCUMENTACIÓN DEL ESQUEMA
-- ==============================================================================
COMMENT ON TABLE products IS 'Catálogo maestro de productos con control de precios y umbrales de stock.';
COMMENT ON COLUMN products.sku IS 'Código único de identificación del producto (Stock Keeping Unit).';
COMMENT ON COLUMN products.current_stock IS 'Existencias físicas actuales en almacén.';
COMMENT ON COLUMN products.min_stock IS 'Punto de reorden o umbral para disparar alerta de stock bajo.';

COMMENT ON TABLE stock_movements IS 'Registro transaccional de auditoría de entradas y salidas de inventario.';
COMMENT ON COLUMN stock_movements.type IS 'Dirección del movimiento: IN/ENTRADA (Reabastecimiento) o OUT/SALIDA (Venta/Ajuste).';
COMMENT ON COLUMN stock_movements.payment_method IS 'Método de pago en caso de salida por venta (Efectivo o Transferencia).';
