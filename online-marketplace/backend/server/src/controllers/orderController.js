const orderService = require('../services/orderService');
const { success, error } = require('../utils/response');

exports.createOrder = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const buyerId = req.user.id || req.user._id;
    if (!buyerId) {
      return error(res, 'Buyer ID not found in token', 401);
    }
    const { items, deliveryFee } = req.body;
    const order = await orderService.createOrder({ buyerId, items, deliveryFee });
    success(res, order, 201);
  } catch (err) { error(res, err.message, 400); }
};

exports.updateStatus = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return error(res, 'User ID not found in token', 401);
    }
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateStatus(id, userId, status);
    success(res, order);
  } catch (err) { error(res, err.message, 400); }
};

exports.getBuyerOrders = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const buyerId = req.user.id || req.user._id;
    if (!buyerId) {
      return error(res, 'Buyer ID not found in token', 401);
    }
    const orders = await orderService.getBuyerOrders(buyerId);
    success(res, orders);
  } catch (err) { error(res, err.message); }
};

exports.getSellerOrders = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const sellerId = req.user.id || req.user._id;
    if (!sellerId) {
      return error(res, 'Seller ID not found in token', 401);
    }
    const orders = await orderService.getSellerOrders(sellerId);
    success(res, orders);
  } catch (err) { error(res, err.message); }
};