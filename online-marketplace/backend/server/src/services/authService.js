const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('../utils/jwt');

exports.register = async ({ name, email, password, role, sellerProfile }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already used');
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role, sellerProfile });
  const token = jwt.sign({ id: user._id, email: user.email });
  return { user, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id, email: user.email });
  return { user, token };
};
