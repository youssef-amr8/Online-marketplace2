exports.success = (res, data, status=200) => res.status(status).json({ success: true, data });
exports.error = (res, message='Error', status=500) => res.status(status).json({ success: false, message });
