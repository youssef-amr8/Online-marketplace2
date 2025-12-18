const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'reporterModel' },
  reporterModel: { type: String, required: true, enum: ['Buyer', 'Seller'] },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, refPath: 'reportedUserModel' },
  reportedUserModel: { type: String, enum: ['Buyer', 'Seller'] },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  reason: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Flag', flagSchema);
