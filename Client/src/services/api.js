import axios from 'axios';

/**
 * Cliente Axios configurado para comunicarse con la API de Express.
 * Base URL por defecto: http://localhost:5000/api
 * Se puede sobreescribir mediante la variable de entorno VITE_API_URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Solicitudes: añade tokens o headers personalizados
api.interceptors.request.use(
  (config) => {
    // Si en el futuro se implementa JWT auth:
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas: normalización de respuestas y manejo centralizado de errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let customError = {
      message: 'Ocurrió un error inesperado al comunicarse con el servidor.',
      status: error.response ? error.response.status : null,
      data: error.response ? error.response.data : null,
    };

    if (error.code === 'ECONNABORTED') {
      customError.message = 'La solicitud tardó demasiado tiempo en responder (Timeout).';
    } else if (!error.response) {
      customError.message = 'No se pudo conectar con el servidor backend en ' + (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
    } else if (error.response.data && error.response.data.message) {
      customError.message = error.response.data.message;
    }

    return Promise.reject(customError);
  }
);

export default api;
