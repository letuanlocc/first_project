// /api/orders: đơn hàng của người đang đăng nhập
import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import * as order from '../../controllers/api/orderController.js';

const router = Router();

router.use(requireAuth);

router.post('/', order.placeOrder);         // đặt hàng từ giỏ
router.get('/', order.getMyOrders);
router.patch('/:id', order.updateOrder);    // { status: 'cancelled' | 'delivered' }

export default router;
