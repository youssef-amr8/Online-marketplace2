const commentService = require('../services/commentService');
const { success, error } = require('../utils/response');

exports.addComment = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const buyerId = req.user.id || req.user._id;
    if (!buyerId) {
      return error(res, 'Buyer ID not found in token', 401);
    }
    const { itemId, text, rating, orderId } = req.body;
    const comment = await commentService.addComment({ buyerId, itemId, text, rating, orderId });
    success(res, comment, 201);
  } catch (err) { error(res, err.message, 400); }
};

exports.getCommentsByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const comments = await commentService.getCommentsByItemId(itemId);
    success(res, comments);
  } catch (err) { error(res, err.message, 400); }
};