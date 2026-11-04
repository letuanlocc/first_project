const { notImplemented } = require('../../utils/http');

// Sổ địa chỉ của người đang đăng nhập (model Address, liên kết qua user_id).
// Mọi truy vấn phải kèm where: { user_id: req.data.userId } để không đụng địa chỉ của người khác.

// POST /api/me/addresses
// body: { name, phone, city, district, ward, street, is_default }
const addAddress = notImplemented;

// PATCH /api/me/addresses/:id      body: { is_default: true } (hoặc các trường cần sửa)
// Đặt làm mặc định thì bỏ cờ mặc định của các địa chỉ khác của cùng user.
const updateAddress = notImplemented;

// DELETE /api/me/addresses/:id
const deleteAddress = notImplemented;

module.exports = { addAddress, updateAddress, deleteAddress };
