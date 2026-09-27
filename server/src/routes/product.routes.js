import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controller/product.controller.js';
import {
  productValidator,
  productIdValidator
} from '../validators/product.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', productIdValidator, validateRequest, getProductById);

// Protected routes
router.post('/', authenticate, productValidator, validateRequest, createProduct);
router.put('/:id', authenticate, productIdValidator, productValidator, validateRequest, updateProduct);
router.delete('/:id', authenticate, productIdValidator, validateRequest, deleteProduct);

export default router;
