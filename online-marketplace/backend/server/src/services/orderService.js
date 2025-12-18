const Order = require('../models/order');
const Item = require('../models/item');

exports.createOrder = async ({ buyerId, items }) => {
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
  
  const totalPrice = itemsSnapshot.reduce((s, it) => s + it.quantity * it.price, 0);
  // sellerId: for simplicity assume one seller; real-case you might split per seller
  const sellerId = itemDocs[0].sellerId;
  const order = await Order.create({ buyerId, sellerId, items: itemsSnapshot, totalPrice });
  return order;
};

exports.updateStatus = async (orderId, sellerId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');
  if (!order.sellerId.equals(sellerId)) throw new Error('Not authorized');
  order.status = status;
  await order.save();
  return order;
};

exports.getBuyerOrders = async (buyerId) => {
  const orders = await Order.find({ buyerId })
    .populate('sellerId', 'name email sellerProfile')
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