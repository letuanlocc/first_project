// Dùng tạm cho các API chưa viết logic.
const notImplemented = (req, res) => {
    return res.status(501).json({ error: "Chức năng này chưa được xử lý" });
};

module.exports = { notImplemented };
