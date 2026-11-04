// Đánh giá sản phẩm
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/authMiddleware');
const review = require('../../controllers/api/reviewController');

router.post('/products/:productId/reviews', requireAuth, review.createReview);
router.delete('/reviews/:id', requireAuth, review.deleteReview);

module.exports = router;
