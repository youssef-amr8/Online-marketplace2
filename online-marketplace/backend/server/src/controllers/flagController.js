const Flag = require('../models/flag');
const { success, error } = require('../utils/response');

exports.createFlag = async (req, res) => {
  try {
    const reporterId = req.user?.id || req.user?._id;
    const { reportedUserId, reporterModel, reportedUserModel, orderId, reason } = req.body;

    if (!reporterId) {
      return error(res, 'User not authenticated. Please log in.', 401);
    }

    if (!reporterModel || !reportedUserModel) {
      return error(res, 'reporterModel and reportedUserModel are required', 400);
    }

    if (!reportedUserId) {
      return error(res, 'reportedUserId is required', 400);
    }

    if (!reason || !reason.trim()) {
      return error(res, 'reason is required', 400);
    }

    const flag = await Flag.create({
      reporterId,
      reporterModel,
      reportedUserId,
      reportedUserModel,
      orderId: orderId || undefined,
      reason: reason.trim()
    });
    success(res, flag, 201);
  } catch (err) {
    console.error('Flag creation error:', err);
    error(res, err.message, 400);
  }
};

exports.listFlags = async (req, res) => {
  try {
    const { resolved } = req.query;
    const filter = {};
    if (resolved !== undefined) {
      filter.resolved = resolved === 'true';
    }
    const flags = await Flag.find(filter)
      .populate('reporterId', 'name email')
      .populate('reportedUserId', 'name email')
      .populate('orderId', 'totalPrice status')
      .sort({ createdAt: -1 });
    success(res, flags);
  } catch (err) {
    error(res, err.message, 400);
  }
};

exports.resolveFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const flag = await Flag.findById(id);
    if (!flag) {
      return error(res, 'Flag not found', 404);
    }
    flag.resolved = true;
    if (notes) flag.notes = notes;
    await flag.save();
    success(res, flag);
  } catch (err) {
    error(res, err.message, 400);
  }
};
