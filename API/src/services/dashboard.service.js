import dashboardRepository from '../repositories/dashboard.repository.js';

export const dashboardService = {
  /**
   * Retorna estadísticas calculadas para el dashboard
   */
  async getDashboardStats() {
    return await dashboardRepository.getStats();
  },
};

export default dashboardService;
