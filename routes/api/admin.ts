// /api/admin: các API chỉ admin được gọi
import { Router } from 'express';
import { requireAdmin } from '../../middleware/authMiddleware.js';
import { requireForm } from '../../middleware/productMiddleware.js';
import upload from '../../middleware/uploadMiddleware.js';
import uploadToCloudinary from '../../middleware/cloudinaryMiddleware.js';

import * as product from '../../controllers/api/admin/productController.js';
import * as category from '../../controllers/api/admin/categoryController.js';
import * as order from '../../controllers/api/admin/orderController.js';
import * as price from '../../controllers/api/admin/priceController.js';
import * as competitor from '../../controllers/api/admin/competitorController.js';

const router = Router();

router.use(requireAdmin);

// Sản phẩm
router.route('/products')
    .get(product.listProducts)
    .post(upload.single('image'), requireForm, uploadToCloudinary, product.createProduct);
router.route('/products/:id')
    .get(product.getProduct)
    .patch(product.updateProduct)
    .delete(product.deleteProduct);

// Danh mục
router.route('/categories')
    .get(category.listCategories)
    .post(category.createCategory);
router.route('/categories/:id')
    .get(category.getCategory)
    .delete(category.deleteCategory);

// Đơn hàng
router.get('/orders', order.getOrders);
router.patch('/orders/:id', order.updateOrderStatus);      // { status }

// Giá
router.route('/products/:id/price-changes')
    .get(price.listPriceChanges)
    .post(price.createPriceChange);
router.post('/bulk-price-changes/preview', price.previewBulkPriceChange);
router.post('/bulk-price-changes', price.applyBulkPriceChange);
router.get('/price-comparisons', price.listPriceComparisons);

// Giá đối thủ
router.route('/products/:id/competitor-prices')
    .get(competitor.listCompetitorPrices)
    .post(competitor.addCompetitorPrice);
router.post('/competitor-prices/import', competitor.importCompetitorPrices);
router.delete('/competitor-prices/:id', competitor.deleteCompetitorPrice);

export default router;
