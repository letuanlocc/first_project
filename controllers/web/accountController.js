const { Op } = require('sequelize');
const { Category, Product, OrderItem, Order, Address } = require('../../models/index');

// GET /profile
const getProfilePage = async (req, res) => {
    const userId = req.data.userId
    try {
        const Categories = await Category.findAll();

        const orders= await Order.findAll({
            where: { user_id: userId, status: { [Op.ne]: 'pending' } },   // bỏ giỏ hàng
            include: [{ model: OrderItem, include: [Product] }],
            order: [['createdAt', 'DESC']]
        });

        const addresses = await Address.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC'], ['createdAt', 'DESC']]
        });

        return res.render('profile', {
            Categories,
            user: req.data,
            // TODO: lấy dữ liệu thật của khách hàng
            addresses,       // [{ id, name, phone, address, is_default }]
            orders: orders,      // [{ id, createdAt, status, total_amount, OrderItems: [{ quantity, price_at_that_time, Product }] }]
            favorites: [],   // [Product]
            reviews: [],     // [{ id, rating, content, createdAt, Product }]
            pending: []      // sản phẩm đã giao nhưng chưa đánh giá: [{ id, Product, order_id }]
        });
    } catch (error) {
        console.error("Lỗi tải trang tài khoản:", error);
        return res.status(500).send("Lỗi hệ thống khi tải trang tài khoản");
    }
};

// GET /checkout
const getCheckoutPage = async(req,res) => {
    const userId = req.data.userId;
    try{
         const order = await Order.findOne({
            where: {
                user_id: userId,
                status: "pending"
            },
            include: [{
                model: OrderItem,
                include: [Product]
            }]
        })
        const addresses = await Address.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC']]
        });

        const Categories = await Category.findAll();

        res.render('checkout', {
            Categories,
            user: req.data,
            cartItems: order ? order.OrderItems: [],
            addresses
        });
    }catch(error){
        console.error("Lỗi khi lấy giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi lấy giỏ hàng" });
    }
};

module.exports = { getProfilePage, getCheckoutPage };
