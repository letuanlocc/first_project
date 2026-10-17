const express = require('express');
const router = express.Router();
const path = require('path');
const { checkUser, requireAuth}= require('../middleware/authMiddleware');
const Product = require('../models/Product')
const Category  = require('../models/Category');
const { categoryDetailAndRender, getHome, detailProduct, searchProduct, getCart, addCart, removeCartItem} = require('../controllers/userController');

router.get("/", checkUser, (req, res, next) => {
	if (req.data?.role === "admin" || !req.query.search?.trim()) {
		return getHome(req, res, next);
	}
	return searchProduct(req, res, next);
})
router.get("/cart", checkUser, getCart);
router.post("/addcart", requireAuth, addCart)
router.post("/deletecart/:id", requireAuth, removeCartItem);
router.get("/:slug", checkUser, detailProduct);
module.exports = router;