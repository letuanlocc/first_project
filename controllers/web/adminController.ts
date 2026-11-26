import type { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Category, Order } from '../../models/index.js';

// GET /admin
// View admin.ejs cần: Categories, user, error, success, orderCounts
const getAdminPage = async (req: Request, res: Response) => {
    try {
        const Categories = await Category.findAll();

        // Chỉ cần số lượng theo trạng thái; danh sách đơn được tải (phân trang) qua GET /api/admin/orders
        const rows = await Order.count({
            where: { status: { [Op.ne]: 'pending' } },   // bỏ giỏ hàng
            group: ['status']
        });
        const orderCounts: Record<string, number> = { processing: 0, shipping: 0, delivered: 0, cancelled: 0 };
        rows.forEach(r => { orderCounts[String(r.status)] = r.count; });
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

export { getAdminPage };
