const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middlewares/auth');

// Simple authorize middleware since it's missing in auth.js
const authorize = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: Access denied' });
        }
    };
};

// All routes are protected and for sellers only
router.use(authMiddleware);
router.use(authorize('seller'));

router.get('/profile', sellerController.getProfile);
router.put('/profile', sellerController.updateProfile);

module.exports = router;
