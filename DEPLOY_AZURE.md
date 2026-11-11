# Despliegue de Client (Frontend Vite) en Azure App Service

Este documento detalla la configuración necesaria para desplegar la carpeta `Client` en **Azure App Service** mediante GitHub Actions.

---

## 1. Configuración obligatoria en Azure Portal

### Si tu App Service es **Linux (Node.js runtime)**:
En Azure App Service Linux, el contenedor Node.js espera que un proceso backend escuche en el puerto HTTP. Como Vite genera una aplicación estática compilada (`dist`), es **imprescindible** configurar el comando de inicio para que el servidor `pm2` preinstalado en Azure sirva los archivos y gestione las rutas de la SPA:

1. Ve a tu App Service en [portal.azure.com](https://portal.azure.com).
2. En el menú lateral izquierdo, ve a **Configuración** (Configuration) → pestaña **Configuración de la pila** (General settings).
3. En el campo **Comando de inicio** (Startup Command), ingresa exactamente:
   ```bash
   pm2 serve /home/site/wwwroot --no-daemon --spa
   ```
4. Haz clic en **Guardar** (Save) y reinicia la aplicación.

### Si tu App Service es **Windows**:
No requiere comando de inicio. Vite ya incluye automáticamente [web.config](file:///C:/Users/maner/Documents/ManRin09.github.io/StockFow/Client/public/web.config) en la carpeta `dist`, el cual configura IIS con las reglas de MIME y la reescritura para React Router.

---

## 2. Configuración de credenciales en GitHub

1. En Azure Portal, dentro de tu App Service, ve a **Configuración** → **Configuración general**.
2. Asegúrate de que la opción **"Credenciales de publicación de autenticación básica de SCM"** esté en **Activado** (On).
3. Ve a la pestaña **Información general** (Overview) de tu App Service y pulsa en **Descargar perfil de publicación** (Get publish profile). Se descargará un archivo `.PublishSettings`.
4. Abre tu repositorio en GitHub y ve a:
   **Settings** → **Secrets and variables** → **Actions**.
5. Agrega el siguiente secreto (**Repository secret**):
   - **Nombre:** `AZUREAPPSERVICE_PUBLISHPROFILE`
   - **Valor:** Pega todo el contenido de texto del archivo `.PublishSettings` descargado.
6. El nombre configurado en el workflow es `stockflow-client-hhbka9a6f8g4djfd`.

---

## 3. Funcionamiento del Workflow

El archivo [.github/workflows/main_stockflow-client.yml](file:///C:/Users/maner/Documents/ManRin09.github.io/StockFow/.github/workflows/main_stockflow-client.yml) se ejecuta automáticamente en cada `git push` a `main`:

1. Instala las dependencias con `npm ci` dentro de `Client/`.
2. Compila el frontend con `npm run build` generando `Client/dist`.
3. Sube `Client/dist` hacia Azure Web App.
