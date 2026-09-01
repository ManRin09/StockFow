import movementService from '../services/movement.service.js';

export const movementController = {
  /**
   * GET /api/movements
   */
  async getAll(req, res, next) {
    try {
      const { productId, type, search, limit, offset } = req.query;
      const movements = await movementService.getAllMovements({
        productId,
        type,
        search,
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      res.status(200).json(movements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/movements
   */
  async create(req, res, next) {
    try {
      const created = await movementService.recordMovement(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/movements/summary
   */
  async getSummary(req, res, next) {
    try {
      const summary = await movementService.getMovementsSummary();
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  },
};

export default movementController;
