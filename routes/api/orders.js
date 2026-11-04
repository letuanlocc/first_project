// /api/orders: đơn hàng của người đang đăng nhập
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/authMiddleware');
const order = require('../../controllers/api/orderController');

router.use(requireAuth);

router.post('/', order.placeOrder);         // đặt hàng từ giỏ
router.patch('/:id', order.updateOrder);    // { status: 'cancelled' | 'delivered' }

module.exports = router;
