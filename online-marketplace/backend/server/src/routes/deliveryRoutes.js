const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
// const { verifyToken } = require('../middlewares/authMiddleware'); // Optional: if we want only logged in users to check

// Public route or protected? Public is fine for checking delivery costs before login
router.post('/calculate', deliveryController.calculateDeliveryFee);

module.exports = router;
