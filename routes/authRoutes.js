const express = require('express');
const { register, login, approveUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/approve/:id', authenticateToken, approveUser);

module.exports = router;
