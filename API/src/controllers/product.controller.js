import productService from '../services/product.service.js';

export const productController = {
  /**
   * GET /api/products
   */
  async getAll(req, res, next) {
    try {
      const { search, category, stockStatus, sortBy, sortOrder } = req.query;
      const products = await productService.getAllProducts({
        search,
        category,
        stockStatus,
        sortBy,
        sortOrder,
      });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/products
   */
  async create(req, res, next) {
    try {
      const created = await productService.createProduct(req.body);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/products/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await productService.updateProduct(id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/products/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/low-stock
   */
  async getLowStock(req, res, next) {
    try {
      const products = await productService.getLowStockProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
