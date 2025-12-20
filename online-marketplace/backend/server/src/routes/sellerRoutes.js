const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const auth = require('../middlewares/auth');

// Update seller's service area (protected, seller only)
// Note: We're using basic auth middleware. In production, add role verification.
router.put('/service-area', auth, sellerController.updateServiceArea);

// Get seller's service area (public)
router.get('/:id/service-area', sellerController.getServiceArea);

module.exports = router;
