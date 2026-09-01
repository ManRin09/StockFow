-- ==============================================================================
-- GESTOR DE INVENTARIO - DATOS INICIALES DE PRUEBA (DML SEED)
-- ==============================================================================
-- Ubicación: /Database/seed.sql
-- ==============================================================================

BEGIN;

-- 1. Limpieza de datos previos (manteniendo la estructura)
TRUNCATE TABLE stock_movements, products RESTART IDENTITY CASCADE;

-- 2. Inserción de Productos de Prueba en 'products'
INSERT INTO products (sku, name, category, purchase_price, sale_price, current_stock, min_stock, created_at, updated_at)
VALUES
    ('PROD-001', 'Laptop Dell Inspiron 15 Core i7', 'Electrónica', 650.00, 899.99, 14, 5, NOW() - INTERVAL '30 days', NOW()),
    ('PROD-002', 'Mouse Inalámbrico Logitech MX Master 3S', 'Accesorios', 45.00, 79.90, 3, 8, NOW() - INTERVAL '25 days', NOW()),
    ('PROD-003', 'Teclado Mecánico Redragon RGB Switch Blue', 'Accesorios', 32.50, 58.00, 25, 10, NOW() - INTERVAL '20 days', NOW()),
    ('PROD-004', 'Monitor Gamer ASUS TUF 27" 165Hz IPS', 'Monitores', 175.00, 249.99, 2, 4, NOW() - INTERVAL '15 days', NOW()),
    ('PROD-005', 'Silla Ergonómica Mesh Transpirable Ejecutiva', 'Mobiliario', 95.00, 169.00, 0, 3, NOW() - INTERVAL '10 days', NOW()),
    ('PROD-006', 'Cable HDMI 2.1 8K Ultra High Speed 2 Metros', 'Cables', 3.80, 12.50, 50, 15, NOW() - INTERVAL '5 days', NOW()),
    ('PROD-007', 'Disco Sólido SSD NVMe M.2 Kingston 1TB', 'Componentes', 42.00, 69.90, 18, 6, NOW() - INTERVAL '2 days', NOW());

-- 3. Inserción de Movimientos de Auditoría en 'stock_movements'
INSERT INTO stock_movements (product_id, type, quantity, reason, payment_method, notes, created_at)
VALUES
    (
        1, 
        'ENTRADA', 
        10, 
        'Reabastecimiento de Proveedor', 
        NULL, 
        'Factura de Importación #F-90218', 
        NOW() - INTERVAL '3 days'
    ),
    (
        2, 
        'SALIDA', 
        5, 
        'Venta a Cliente en Mostrador', 
        'Efectivo', 
        'Comprobante de Venta Directa #V-1002', 
        NOW() - INTERVAL '2 days'
    ),
    (
        4, 
        'SALIDA', 
        2, 
        'Venta Online con Envío', 
        'Transferencia', 
        'Pedido Web #ORD-84920 - Transferencia Bancaria', 
        NOW() - INTERVAL '1 day'
    ),
    (
        5, 
        'SALIDA', 
        2, 
        'Merma / Daño en Bodega', 
        NULL, 
        'Reporte de Merma y Garantía #R-04', 
        NOW() - INTERVAL '12 hours'
    ),
    (
        6, 
        'ENTRADA', 
        30, 
        'Compra de Lote con Descuento', 
        NULL, 
        'Orden de Compra #OC-3301', 
        NOW() - INTERVAL '2 hours'
    );

COMMIT;

-- 4. Verificación de Inserción
SELECT 'Total Productos Insertados:' AS resumen, COUNT(*) AS cantidad FROM products
UNION ALL
SELECT 'Total Movimientos Insertados:' AS resumen, COUNT(*) AS cantidad FROM stock_movements;
