const { notImplemented } = require('../../../utils/http');

// Lịch sử giá và cập nhật giá.
// Cần thêm model: PriceHistory { product_id, old_price, new_price, changed_by, reason, createdAt }

// GET /api/admin/products/:id/price-changes
// Trả: { history: [{ old_price, new_price, changed_by, reason, createdAt }] }
const listPriceChanges = notImplemented;

// POST /api/admin/products/:id/price-changes      body: { price, reason }
// Tạo một lần đổi giá: ghi PriceHistory rồi cập nhật Product.price (trong một transaction).
// Trả { message, price }
const createPriceChange = notImplemented;

// POST /api/admin/bulk-price-changes/preview      body: { rule, scope }
//   rule:  { type: 'percent' | 'fixed', value: number }   (ví dụ giảm 5% = percent, -5)
//   scope: { category_id? , product_ids?: number[] }
// KHÔNG ghi gì vào CSDL. Trả:
//   { items: [{ product_id, name, old_price, new_price, below_cost: boolean }] }
const previewBulkPriceChange = notImplemented;

// POST /api/admin/bulk-price-changes              body: giống preview
// Tính lại giống preview, rồi trong một transaction ghi PriceHistory và cập nhật giá.
// Trả { message, updated: số lượng }
const applyBulkPriceChange = notImplemented;

// GET /api/admin/price-comparisons
// Trả bảng so sánh: { rows: [{ product_id, name, our_price, cost_price,
//                              lowest_competitor, lowest_store, diff }] }
const listPriceComparisons = notImplemented;

module.exports = {
    listPriceChanges,
    createPriceChange,
    previewBulkPriceChange,
    applyBulkPriceChange,
    listPriceComparisons
};
