const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

router.post('/', auth, commentController.addComment);
router.get('/item/:itemId', commentController.getCommentsByItemId);

module.exports = router;
