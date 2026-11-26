import type { Request, Response } from 'express';
import { Category, Product, OrderItem, Order } from '../../models/index.js';

// GET /cart
const getCartPage = async (req: Request, res: Response) => {
    try {
        const Categories = await Category.findAll();
        const userId = req.data!.userId;
        const order = await Order.findOne({
            where: { user_id: userId, status: 'pending' },
            include: [{
                model: OrderItem,
                include: [Product]
            }]
        });
        return res.render('cart', {
            cartItems: order ? order.OrderItems : [],
            Categories,
            user: req.data
        });
    } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
        return res.status(500).send("Lỗi hệ thống khi tải giỏ hàng");
    }
};

export { getCartPage };
