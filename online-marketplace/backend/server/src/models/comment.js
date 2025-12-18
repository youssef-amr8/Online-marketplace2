const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true, index: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } // optional
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
