const { notImplemented } = require('../../../utils/http');
const { ORDER_STATUS_FLOW } = require('../../../constants/orderStatus');

// PATCH /api/admin/orders/:id      body: { status }
// Các bước gợi ý (trong một transaction):
//   1. Kiểm tra status có nằm trong ORDER_STATUS_FLOW[order.status] không
//   2. Nếu chuyển sang 'cancelled': cộng lại Product.stock cho từng OrderItem
//   3. order.update({ status }, { transaction })
//   4. Trả { message }
// Giao diện admin chỉ dùng: processing -> shipping và -> cancelled.
// 'delivered' do khách xác nhận (PATCH /api/orders/:id).
const updateOrderStatus = notImplemented;

module.exports = { ORDER_STATUS_FLOW, updateOrderStatus };
