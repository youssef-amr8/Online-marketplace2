const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  title: { type: String, required: true, trim: true, index: true },
  description: String,
  category: { type: String, index: true },
  price: { type: Number, required: true },
  deliveryTimeEstimate: Number,
  images: [String],
  ratings: [{ type: Number }],
  avgRating: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  stock: { type: Number, default: 1 }
}, { timestamps: true });

// compound index example
itemSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Item', itemSchema);
