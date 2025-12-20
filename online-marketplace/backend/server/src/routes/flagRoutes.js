const express = require('express');
const router = express.Router();
const flagController = require('../controllers/flagController');
const auth = require('../middlewares/auth');

// Create a new flag
router.post('/', auth, flagController.createFlag);

// Get flags I have submitted
router.get('/my-flags', auth, flagController.getMyFlags);

// Get flags submitted against me
router.get('/against-me', auth, flagController.getFlagsAgainstMe);

// Get all flags (with optional filters)
router.get('/all', auth, flagController.getAllFlags);

// Get flag count for a specific user
router.get('/count/:userId', flagController.getFlagCount);

// Resolve a flag
router.put('/:id/resolve', auth, flagController.resolveFlag);

module.exports = router;

