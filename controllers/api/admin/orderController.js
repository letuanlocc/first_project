const { notImplemented } = require('../../../utils/http');
const { ORDER_STATUS_FLOW } = require('../../../constants/orderStatus');
const { sequelize, Order, OrderItem, Product } = require('../../../models/index');

// PATCH /api/admin/orders/:id      body: { status }
// Các bước gợi ý (trong một transaction):
//   1. Kiểm tra status có nằm trong ORDER_STATUS_FLOW[order.status] không
//   2. Nếu chuyển sang 'cancelled': cộng lại Product.stock cho từng OrderItem
//   3. order.update({ status }, { transaction })
//   4. Trả { message }
// Giao diện admin chỉ dùng: processing -> shipping và -> cancelled.
// 'delivered' do khách xác nhận (PATCH /api/orders/:id).
const updateOrderStatus = async(req,res) => {
    const orderId = Number(req.params.id)
    const { status } = req.body;

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ error: "Mã đơn không hợp lệ" });
    }

    if (status !== 'shipping' && status !== 'cancelled') {
        return res.status(400).json({ error: "Admin chỉ được chuyển sang shipping hoặc cancelled" });
    }

    try{
        const result = await sequelize.transaction(async(transaction) =>{

            const order  = await Order.findOne({
                where: {id: orderId},
                transaction,
                lock: transaction.LOCK.UPDATE
            })

            if (!order) return { status: 404, error: "Không tìm thấy đơn" };

            if (!ORDER_STATUS_FLOW[order.status]?.includes(status)) {
                return { status: 400, error: "Không thể chuyển trạng thái này" };
            }

            if(status === "cancelled"){
                const items = await OrderItem.findAll({where: {order_id: order.id}, order: [['product_id', 'ASC']], transaction})

                for (const i of items){
                    const product = await Product.findByPk(i.product_id, {transaction, lock: transaction.LOCK.UPDATE})

                    if (!product) continue;

                    await product.update({
                        stock: product.stock + i.quantity
                    }, {transaction})
                }
            }
            
            await order.update({ status }, { transaction });

            return {
                status: 200,
                message: status === 'cancelled' ? "Đã hủy đơn hàng" : "Đã xác nhận, đơn đang giao"
            };
        })
        if (result.error) return res.status(result.status).json({ error: result.error });
        return res.status(result.status).json(result);
    }catch(error){
        console.error("Lỗi hệ thống khi xử lý:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi xử lý" });
    }
}

module.exports = { ORDER_STATUS_FLOW, updateOrderStatus };
