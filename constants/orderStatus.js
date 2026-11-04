// Trạng thái của Order.status
const ORDER_STATUS = {
    PENDING: 'pending',         // giỏ hàng hiện tại, chưa đặt
    PROCESSING: 'processing',   // chờ xác nhận
    SHIPPING: 'shipping',       // đang giao
    DELIVERED: 'delivered',     // đã giao (khách xác nhận đã nhận)
    CANCELLED: 'cancelled'      // đã hủy
};

// Từ trạng thái nào được phép chuyển sang trạng thái nào.
const ORDER_STATUS_FLOW = {
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
};

module.exports = { ORDER_STATUS, ORDER_STATUS_FLOW };
