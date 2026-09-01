# Gestor de Inventario - Frontend (Client)

Aplicación frontend modular para la gestión integral de inventario, control de stock y auditoría de entradas y salidas, construida con React (Vite) y Tailwind CSS.

## 🚀 Tecnologías Principales
- **React 18** (Vite)
- **React Router DOM v6** (Navegación SPA)
- **Axios** (Integración HTTP con interceptores)
- **Tailwind CSS** (Diseño moderno, fluido y responsivo)
- **Lucide React** (Iconografía consistente)

---

## 📁 Arquitectura del Proyecto

```text
Client/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx                       # Punto de entrada (Providers + Router)
    ├── App.jsx                        # Layout general y configuración de rutas
    ├── index.css                      # Estilos globales y utilidades Tailwind
    ├── assets/                        # Recursos visuales y estilos
    ├── components/
    │   ├── common/                    # Componentes UI reutilizables
    │   │   ├── Navbar.jsx             # Barra superior con estado de conexión
    │   │   ├── Sidebar.jsx            # Barra lateral de navegación
    │   │   ├── Modal.jsx              # Diálogo modal accesible
    │   │   ├── Table.jsx              # Tabla de datos estilizada
    │   │   ├── Card.jsx               # Tarjetas y métricas KPI
    │   │   ├── Button.jsx             # Botón multi-variante con spinners
    │   │   ├── Input.jsx              # Campos de texto con validación
    │   │   ├── LoadingSpinner.jsx     # Estados de carga y skeletons
    │   │   └── ConfirmDialog.jsx      # Modal de confirmación para borrado
    │   └── inventory/                 # Componentes del dominio de inventario
    │       ├── ProductForm.jsx        # Formulario de alta y edición
    │       ├── ProductList.jsx        # Catálogo interactivo con filtros
    │       ├── StockAlertBadge.jsx    # Badge de nivel de stock
    │       ├── MovementHistory.jsx    # Historial de entradas y salidas
    │       └── StockMovementModal.jsx # Modal para registrar movimientos
    ├── pages/                         # Vistas principales
    │   ├── Dashboard.jsx              # KPIs, alertas y resumen
    │   ├── ProductsPage.jsx           # Catálogo y CRUD de productos
    │   ├── StockMovementsPage.jsx     # Auditoría de movimientos
    │   └── NotFound.jsx               # Vista 404
    ├── services/                      # Capa HTTP
    │   ├── api.js                     # Instancia Axios con interceptores
    │   ├── productService.js          # Endpoints de productos
    │   └── movementService.js         # Endpoints de movimientos
    ├── hooks/                         # Custom Hooks
    │   ├── useProducts.js             # Lógica de filtrado, búsqueda y orden
    │   └── useModal.js                # Control de modales y payloads
    └── context/
        └── InventoryContext.jsx       # Estado global, métricas y notificaciones
```

---

## ⚙️ Configuración y Ejecución

### 1. Instalar dependencias
Desde la carpeta `Client`:
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:3000` (o el puerto asignado por Vite).

### 3. Conexión con el Backend Express
Por defecto, Axios se conecta a:
```
http://localhost:5000/api
```
Para personalizar la URL, puedes crear un archivo `.env` dentro de `/Client`:
```env
VITE_API_URL=http://localhost:5000/api
```

> **Nota:** La aplicación incluye un modo fallback offline automático. Si el backend en el puerto 5000 aún no está en ejecución, la interfaz cargará datos de demostración interactivos y te permitirá probar todas las funcionalidades (creación, edición, filtrado, registro de entradas/salidas y alertas) sin interrumpir la experiencia de usuario.
