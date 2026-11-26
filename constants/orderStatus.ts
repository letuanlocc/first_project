// Trạng thái của Order.status
export const ORDER_STATUS = {
    PENDING: 'pending',         // giỏ hàng hiện tại, chưa đặt
    PROCESSING: 'processing',   // chờ xác nhận
    SHIPPING: 'shipping',       // đang giao
    DELIVERED: 'delivered',     // đã giao (khách xác nhận đã nhận)
    CANCELLED: 'cancelled'      // đã hủy
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Từ trạng thái nào được phép chuyển sang trạng thái nào.
export const ORDER_STATUS_FLOW: Partial<Record<string, readonly OrderStatus[]>> = {
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
};
