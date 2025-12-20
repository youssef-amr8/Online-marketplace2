const Buyer = require('../models/buyer');
const Seller = require('../models/seller');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');

// Helper to register a user (buyer or seller)
const registerUser = async (req, res, Model, role) => {
  try {
    const { name, email, password } = req.body; // role irrelevant in body now

    // Check if user exists
    const existingUser = await Model.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new Model({ name, email, passwordHash });
    // If seller, we might want to handle sellerProfile but keeping it simple for now or expecting in body
    if (role === 'seller' && req.body.sellerProfile) {
      user.sellerProfile = req.body.sellerProfile;
    }

    await user.save();

    // Generate token
    const token = jwt.generateToken({ id: user._id, role: user.role });

    // Send token as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Register Buyer
const registerBuyer = async (req, res) => {
  await registerUser(req, res, Buyer, 'buyer');
};

// Register Seller
const registerSeller = async (req, res) => {
  await registerUser(req, res, Seller, 'seller');
};

// Helper to login a user
const loginUser = async (req, res, Model) => {
  try {
    const { email, password } = req.body;

    const user = await Model.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.generateToken({ id: user._id, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Login Buyer
const loginBuyer = async (req, res) => {
  await loginUser(req, res, Buyer);
};

// Login Seller
const loginSeller = async (req, res) => {
  await loginUser(req, res, Seller);
};

// Logout user
const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Logout failed', error: err.message });
  }
};

// Get current logged-in user
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const role = req.user.role;

    let user;
    if (role === 'buyer') {
      user = await Buyer.findById(userId).select('-passwordHash');
    } else if (role === 'seller') {
      user = await Seller.findById(userId).select('-passwordHash');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get user', error: err.message });
  }
};

module.exports = {
  registerBuyer,
  registerSeller,
  loginBuyer,
  loginSeller,
  logout,
  getMe,
};
