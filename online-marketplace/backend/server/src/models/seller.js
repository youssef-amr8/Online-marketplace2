const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema({
    storeName: String,
    taxId: String,
    // Serviceability & Location
    city: { type: String, default: '' },
    serviceCities: [String], // List of cities seller delivers to
    baseDeliveryFee: { type: Number, default: 50 },
    deliveryFeePerKm: { type: Number, default: 10 } // Simulated distance fee
}, { _id: false });

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'seller', immutable: true }, // Always seller
    sellerProfile: sellerProfileSchema,
    flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flag' }]
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
