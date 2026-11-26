// /api/cart: giỏ hàng của người đang đăng nhập
import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import * as cart from '../../controllers/api/cartController.js';

const router = Router();

router.use(requireAuth);

router.post('/items', cart.addCartItem);                    // thêm sản phẩm (cộng dồn)
router.patch('/items/:productId', cart.updateCartItem);     // đổi số lượng
router.delete('/items/:productId', cart.removeCartItem);    // xóa khỏi giỏ

export default router;
