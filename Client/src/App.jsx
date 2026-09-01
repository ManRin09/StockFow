import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import StockMovementsPage from './pages/StockMovementsPage';
import NotFound from './pages/NotFound';

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Barra superior de navegación */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Contenedor Principal con Sidebar y Área de Rutas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Responsive */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/movements" element={<StockMovementsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
