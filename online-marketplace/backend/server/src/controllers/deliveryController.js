const Seller = require('../models/seller');
const { success, error } = require('../utils/response');

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

exports.calculateDeliveryFee = async (req, res) => {
    try {
        const { sellerId, userLocation, city } = req.body;
        // userLocation: { lat: Number, lng: Number }
        // city: String

        if (!sellerId) {
            return error(res, 'Missing required fields: sellerId', 400);
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) return error(res, 'Seller not found', 404);

        const settings = seller.sellerProfile?.deliverySettings;

        // 1. Check City Availability
        if (city && settings?.serviceableCities && settings.serviceableCities.length > 0) {
            // Case-insensitive check
            const found = settings.serviceableCities.find(c => c.toLowerCase() === city.toLowerCase());
            if (!found) {
                return success(res, {
                    deliverable: false,
                    distance: 0,
                    message: `Seller does not deliver to ${city}.`
                });
            }
        }

        const sellerLoc = seller.sellerProfile?.location?.coordinates; // [lng, lat]

        if (!sellerLoc || !settings) {
            // If seller hasn't set up location, maybe assume standard delivery or undeliverable?
            // For now, let's say deliverable with base fee if settings missing, but better to return default.
            return success(res, {
                deliverable: true,
                fee: 0,
                distance: 0,
                message: 'Seller has not configured delivery settings. Free delivery assumed.'
            });
        }

        // If no user location provided but city was valid, return base fee
        if (!userLocation || !userLocation.lat || !userLocation.lng) {
            return success(res, {
                deliverable: true,
                fee: settings.baseDeliveryFee,
                distance: 0,
                message: 'Base delivery fee applied.'
            });
        }

        // coordinates in mongo are [lng, lat]
        const sellerLng = sellerLoc[0];
        const sellerLat = sellerLoc[1];

        const distance = calculateDistance(sellerLat, sellerLng, userLocation.lat, userLocation.lng);

        if (distance > settings.maxDeliveryRange && settings.maxDeliveryRange > 0) {
            return success(res, {
                deliverable: false,
                distance: Math.round(distance * 100) / 100,
                message: 'Location is out of delivery range.'
            });
        }

        const fee = settings.baseDeliveryFee + (distance * settings.pricePerKm);

        return success(res, {
            deliverable: true,
            distance: Math.round(distance * 100) / 100,
            fee: Math.round(fee * 100) / 100 // Round to 2 decimals
        });

    } catch (err) {
        return error(res, err.message, 500);
    }
};
