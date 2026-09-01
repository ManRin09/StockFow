import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Configuración de CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middlewares de parseo de cuerpo de petición
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montaje de la API bajo el prefijo /api
app.use('/api', routes);

// Manejo de Rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Middleware centralizado de manejo de errores
app.use(errorHandler);

export default app;
