const express = require('express');
const router = express.Router();
const flagController = require('../controllers/flagController');
const auth = require('../middlewares/auth');

router.get('/', auth, flagController.listFlags);
router.post('/', auth, flagController.createFlag);
router.patch('/:id/resolve', auth, flagController.resolveFlag);

module.exports = router;
