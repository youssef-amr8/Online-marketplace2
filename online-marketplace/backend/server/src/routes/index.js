const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/items', require('./itemRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/comments', require('./commentRoutes'));
router.use('/flags', require('./flagRoutes'));

module.exports = router;
