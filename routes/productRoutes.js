const express = require('express')
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductOrdersById } = require('../controllers/productController');
const {authenticateToken} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/products', authenticateToken, createProduct);
router.get('/products', authenticateToken, getProducts);
router.get('/products/:id', authenticateToken, getProductById);
router.put('/products/:id', authenticateToken, updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);
router.get('/products/:id/orders', authenticateToken, getProductOrdersById) //ดึง Order จาก productID

module.exports = router;