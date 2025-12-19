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
