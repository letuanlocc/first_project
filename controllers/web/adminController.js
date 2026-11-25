const { Op } = require('sequelize');
const { Category, Order, User } = require('../../models/index');

// GET /admin
// View admin.ejs cần: Categories, user, error, success, orders
//   orders: [{ id, createdAt, status, total_amount, shipping_address, phone,
//              receiver_name, User: { username } }]
const getAdminPage = async (req, res) => {
    try {
        const Categories = await Category.findAll();

        // Chỉ cần số lượng theo trạng thái; danh sách đơn được tải (phân trang) qua GET /api/admin/orders
        const rows = await Order.count({
            where: { status: { [Op.ne]: 'pending' } },   // bỏ giỏ hàng
            group: ['status']
        });
        const orderCounts = { processing: 0, shipping: 0, delivered: 0, cancelled: 0 };
        rows.forEach(r => { orderCounts[r.status] = r.count; });
        orderCounts.all = Object.values(orderCounts).reduce((a, b) => a + b, 0);

        return res.render('admin', {
            Categories,
            user: req.data,
            error: req.query.error,
            success: req.query.success,
            orderCounts
        });
    } catch (error) {
        console.error("Lỗi tải trang quản trị:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { getAdminPage };
