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

// Get flags I have submitted
exports.getMyFlags = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return error(res, 'User not authenticated', 401);
    }

    const flags = await Flag.find({ reporterId: userId })
      .populate('reportedUserId', 'name email')
      .populate('orderId', 'totalPrice status createdAt')
      .sort({ createdAt: -1 });

    success(res, flags);
  } catch (err) {
    console.error('Error getting my flags:', err);
    error(res, err.message, 400);
  }
};

// Get flags submitted against me
exports.getFlagsAgainstMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return error(res, 'User not authenticated', 401);
    }

    const flags = await Flag.find({ reportedUserId: userId })
      .populate('reporterId', 'name email')
      .populate('orderId', 'totalPrice status createdAt')
      .sort({ createdAt: -1 });

    success(res, flags);
  } catch (err) {
    console.error('Error getting flags against me:', err);
    error(res, err.message, 400);
  }
};

// Get all flags (admin functionality - could be restricted)
exports.getAllFlags = async (req, res) => {
  try {
    const { resolved, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (resolved !== undefined) {
      filter.resolved = resolved === 'true';
    }

    const flags = await Flag.find(filter)
      .populate('reporterId', 'name email')
      .populate('reportedUserId', 'name email')
      .populate('orderId', 'totalPrice status createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Flag.countDocuments(filter);

    success(res, { flags, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('Error getting all flags:', err);
    error(res, err.message, 400);
  }
};

// Resolve a flag (mark as resolved with optional notes)
exports.resolveFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const flag = await Flag.findByIdAndUpdate(
      id,
      { resolved: true, notes: notes || 'Resolved' },
      { new: true }
    );

    if (!flag) {
      return error(res, 'Flag not found', 404);
    }

    success(res, flag);
  } catch (err) {
    console.error('Error resolving flag:', err);
    error(res, err.message, 400);
  }
};

// Get flag count for a user (useful for displaying warning badges)
exports.getFlagCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Flag.countDocuments({
      reportedUserId: userId,
      resolved: false
    });

    success(res, { userId, unresolvedFlagCount: count });
  } catch (err) {
    console.error('Error getting flag count:', err);
    error(res, err.message, 400);
  }
};

