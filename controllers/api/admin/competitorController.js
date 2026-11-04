const { notImplemented } = require('../../../utils/http');

// Giá của đối thủ.
// Cần thêm model: CompetitorPrice { product_id, store_name, url, price, checked_at }

// GET /api/admin/products/:id/competitor-prices
// Trả: { competitors: [{ id, store_name, url, price, checked_at }] }
const listCompetitorPrices = notImplemented;

// POST /api/admin/products/:id/competitor-prices      body: { store_name, url, price }
// Trả: { message, competitor }
const addCompetitorPrice = notImplemented;

// DELETE /api/admin/competitor-prices/:id
const deleteCompetitorPrice = notImplemented;

// POST /api/admin/competitor-prices/import            file CSV: product_id,store_name,url,price
// Đọc từng dòng, kiểm tra dữ liệu, bỏ qua dòng lỗi và báo lại.
// Trả: { message, imported: số dòng, errors: [{ line, reason }] }
const importCompetitorPrices = notImplemented;

module.exports = {
    listCompetitorPrices,
    addCompetitorPrice,
    deleteCompetitorPrice,
    importCompetitorPrices
};
