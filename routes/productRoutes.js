const express = require('express');
const router = express.Router();
const path = require('path');
const { addProduct, addCategory, findProductByName, updateProduct, deleteProduct, deleteCategory, detailProduct, viewProduct, detailProductById} = require('../controllers/productControllers');
const {requireForm} = require('../middleware/productMiddleware')

router.post('/addProduct', requireForm, addProduct)
router.get("/view",viewProduct )
router.post('/addCategory', addCategory)
router.delete('/deleteCategory', deleteCategory)
router.get("/search", findProductByName);
router.get("/detail/:id", detailProductById)
router.patch("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/:id",detailProduct)
module.exports = router;