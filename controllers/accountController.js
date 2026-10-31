const { Category } = require('../models/index');

// Các hàm bên dưới mới chỉ dựng khung. Phần giao diện đã đọc dữ liệu từ các biến
// được truyền vào view, chỉ cần thay mảng rỗng bằng dữ liệu thật.
//
// Trạng thái đơn hàng (Order.status):
//   'pending'    giỏ hàng hiện tại (đang dùng cho addCart)
//   'processing' chờ xác nhận
//   'shipping'   đang giao
//   'delivered'  đã giao
//   'cancelled'  đã hủy

const notImplemented = (req, res) => {
    return res.status(501).json({ error: "Chức năng này chưa được xử lý" });
};

// ===== Trang =====

const getProfile = async (req, res) => {
    try {
        const Categories = await Category.findAll();
        return res.render('profile', {
            Categories,
            user: req.data,
            // TODO: lấy dữ liệu thật của khách hàng
            addresses: [],   // [{ id, name, phone, address, is_default }]
            orders: [],      // [{ id, createdAt, status, total_amount, OrderItems: [{ quantity, price_at_that_time, Product }] }]
            favorites: [],   // [Product]
            reviews: [],     // [{ id, rating, content, createdAt, Product }]
            pending: []      // sản phẩm đã giao nhưng chưa đánh giá: [{ id, Product, order_id }]
        });
    } catch (error) {
        console.error("Lỗi tải trang tài khoản:", error);
        return res.status(500).send("Lỗi hệ thống khi tải trang tài khoản");
    }
};

const getCheckout = async (req, res) => {
    try {
        const Categories = await Category.findAll();
        return res.render('checkout', {
            Categories,
            user: req.data,
            // TODO: lấy đơn pending và địa chỉ đã lưu của khách
            cartItems: [],   // OrderItems của đơn pending (kèm Product)
            addresses: []    // giống getProfile
        });
    } catch (error) {
        console.error("Lỗi tải trang thanh toán:", error);
        return res.status(500).send("Lỗi hệ thống khi tải trang thanh toán");
    }
};

// ===== Hành động của khách hàng (chưa xử lý) =====

const placeOrder = notImplemented;          // POST   /checkout            body: { address_id | name, phone, address }
const cancelOrder = notImplemented;         // POST   /orders/:id/cancel   chỉ cho đơn 'processing'
const updateProfile = notImplemented;       // POST   /profile/info        body: { name, phone }
const addAddress = notImplemented;          // POST   /profile/addresses
const setDefaultAddress = notImplemented;   // POST   /profile/addresses/:id/default
const deleteAddress = notImplemented;       // DELETE /profile/addresses/:id
const toggleFavorite = notImplemented;      // POST   /favorites/:productId
const createReview = notImplemented;        // POST   /reviews             body: { product_id, rating, content }
const deleteReview = notImplemented;        // DELETE /reviews/:id

// ===== Hành động của admin (chưa xử lý) =====

const updateOrderStatus = notImplemented;   // PATCH  /admin/orders/:id/status   body: { status }

module.exports = {
    getProfile,
    getCheckout,
    placeOrder,
    cancelOrder,
    updateProfile,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    toggleFavorite,
    createReview,
    deleteReview,
    updateOrderStatus
};
