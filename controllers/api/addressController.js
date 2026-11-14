const { notImplemented } = require('../../utils/http');
const { sequelize, Product, OrderItem, Order, User, Address } = require('../../models/index');

// Sổ địa chỉ của người đang đăng nhập (model Address, liên kết qua user_id).
// Mọi truy vấn phải kèm where: { user_id: req.data.userId } để không đụng địa chỉ của người khác.

// POST /api/me/addresses
// body: { name, phone, city, district, ward, street, is_default }
const addAddress = async(req,res) => {
    const { name, phone, city, district, ward, street, is_default } = req.body
    const userId = req.data.userId

    if (!name || !phone || !city || !district || !ward || !street) {
        return res.status(400).json({ error: "Thiếu thông tin địa chỉ" });
    }

    const t = await sequelize.transaction();
    try{
        if (is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id: userId }, transaction: t }
            );
        }

        const address = await Address.create({
            user_id: userId,
            name, phone, city, district, ward, street,
            is_default: !!is_default
        }, { transaction: t });

        await t.commit();
        return res.status(201).json(address);

    }catch(error){
        await t.rollback();
        console.error("Lỗi khi thêm địa chỉ:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi thêm địa chỉ" });
    }
};

// PATCH /api/me/addresses/:id      body: { is_default: true } (hoặc các trường cần sửa)
// Đặt làm mặc định thì bỏ cờ mặc định của các địa chỉ khác của cùng user.
const updateAddress = async(req,res) => {
    const id = req.params.id
    const userId = req.data.userId
    const {is_default} = req.body

    const t = await sequelize.transaction()

    try{
        const address = await Address.findOne({
            where: {id, user_id: userId},
            transaction: t
        })

        if(!address){
            await t.rollback()
            return res.status(404).json({error: "Không tìm ra địa chỉ"})
        } 
        if(is_default) await Address.update({ is_default: false }, { where: { user_id: userId }, transaction: t });

        await address.update({is_default: !!is_default}, {transaction: t})

        await t.commit()
        return res.status(200).json(address);
    }catch(error){
        await t.rollback();
        console.error("Lỗi khi thiết lập mặc định:", error);
        return res.status(500).json({ error: "Lỗi hệ thống khi thiết lập mặc định" });
    }
};

// DELETE /api/me/addresses/:id
const deleteAddress = notImplemented;

module.exports = { addAddress, updateAddress, deleteAddress };
