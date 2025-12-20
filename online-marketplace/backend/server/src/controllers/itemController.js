const itemService = require('../services/itemService');
const { success, error } = require('../utils/response');

exports.createItem = async (req, res) => {
  try {
    const data = req.body;
    // JWT token contains 'id', not '_id'
    const sellerId = req.user.id || req.user._id;
    console.log('[DEBUG] createItem - User from token:', req.user);
    console.log('[DEBUG] createItem - Extracted sellerId:', sellerId);
    if (!sellerId) {
      return error(res, 'Seller ID not found in token', 401);
    }
    const item = await itemService.createItem(data, sellerId);
    console.log('[DEBUG] createItem - Created Item:', item);
    success(res, item, 201);
  } catch (err) {
    console.error('[DEBUG] createItem - Error:', err);
    error(res, err.message, 400);
  }
};

exports.listItems = async (req, res) => {
  try {
    const { page, limit, category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q };
    const result = await itemService.listItems(filter, { page: +page || 1, limit: +limit || 20 });
    success(res, result);
  } catch (err) { error(res, err.message); }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return error(res, 'Item not found', 404);
    }
    success(res, item);
  } catch (err) { error(res, err.message); }
};

exports.getSellerItems = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const sellerId = req.user.id || req.user._id;
    console.log('[DEBUG] getSellerItems - User from token:', req.user);
    console.log('[DEBUG] getSellerItems - Extracted sellerId:', sellerId);
    if (!sellerId) {
      return error(res, 'Seller ID not found in token', 401);
    }
    const { page, limit } = req.query;
    const result = await itemService.getSellerItems(sellerId, {}, { page: +page || 1, limit: +limit || 20 });
    console.log(`[DEBUG] getSellerItems - Found ${result.items.length} items for seller ${sellerId}`);
    success(res, result);
  } catch (err) {
    console.error('[DEBUG] getSellerItems - Error:', err);
    error(res, err.message);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const sellerId = req.user.id || req.user._id;
    if (!sellerId) {
      return error(res, 'Seller ID not found in token', 401);
    }
    const { id } = req.params;
    await itemService.deleteItem(id, sellerId);
    success(res, { message: 'Item deleted successfully' });
  } catch (err) { error(res, err.message, 400); }
};

exports.updateItem = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const sellerId = req.user.id || req.user._id;
    if (!sellerId) {
      return error(res, 'Seller ID not found in token', 401);
    }
    const { id } = req.params;
    const data = req.body;
    const item = await itemService.updateItem(id, sellerId, data);
    success(res, item);
  } catch (err) { error(res, err.message, 400); }
};

/**
 * Get items deliverable to a specific location
 * POST /api/items/by-location
 */
exports.getItemsByLocation = async (req, res) => {
  try {
    const { userLocation, city, page, limit, category } = req.body;
    // userLocation: { lat: Number, lng: Number }
    // city: String

    if (!city && !userLocation) {
      return error(res, 'Either city or userLocation is required', 400);
    }

    // Haversine formula to calculate distance
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    const itemService = require('../services/itemService');
    const Seller = require('../models/seller');

    // Get all items (with optional category filter)
    const filter = {};
    if (category) filter.category = category;

    const pageNum = +page || 1;
    const limitNum = +limit || 20;
    const allItems = await itemService.listItems(filter, { page: pageNum, limit: limitNum });

    // Filter items based on seller's service area
    const deliverableItems = [];

    for (const item of allItems.items) {
      const seller = await Seller.findById(item.sellerId);
      if (!seller || !seller.sellerProfile) {
        // If seller has no profile, skip
        continue;
      }

      const settings = seller.sellerProfile.deliverySettings;
      const sellerLoc = seller.sellerProfile.location?.coordinates; // [lng, lat]

      let isDeliverable = false;

      // Check city-based delivery
      if (city && settings?.serviceableCities && settings.serviceableCities.length > 0) {
        const found = settings.serviceableCities.find(c => c.toLowerCase() === city.toLowerCase());
        if (found) {
          isDeliverable = true;
        }
      }

      // Check radius-based delivery if location provided
      if (!isDeliverable && userLocation && userLocation.lat && userLocation.lng && sellerLoc) {
        const sellerLng = sellerLoc[0];
        const sellerLat = sellerLoc[1];
        const distance = calculateDistance(sellerLat, sellerLng, userLocation.lat, userLocation.lng);

        if (settings?.maxDeliveryRange && settings.maxDeliveryRange > 0) {
          if (distance <= settings.maxDeliveryRange) {
            isDeliverable = true;
          }
        }
      }

      if (isDeliverable) {
        deliverableItems.push(item);
      }
    }

    return success(res, {
      items: deliverableItems,
      total: deliverableItems.length,
      page: pageNum,
      limit: limitNum
    });

  } catch (err) {
    console.error('[itemController] getItemsByLocation error:', err);
    error(res, err.message);
  }
};