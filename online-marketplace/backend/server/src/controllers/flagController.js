const Flag = require('../models/flag');
const { success, error } = require('../utils/response');

exports.createFlag = async (req, res) => {
  try {
    const reporterId = req.user._id;
    const { reportedUserId, orderId, reason } = req.body;
    const flag = await Flag.create({ reporterId, reportedUserId, orderId, reason });
    success(res, flag, 201);
  } catch (err) { error(res, err.message, 400); }
};
