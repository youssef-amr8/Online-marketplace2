const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'buyer', immutable: true }, // Always buyer
  flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flag' }]
}, { timestamps: true });

module.exports = mongoose.model('Buyer', buyerSchema);
