// Các trang HTML (render bằng EJS) và form đăng nhập/đăng ký.
import { Router } from 'express';
import { checkUser, requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

import * as shop from '../controllers/web/shopController.js';
import * as cart from '../controllers/web/cartController.js';
import * as account from '../controllers/web/accountController.js';
import * as admin from '../controllers/web/adminController.js';
import * as auth from '../controllers/web/authController.js';

const router = Router();

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

export default router;
