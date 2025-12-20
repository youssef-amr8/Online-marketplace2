const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema({
    storeName: String,
    storeDescription: String,
    taxId: String,
    // Serviceability & Location
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
        address: String
    },
    deliverySettings: {
        maxDeliveryRange: { type: Number, default: 0 }, // in km (deprecated or secondary)
        serviceableCities: { type: [String], default: [] },
        baseDeliveryFee: { type: Number, default: 0 },
        pricePerKm: { type: Number, default: 0 }
    }
}, { _id: false });

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: 'seller', immutable: true }, // Always seller
    sellerProfile: sellerProfileSchema,
    flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flag' }],
    refundsGiven: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
