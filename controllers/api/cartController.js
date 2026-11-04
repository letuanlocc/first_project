const { sequelize, Product, OrderItem, Order, User } = require('../../models/index');

// Giỏ hàng = đơn 'pending' của người đang đăng nhập.

// POST /api/cart/items        body: { productId, quantity }
// Thêm sản phẩm vào giỏ (đã có thì cộng dồn số lượng).
const addCartItem = async(req,res) => {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);
    const userId = Number(req.data?.userId);

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "Mã sản phẩm không hợp lệ" });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Số lượng phải là số nguyên dương" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({ error: "Vui lòng đăng nhập lại" });
    }

    try {
        const result = await sequelize.transaction(async transaction => {
            await User.findByPk(userId, { transaction, lock: transaction.LOCK.UPDATE });

            const order = await Order.findOne({
                where: {
                    user_id: userId,
                    status: "pending"
                },
                transaction
            })

            const product = await Product.findByPk(productId, {transaction})

            if (!product) {
                return {status: 404, error: "Không tìm thấy sản phẩm"};
            }

            const checkOrderItem = order ? await OrderItem.findOne({
                    where: {
                        order_id: order.id,
                        product_id: productId
                    },
                    transaction
                }): null;

            const newQuantity = Number(checkOrderItem?.quantity || 0) + quantity;

            if (newQuantity > product.stock) {
                return {status: 400, error: "Số lượng sản phẩm đã chọn lớn hơn số lượng tồn kho"};
            }

            const activeOrder = order || await Order.create({
                user_id: userId,
                total_amount: 0,
                status: "pending"
            }, { transaction });

            if (checkOrderItem) {
                await checkOrderItem.update({
                    quantity: newQuantity
                }, { transaction });
            }else {
                await OrderItem.create({
                    order_id: activeOrder.id,
                    product_id: productId,
                    quantity: quantity,
                    price_at_that_time: product.price
                }, { transaction });
            }

            const getOrderItem = await OrderItem.findAll({
                where: {order_id: activeOrder.id},
                transaction
            })

            let totalAmount = 0;

            for (const item of getOrderItem) {
                totalAmount += item.quantity * item.price_at_that_time;
            }

            await activeOrder.update({
                total_amount: totalAmount
            },{ transaction })

            return {
                status: order ? 200 : 201,
                message: "Đã thêm sản phẩm vào giỏ hàng",
                orderId: activeOrder.id,
                quantity: newQuantity
            };
        });
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi thêm vào giỏ hàng" });
    }
};

// Đặt lại số lượng một món trong giỏ. quantity = 0 nghĩa là xóa món đó.
// Giỏ không còn món nào thì xóa luôn đơn pending.
const setCartItemQuantity = async (res, userId, productId, quantity) => {
    try{
        const result = await sequelize.transaction(async (transaction) => {
            await User.findByPk(userId, { transaction, lock: transaction.LOCK.UPDATE });

            const order = await Order.findOne({
                where: {
                    user_id: userId,
                    status: "pending"
                },
                 transaction
            })
             if (!order) {
                return { status: 404, error: "Không tìm thấy giỏ hàng" };
            }
            const orderItem = await OrderItem.findOne({
                where:{
                    order_id: order.id,
                    product_id: productId
                },
                transaction
            })
            if (!orderItem) {
                return { status: 404, error: "Sản phẩm không có trong giỏ hàng" };
            }

            if (quantity > 0) {
                const product = await Product.findByPk(productId, { transaction });
                if (product && quantity > product.stock) {
                    return { status: 400, error: "Số lượng sản phẩm đã chọn lớn hơn số lượng tồn kho" };
                }
                await orderItem.update({ quantity }, { transaction })
            } else {
                await orderItem.destroy({ transaction })
            }

            const remainingItems = await OrderItem.findAll({
                where: {order_id: order.id},
                transaction
            })

            if(remainingItems.length === 0){
                await order.destroy({transaction})
                return { status: 200, message: "Đã xóa giỏ hàng", orderDeleted: true };
            }

            let totalAmount = 0
            for(const i of remainingItems){
                totalAmount += i.quantity * i.price_at_that_time
            }

            await order.update({total_amount: totalAmount}, {transaction})

            return { status: 200, message: "Đã cập nhật giỏ hàng", quantity, totalAmount };
            })
            if (result.error) {
                return res.status(result.status).json({ error: result.error });
            }
             return res.status(result.status).json(result);
    }catch(error){
        console.error("Lỗi cập nhật giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi cập nhật giỏ hàng" });
    }
};

// PATCH /api/cart/items/:productId      body: { quantity }
// Đổi số lượng của một món (nút +/- ở giỏ hàng).
const updateCartItem = async (req, res) => {
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);
    const userId = Number(req.data?.userId);

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "Mã sản phẩm không hợp lệ" });
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ error: "Số lượng không hợp lệ" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({ error: "Vui lòng đăng nhập lại" });
    }

    return setCartItemQuantity(res, userId, productId, quantity);
};

// DELETE /api/cart/items/:productId
// Xóa hẳn một món khỏi giỏ.
const removeCartItem = async (req, res) => {
    const productId = Number(req.params.productId);
    const userId = Number(req.data?.userId);

    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "Mã sản phẩm không hợp lệ" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({ error: "Vui lòng đăng nhập lại" });
    }

    return setCartItemQuantity(res, userId, productId, 0);
};

module.exports = { addCartItem, updateCartItem, removeCartItem };
