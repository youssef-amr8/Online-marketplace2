const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

// Public routes
router.post('/register/buyer', authController.registerBuyer);
router.post('/register/seller', authController.registerSeller);
router.post('/login/buyer', authController.loginBuyer);
router.post('/login/seller', authController.loginSeller);

// Protected route
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.put('/update/seller', authMiddleware, authController.updateSeller);
router.put('/update/buyer', authMiddleware, authController.updateBuyer);

module.exports = router;
