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