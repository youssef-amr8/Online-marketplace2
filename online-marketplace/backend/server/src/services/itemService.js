const Item = require('../models/item');

exports.createItem = async (data, sellerId) => {
  const item = await Item.create({ ...data, sellerId });
  return item;
};

exports.listItems = async (filter = {}, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const items = await Item.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  const count = await Item.countDocuments(filter);
  return { items, count, page, limit };
};

exports.getItemById = async (itemId) => {
  const item = await Item.findById(itemId).populate('sellerId', 'name email sellerProfile');
  return item;
};

exports.getSellerItems = async (sellerId, filter = {}, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const query = { sellerId, ...filter };
  const items = await Item.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  const count = await Item.countDocuments(query);
  return { items, count, page, limit };
};

exports.deleteItem = async (itemId, sellerId) => {
  const item = await Item.findById(itemId);
  if (!item) throw new Error('Item not found');
  if (!item.sellerId.equals(sellerId)) throw new Error('Not authorized to delete this item');
  await Item.findByIdAndDelete(itemId);
  return { message: 'Item deleted successfully' };
};

exports.updateItem = async (itemId, sellerId, data) => {
  const item = await Item.findById(itemId);
  if (!item) throw new Error('Item not found');
  if (!item.sellerId.equals(sellerId)) throw new Error('Not authorized to update this item');
  
  // Update allowed fields
  if (data.title !== undefined) item.title = data.title;
  if (data.description !== undefined) item.description = data.description;
  if (data.price !== undefined) item.price = data.price;
  if (data.stock !== undefined) item.stock = data.stock;
  if (data.category !== undefined) item.category = data.category;
  if (data.images !== undefined) item.images = data.images;
  
  await item.save();
  return item;
};