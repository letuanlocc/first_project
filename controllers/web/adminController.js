const { Op } = require('sequelize');
const { Category, Order, User } = require('../../models/index');

// GET /admin
// View admin.ejs cần: Categories, user, error, success, orders
//   orders: [{ id, createdAt, status, total_amount, shipping_address, phone,
//              receiver_name, User: { username } }]
const getAdminPage = async (req, res) => {
    try {
        const Categories = await Category.findAll();

        const orders= await Order.findAll({
            where: {status: { [Op.ne]: 'pending' } },   // bỏ giỏ hàng
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'],
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.render('admin', {
            Categories,
            user: req.data,
            error: req.query.error,
            success: req.query.success,
            orders
        });
    } catch (error) {
        console.error("Lỗi tải trang quản trị:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { getAdminPage };
