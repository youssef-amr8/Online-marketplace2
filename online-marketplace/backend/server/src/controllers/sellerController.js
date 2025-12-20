const Seller = require('../models/seller');
const { success, error } = require('../utils/response');

/**
 * Update seller's service area configuration
 * PUT /api/sellers/service-area
 */
exports.updateServiceArea = async (req, res) => {
    try {
        const sellerId = req.user.id || req.user._id;
        if (!sellerId) {
            return error(res, 'Seller ID not found in token', 401);
        }

        const { location, deliverySettings } = req.body;

        // Validate location if provided
        if (location && location.coordinates) {
            if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
                return error(res, 'Invalid location coordinates. Expected [longitude, latitude]', 400);
            }
            const [lng, lat] = location.coordinates;
            if (typeof lng !== 'number' || typeof lat !== 'number') {
                return error(res, 'Coordinates must be numbers', 400);
            }
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return error(res, 'Invalid coordinates range', 400);
            }
        }

        // Validate delivery settings if provided
        if (deliverySettings) {
            if (deliverySettings.maxDeliveryRange !== undefined && deliverySettings.maxDeliveryRange < 0) {
                return error(res, 'Max delivery range must be non-negative', 400);
            }
            if (deliverySettings.baseDeliveryFee !== undefined && deliverySettings.baseDeliveryFee < 0) {
                return error(res, 'Base delivery fee must be non-negative', 400);
            }
            if (deliverySettings.pricePerKm !== undefined && deliverySettings.pricePerKm < 0) {
                return error(res, 'Price per km must be non-negative', 400);
            }
        }

        // Build update object
        const updateData = {};
        if (location) {
            updateData['sellerProfile.location'] = location;
        }
        if (deliverySettings) {
            if (deliverySettings.maxDeliveryRange !== undefined) {
                updateData['sellerProfile.deliverySettings.maxDeliveryRange'] = deliverySettings.maxDeliveryRange;
            }
            if (deliverySettings.serviceableCities !== undefined) {
                updateData['sellerProfile.deliverySettings.serviceableCities'] = deliverySettings.serviceableCities;
            }
            if (deliverySettings.baseDeliveryFee !== undefined) {
                updateData['sellerProfile.deliverySettings.baseDeliveryFee'] = deliverySettings.baseDeliveryFee;
            }
            if (deliverySettings.pricePerKm !== undefined) {
                updateData['sellerProfile.deliverySettings.pricePerKm'] = deliverySettings.pricePerKm;
            }
        }

        const seller = await Seller.findByIdAndUpdate(
            sellerId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('sellerProfile.location sellerProfile.deliverySettings');

        if (!seller) {
            return error(res, 'Seller not found', 404);
        }

        return success(res, {
            location: seller.sellerProfile?.location,
            deliverySettings: seller.sellerProfile?.deliverySettings
        });

    } catch (err) {
        console.error('[sellerController] updateServiceArea error:', err);
        return error(res, err.message, 500);
    }
};

/**
 * Get seller's service area configuration
 * GET /api/sellers/:id/service-area
 */
exports.getServiceArea = async (req, res) => {
    try {
        const { id } = req.params;

        const seller = await Seller.findById(id)
            .select('name email sellerProfile.storeName sellerProfile.location sellerProfile.deliverySettings');

        if (!seller) {
            return error(res, 'Seller not found', 404);
        }

        return success(res, {
            sellerId: seller._id,
            name: seller.name,
            storeName: seller.sellerProfile?.storeName,
            location: seller.sellerProfile?.location,
            deliverySettings: seller.sellerProfile?.deliverySettings
        });

    } catch (err) {
        console.error('[sellerController] getServiceArea error:', err);
        return error(res, err.message, 500);
    }
};
