const { sequelize, Product, OrderItem, Order, User, Address } = require('../../models/index');
const { notImplemented } = require('../../utils/http');
const { Op } = require('sequelize');

// POST /api/orders        body: { name, phone, address }
// Đặt hàng: chốt đơn 'pending' (giỏ hàng) thành 'processing'.
const placeOrder = async(req,res) => {
    const userId = Number(req.data?.userId);
    let { name, phone, address, address_id } = req.body;
    try{
        const result = await sequelize.transaction(async (transaction) => {
            await User.findByPk(userId, { transaction, lock: transaction.LOCK.UPDATE });

            const order = await Order.findOne({
                where: {
                    user_id: userId,
                    status: 'pending'
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            })

            if (!order) return { status: 404, error: "Không tìm thấy giỏ hàng" };

            if (address_id) {
                const saved = await Address.findOne({
                    where: { id: address_id, user_id: userId },
                    transaction
                });
                if (!saved) return { status: 400, error: "Địa chỉ không hợp lệ" };
                name = saved.name;
                phone = saved.phone;
                address = saved.address;
            }
            if (!name || !phone || !address) {
                return { status: 400, error: "Thiếu thông tin người nhận" };
            }

            const orderItems = await OrderItem.findAll({
                where: {order_id: order.id},
                order: [['product_id', 'ASC']],
                transaction
            })
            //
            let totalAmount = 0
            for(const i of orderItems){
                const product = await Product.findByPk(i.product_id, {transaction, lock: transaction.LOCK.UPDATE});
                if (!product) return { status: 400, error: "Có sản phẩm không còn bán" };
                if(i.quantity > product.stock){
                    return { status: 400, error: `${product.name} không đủ tồn kho` };
                }
                await product.update({stock: product.stock - i.quantity}, {transaction})
                await i.update({price_at_that_time: product.price}, {transaction})
                totalAmount += i.quantity * Number(product.price);
            }

            await order.update({
                total_amount: totalAmount,
                status: 'processing',
                shipping_address: address,
                phone: phone,
                receiver_name: name
            }, {transaction})

            return { status: 201, message: "Đặt hàng thành công", orderId: order.id };
        });
        if (result.error) return res.status(result.status).json({ error: result.error });
        return res.status(result.status).json(result);
    }catch(error){
        console.error("Lỗi đặt hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi đặt hàng" });
    }
};

// Khách hủy đơn: chỉ cho đơn 'processing' của chính khách, cộng lại tồn kho.
const cancelOrder = async(req,res) => {
    const userId = req.data.userId
    const orderId = req.params.id

    try{
        const result = await sequelize.transaction(async(transaction) =>{
            await User.findByPk(userId, {transaction, lock: transaction.LOCK.UPDATE})

            const order  = await Order.findOne({
                where: {user_id: userId, id: orderId, status: "processing"},
                transaction,
                lock: transaction.LOCK.UPDATE
            })

            if (!order) return { status: 404, error: "Không tìm thấy đơn có thể hủy" };

            const items = await OrderItem.findAll({
                where: {order_id: order.id},
                order: [['product_id', 'ASC']],
                transaction
            })
            
            for (const i of items){
                const product = await Product.findByPk(i.product_id, {transaction, lock: transaction.LOCK.UPDATE})

                if (!product) continue;

                await product.update({
                    stock: product.stock + i.quantity
                }, {transaction})
            }

            await order.update({
                status: "cancelled"
            }, {transaction})
            return { status: 200, message: "Đã hủy đơn hàng" };
        })
        if (result.error) return res.status(result.status).json({ error: result.error });
        return res.status(result.status).json(result);
    }catch(error){
        console.error("Lỗi hủy đơn:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi hủy đơn" });
    }
};

// Khách xác nhận đã nhận hàng.
// Các bước gợi ý: tìm đơn theo id VÀ user_id = req.data.userId (không cho xác nhận đơn người khác),
// chỉ cho đơn đang 'shipping', rồi đổi sang 'delivered'. Trả { message }.
const receiveOrder = async(req,res) => {
    const userId = req.data.userId
    const orderId = req.params.id
    try{
        const result = await sequelize.transaction(async(transaction) => {
            await User.findByPk(userId, {transaction, lock: transaction.LOCK.UPDATE})

            const order = await Order.findOne({
                where : {user_id: userId, id: orderId, status: "shipping"},
                transaction,
                lock: transaction.LOCK.UPDATE
            })

            if(!order) return { status: 404, error: "Không tìm thấy đơn đang giao" };

            await order.update({
                status: 'delivered'
            }, {transaction})

            return { status: 200, message: "Đã xác nhận nhận hàng" };
        })
        if (result.error) return res.status(result.status).json({ error: result.error });
        return res.status(result.status).json(result);
    }catch(error){
        console.error("Lỗi giao hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi giao hàng" });
    }
};

// PATCH /api/orders/:id      body: { status: 'cancelled' | 'delivered' }
// Khách chỉ được đổi đơn của mình sang 2 trạng thái này.
const updateOrder = (req, res) => {
    const status = req.body.status;

    if (status === 'cancelled') return cancelOrder(req, res);
    if (status === 'delivered') return receiveOrder(req, res);

    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
};

const getMyOrders = async(req,res) =>{
    const userId = req.data.userId;                
    const status = req.query.status
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const PAGE_SIZE = 3;
    const PAGINATED_STATUSES = ['all', 'cancelled'];
    const VALID = ['all', 'processing', 'shipping', 'delivered', 'cancelled'];
    try{
        if(!VALID.includes(status)) return res.status(400).json({error: "Trạng thái không hợp lệ"})
        
        const where = {user_id: userId, status: { [Op.ne]: 'pending'}}
        if(status !== 'all') where.status = status

        const paginated =  PAGINATED_STATUSES.includes(status)

        const {count, rows: orders} = await Order.findAndCountAll({
                where,
                include: [
                    {
                        model: OrderItem,
                        include: [Product]
                    }
                ],
                distinct: true,
                order: [['createdAt', 'DESC'], ['id', 'DESC']],

                ...(paginated && {
                     limit: PAGE_SIZE, 
                     offset: (page - 1) * PAGE_SIZE
                })
        })

        const totalPages = paginated ? Math.max(Math.ceil(count / PAGE_SIZE), 1) : 1;

        res.render('partials/order-list', { 
            orders,
            pagination: { page, totalPages } 
        }, (err, html) => {
            if (err) { console.error(err); return res.status(500).json({ error: 'Lỗi hệ thống' }); }
            res.json({ html, empty: orders.length === 0, page, totalPages});
        });
    }catch(error){
        console.error("Lỗi khi tải đơn hàng:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi tải đơn hàng" });
    }
}

module.exports = { placeOrder, updateOrder, cancelOrder, receiveOrder, getMyOrders };
