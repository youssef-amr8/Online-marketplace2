const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

router.get('/', auth, orderController.getBuyerOrders); // buyer gets their orders
router.get('/seller', auth, orderController.getSellerOrders); // seller gets their orders
router.post('/', auth, orderController.createOrder); // buyer
router.patch('/:id/status', auth, orderController.updateStatus); // seller updates status

module.exports = router;
