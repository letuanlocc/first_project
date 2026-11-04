const { notImplemented } = require('../../utils/http');

// Sản phẩm yêu thích của người đang đăng nhập.
// Cần thêm model: Favorite { user_id, product_id } (unique theo cặp user_id + product_id).

// POST /api/me/favorites          body: { productId }
const addFavorite = notImplemented;

// DELETE /api/me/favorites/:productId
const removeFavorite = notImplemented;

module.exports = { addFavorite, removeFavorite };
