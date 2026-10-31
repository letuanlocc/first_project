const express = require('express');
const router = express.Router();
const path = require('path');
const { checkUser, requireAuth}= require('../middleware/authMiddleware');
const account = require('../controllers/accountController');
const Product = require('../models/Product')
const Category  = require('../models/Category');
const { categoryDetailAndRender, getHome, detailProduct, searchProduct, getCart, addCart, removeCartItem} = require('../controllers/userController');

router.get("/", checkUser, (req, res, next) => {
	if (req.data?.role === "admin" || !req.query.search?.trim()) {
		return getHome(req, res, next);
	}
	return searchProduct(req, res, next);
})
router.get("/cart", requireAuth, getCart);
router.post("/addcart", requireAuth, addCart)
router.delete("/deletecart/:id", requireAuth, removeCartItem);

// Tài khoản, thanh toán, đơn hàng (mới dựng khung, xem accountController.js)
router.get("/profile", requireAuth, account.getProfile);
router.post("/profile/info", requireAuth, account.updateProfile);
router.post("/profile/addresses", requireAuth, account.addAddress);
router.post("/profile/addresses/:id/default", requireAuth, account.setDefaultAddress);
router.delete("/profile/addresses/:id", requireAuth, account.deleteAddress);
router.get("/checkout", requireAuth, account.getCheckout);
router.post("/checkout", requireAuth, account.placeOrder);
router.post("/orders/:id/cancel", requireAuth, account.cancelOrder);
router.post("/favorites/:productId", requireAuth, account.toggleFavorite);
router.post("/reviews", requireAuth, account.createReview);
router.delete("/reviews/:id", requireAuth, account.deleteReview);
router.get("/:slug", checkUser, detailProduct);
module.exports = router;