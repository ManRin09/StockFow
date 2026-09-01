import dashboardService from '../services/dashboard.service.js';

export const dashboardController = {
  /**
   * GET /api/dashboard/stats
   */
  async getStats(req, res, next) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
