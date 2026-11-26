import type { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.js';
import { errorMessage } from '../utils/http.js';

const requireForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, stock } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({
                error: "Tên danh mục không được để trống"
            });
        }
        const find = await Product.findOne({ where: { name: name } });

        if (find) {
            return res.status(400).json({
                error: "Sản phẩm đã tồn tại"
            });
        }
        if (price < 0 || price === "") {
            return res.status(400).json({
                error: "Giá không hợp lệ phải lớn hơn 0"
            });
        }
        if (stock < 0 || stock === "") {
            return res.status(400).json({
                error: "Tồn kho không hợp lệ phải lớn hơn 0"
            });
        }
        next();
    } catch (error) {
        console.error("CHI TIẾT LỖI MIDDLWARE:", errorMessage(error));
        return res.status(500).json({
            error: "Lỗi hệ thống"
        });
    }
};

export { requireForm };
