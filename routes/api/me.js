// /api/me: tài khoản của người đang đăng nhập
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/authMiddleware');
const profile = require('../../controllers/api/profileController');
const address = require('../../controllers/api/addressController');
const favorite = require('../../controllers/api/favoriteController');

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

module.exports = router;
