const express = require('express');
const router = express.Router();
const path = require('path');
const { checkUser }= require('../middleware/authMiddleware');
const Product = require('../models/Product')
const Category  = require('../models/Category');
const { categoryDetailAndRender, getHome, detailProduct, searchProduct} = require('../controllers/userController');

router.get("/", checkUser, (req, res, next) => {
	if (req.data?.role === "admin" || !req.query.search?.trim()) {
		return getHome(req, res, next);
	}
	return searchProduct(req, res, next);
})
router.get("/:slug",detailProduct)

module.exports = router;