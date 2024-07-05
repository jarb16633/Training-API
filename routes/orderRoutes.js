const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');
const {authenticateToken} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/products/:id/orders', authenticateToken, createOrder);// สร้างคำสั่งซื้อใหม่
router.get('/orders', authenticateToken, getOrders);// ดึงคำสั่งซื้อทั้งหมด


module.exports = router;