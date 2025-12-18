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
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
