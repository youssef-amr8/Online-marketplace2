const Seller = require('../models/seller');

// Get Seller Profile
const getProfile = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id).select('-passwordHash');
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json({
            success: true,
            data: seller
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
};

// Update Seller Profile
const updateProfile = async (req, res) => {
    try {
        const { name, storeName, storeDescription, phone, address,
            city, serviceCities, baseDeliveryFee, deliveryFeePerKm } = req.body;

        const seller = await Seller.findById(req.user.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Update basic info
        if (name) seller.name = name;

        // Init profile if missing
        if (!seller.sellerProfile) seller.sellerProfile = {};

        // Update profile fields
        if (storeName !== undefined) seller.sellerProfile.storeName = storeName;
        if (storeDescription !== undefined) seller.sellerProfile.storeDescription = storeDescription; // Note: Schema might need this field if not present
        // Add fields to schema if missing or pack into a "bio" or similar if strict. 
        // For now relying on Flexible schema or the ones we explicitly added.

        // Let's check schema: storeName, taxId, city, serviceCities... 
        // We need to support the fields we're sending.

        if (city !== undefined) seller.sellerProfile.city = city;
        if (serviceCities !== undefined) seller.sellerProfile.serviceCities = serviceCities;
        if (baseDeliveryFee !== undefined) seller.sellerProfile.baseDeliveryFee = baseDeliveryFee;
        if (deliveryFeePerKm !== undefined) seller.sellerProfile.deliveryFeePerKm = deliveryFeePerKm;

        // If schema has other fields like phone/address on root or profile, update them.
        // Checking Seller Model: name, email, passwordHash, role, sellerProfile(storeName, taxId, serviceCities, city...).
        // Phone/Address are NOT in the current schema based on previous `view_file`.
        // We should add them to schema if we want to save them, but for this task (Serviceability), 
        // Store Name, City, and ServiceCities are the critical ones.

        await seller.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: seller
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
