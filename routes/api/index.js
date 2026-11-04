// Toàn bộ REST API trả JSON, gắn tại /api
const express = require('express');
const router = express.Router();

router.use('/cart', require('./cart'));
router.use('/orders', require('./orders'));
router.use('/me', require('./me'));
router.use('/', require('./reviews'));
router.use('/admin', require('./admin'));

// API không tồn tại: trả JSON thay vì trang HTML
router.use((req, res) => {
    res.status(404).json({ error: "Không tìm thấy API" });
});

module.exports = router;
