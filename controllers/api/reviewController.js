const { notImplemented } = require('../../utils/http');

// Đánh giá sản phẩm.
// Cần thêm model: Review { user_id, product_id, rating (1-5), content }.

// POST /api/products/:productId/reviews      body: { rating, content }
// Chỉ cho khách đã có đơn 'delivered' chứa sản phẩm này.
const createReview = notImplemented;

// DELETE /api/reviews/:id
// Chỉ xóa được đánh giá của chính mình.
const deleteReview = notImplemented;

module.exports = { createReview, deleteReview };
