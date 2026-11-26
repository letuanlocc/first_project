// Toàn bộ REST API trả JSON, gắn tại /api
import { Router } from 'express';
import cartRoutes from './cart.js';
import orderRoutes from './orders.js';
import meRoutes from './me.js';
import reviewRoutes from './reviews.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/me', meRoutes);
router.use('/', reviewRoutes);
router.use('/admin', adminRoutes);

// API không tồn tại: trả JSON thay vì trang HTML
router.use((req, res) => {
    res.status(404).json({ error: "Không tìm thấy API" });
});

export default router;
