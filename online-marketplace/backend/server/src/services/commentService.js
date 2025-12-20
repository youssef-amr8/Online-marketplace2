const Comment = require('../models/comment');
const Item = require('../models/item');

exports.addComment = async ({ buyerId, itemId, text, rating, orderId }) => {
  const comment = await Comment.create({ buyerId, itemId, text, rating, orderId });
  // update item aggregates
  if (rating) {
    const item = await Item.findById(itemId);
    const newCount = item.commentsCount + 1;
    const newAvg = ((item.avgRating * item.commentsCount) + rating) / newCount;
    item.commentsCount = newCount;
    item.avgRating = newAvg;
    await item.save();
  }
  return comment;
};

exports.getCommentsByItemId = async (itemId) => {
  const comments = await Comment.find({ itemId })
    .populate('buyerId', 'name email')
    .sort({ createdAt: -1 });
  return comments;
};

exports.getCommentsTextForSummarization = async (itemId) => {
  const comments = await Comment.find({ itemId })
    .select('text rating')
    .sort({ createdAt: -1 });
  return comments.map(c => ({
    text: c.text,
    rating: c.rating || null
  }));
};

