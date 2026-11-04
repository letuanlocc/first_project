// Các trang HTML (render bằng EJS) và form đăng nhập/đăng ký.
const express = require('express');
const router = express.Router();
const { checkUser, requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const shop = require('../controllers/web/shopController');
const cart = require('../controllers/web/cartController');
const account = require('../controllers/web/accountController');
const admin = require('../controllers/web/adminController');
const auth = require('../controllers/web/authController');

// Cửa hàng
router.get('/', checkUser, shop.getHomeOrSearch);
router.get('/categories/:id', checkUser, shop.getCategoryPage);
router.get('/products/:slug', checkUser, shop.getProductPage);

// Khách hàng
router.get('/cart', requireAuth, cart.getCartPage);
router.get('/checkout', requireAuth, account.getCheckoutPage);
router.get('/profile', requireAuth, account.getProfilePage);

// Quản trị
router.get('/admin', checkUser, requireAdmin, admin.getAdminPage);

// Đăng nhập / đăng ký (form HTML)
router.get('/register', auth.showRegister);
router.post('/register', auth.register);
router.get('/login', auth.showLogin);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

module.exports = router;
