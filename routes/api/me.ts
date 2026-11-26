// /api/me: tài khoản của người đang đăng nhập
import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import * as profile from '../../controllers/api/profileController.js';
import * as address from '../../controllers/api/addressController.js';
import * as favorite from '../../controllers/api/favoriteController.js';

const router = Router();

router.use(requireAuth);

// Thông tin cá nhân
router.patch('/', profile.updateProfile);

// Sổ địa chỉ
router.post('/addresses', address.addAddress);
router.patch('/addresses/:id', address.updateAddress);
router.delete('/addresses/:id', address.deleteAddress);

// Sản phẩm yêu thích
router.post('/favorites', favorite.addFavorite);
router.delete('/favorites/:productId', favorite.removeFavorite);

export default router;
