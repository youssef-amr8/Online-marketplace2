const Order = require('../models/order');
const Item = require('../models/item');
const Buyer = require('../models/buyer');
const Seller = require('../models/seller');

exports.createOrder = async ({ buyerId, items, deliveryFee }) => {
  // items: [{ itemId, quantity }]
  // fetch items and compute total
  const itemDocs = await Item.find({ _id: { $in: items.map(i => i.itemId) } });
  const itemsSnapshot = items.map(i => {
    const doc = itemDocs.find(d => d._id.equals(i.itemId));
    if (!doc) throw new Error('Item not found: ' + i.itemId);
    if (doc.stock < i.quantity) throw new Error(`Insufficient stock for ${doc.title}. Available: ${doc.stock}, Requested: ${i.quantity}`);
    return { itemId: doc._id, quantity: i.quantity, price: doc.price };
  });

  // Reduce stock for each item
  for (const item of itemsSnapshot) {
    const itemDoc = itemDocs.find(d => d._id.equals(item.itemId));
    itemDoc.stock -= item.quantity;
    await itemDoc.save();
  }

  let totalPrice = itemsSnapshot.reduce((s, it) => s + it.quantity * it.price, 0);

  // Add delivery fee if present
  const finalDeliveryFee = deliveryFee || 0;
  totalPrice += finalDeliveryFee;

  // sellerId: for simplicity assume one seller; real-case you might split per seller
  const sellerId = itemDocs[0].sellerId;
  const order = await Order.create({
    buyerId,
    sellerId,
    items: itemsSnapshot,
    totalPrice,
    deliveryFee: finalDeliveryFee
  });
  return order;
};

exports.updateStatus = async (orderId, userId, status) => {
  const order = await Order.findById(orderId).populate('items.itemId');
  if (!order) throw new Error('Order not found');

  // Convert userId to string for comparison (handles both ObjectId and string)
  const userIdStr = userId.toString();
  const sellerIdStr = order.sellerId.toString();
  const buyerIdStr = order.buyerId.toString();

  const isSeller = sellerIdStr === userIdStr;
  const isBuyer = buyerIdStr === userIdStr;

  // Handle cancellation logic
  if (status === 'Cancelled') {
    // Buyer can only cancel if order is Pending
    if (isBuyer && order.status !== 'Pending') {
      throw new Error('Buyers can only cancel pending orders');
    }
    // Seller can cancel any order except Delivered or already Cancelled
    if (isSeller && (order.status === 'Delivered' || order.status === 'Cancelled')) {
      throw new Error('Cannot cancel delivered or already cancelled orders');
    }
    // Must be either buyer or seller
    if (!isBuyer && !isSeller) {
      throw new Error('Not authorized to cancel this order');
    }

    // Restore stock for each item in the order
    for (const orderItem of order.items) {
      if (orderItem.itemId) {
        const item = await Item.findById(orderItem.itemId._id || orderItem.itemId);
        if (item) {
          item.stock += orderItem.quantity;
          await item.save();
        }
      }
    }

    // Increment refund counters
    await Buyer.findByIdAndUpdate(order.buyerId, { $inc: { refundsCount: 1 } });
    await Seller.findByIdAndUpdate(order.sellerId, { $inc: { refundsGiven: 1 } });

    order.status = 'Cancelled';
  } else if (isSeller) {
    // Seller can update to any status
    order.status = status;
  } else if (isBuyer && status === 'Delivered') {
    // Buyer can only confirm delivery
    order.status = 'Delivered';
  } else {
    throw new Error('Not authorized');
  }

  await order.save();
  return order;
};

exports.getBuyerOrders = async (buyerId) => {
  const orders = await Order.find({ buyerId })
    .populate('sellerId', '_id name email sellerProfile')
    .populate('items.itemId', 'title images price')
    .sort({ createdAt: -1 });
  return orders;
};

exports.getSellerOrders = async (sellerId) => {
  const orders = await Order.find({ sellerId })
    .populate('buyerId', 'name email')
    .populate('items.itemId', 'title images price')
    .sort({ createdAt: -1 });
  return orders;
};