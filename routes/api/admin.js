// /api/admin: các API chỉ admin được gọi
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authMiddleware');
const { requireForm } = require('../../middleware/productMiddleware');
const upload = require('../../middleware/uploadMiddleware');
const uploadToCloudinary = require('../../middleware/cloudinaryMiddleware');

const product = require('../../controllers/api/admin/productController');
const category = require('../../controllers/api/admin/categoryController');
const order = require('../../controllers/api/admin/orderController');
const price = require('../../controllers/api/admin/priceController');
const competitor = require('../../controllers/api/admin/competitorController');

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
router.patch('/orders/:id', order.updateOrderStatus);       // { status }

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

module.exports = router;
