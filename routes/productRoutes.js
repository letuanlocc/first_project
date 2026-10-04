const express = require('express');
const router = express.Router();
const { addProduct, addCategory, listCategories, detailCategoryById, listProducts, updateProduct, deleteProduct, deleteCategory, detailProductById} = require('../controllers/productControllers');
const { requireAdmin } = require('../middleware/authMiddleware');
const {requireForm} = require('../middleware/productMiddleware')
const upload = require("../middleware/uploadMiddleware");
const uploadToCloudinary = require("../middleware/cloudinaryMiddleware");

router.route('/products')
    .get(requireAdmin, listProducts)
    .post(
    requireAdmin,
    upload.single("image"),
    requireForm,
    uploadToCloudinary,
    addProduct
);

router.route('/products/:id')
    .get(requireAdmin, detailProductById)
    .patch(requireAdmin, updateProduct)
    .delete(requireAdmin, deleteProduct);

router.route('/categories')
    .get(requireAdmin, listCategories)
    .post(requireAdmin, addCategory);

router.route('/categories/:id')
    .get(requireAdmin, detailCategoryById)
    .delete(requireAdmin, deleteCategory);

module.exports = router;