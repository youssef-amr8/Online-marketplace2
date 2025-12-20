const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const auth = require('../middlewares/auth');

router.get('/', itemController.listItems);
router.get('/seller', auth, itemController.getSellerItems); // seller gets their items
router.get('/:id', itemController.getItemById);
router.post('/by-location', itemController.getItemsByLocation); // Filter by buyer location
router.post('/', auth, itemController.createItem); // seller-only check in controller/service
router.put('/:id', auth, itemController.updateItem); // seller updates their item
router.delete('/:id', auth, itemController.deleteItem); // seller deletes their item

module.exports = router;
