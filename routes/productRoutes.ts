import { Router } from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = Router();

// Middleware to set query parameters for top products
//router.use('/top-products', aliasTopProducts);

// Route to get all products
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

// Route to get, update, or delete a single product by ID
router.route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

// Route to get product statistics
//router.route('/stats').get(getProductStats);


export default router;
