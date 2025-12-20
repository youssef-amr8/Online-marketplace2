const mongoose = require('mongoose');

const buyerProfileSchema = new mongoose.Schema({
  defaultLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    address: String,
    city: String
  }
}, { _id: false });

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'buyer', immutable: true }, // Always buyer
  buyerProfile: buyerProfileSchema,
  flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flag' }],
  refundsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Buyer', buyerSchema);
