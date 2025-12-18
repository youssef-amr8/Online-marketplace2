const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true, index: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending', index: true },
  flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flag' }],
  notes: String
}, { timestamps: true });

orderSchema.index({ sellerId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
