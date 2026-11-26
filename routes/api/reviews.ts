// Đánh giá sản phẩm
import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import * as review from '../../controllers/api/reviewController.js';

const router = Router();

router.post('/products/:productId/reviews', requireAuth, review.createReview);
router.delete('/reviews/:id', requireAuth, review.deleteReview);

export default router;
