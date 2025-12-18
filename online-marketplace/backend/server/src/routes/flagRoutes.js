const express = require('express');
const router = express.Router();
const flagController = require('../controllers/flagController');
const auth = require('../middlewares/auth');

router.post('/', auth, flagController.createFlag);

module.exports = router;
