// /api/cart: giỏ hàng của người đang đăng nhập
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/authMiddleware');
const cart = require('../../controllers/api/cartController');

router.use(requireAuth);

router.post('/items', cart.addCartItem);                    // thêm sản phẩm (cộng dồn)
router.patch('/items/:productId', cart.updateCartItem);     // đổi số lượng
router.delete('/items/:productId', cart.removeCartItem);    // xóa khỏi giỏ

module.exports = router;
