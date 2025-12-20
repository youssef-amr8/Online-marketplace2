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

    // Customize response based on role
    const userData = { id: user._id, name: user.name, email: user.email, role: user.role };
    if (user.role === 'seller') {
      userData.phone = user.phone;
      userData.storeName = user.sellerProfile?.storeName;
      userData.storeDescription = user.sellerProfile?.storeDescription;
    }

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userData
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

    // Customize response based on role
    const userData = { id: user._id, name: user.name, email: user.email, role: user.role };
    if (user.role === 'seller') {
      userData.phone = user.phone;
      userData.storeName = user.sellerProfile?.storeName;
      userData.storeDescription = user.sellerProfile?.storeDescription;
    }

    res.status(200).json({
      success: true,
      data: {
        token,
        user: userData
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
    // Clear the cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

// Update Seller
const updateSeller = async (req, res) => {
  try {
    const { name, phone, storeName, storeDescription, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await Seller.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    // Update profile fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Ensure sellerProfile exists
    if (!user.sellerProfile) {
      user.sellerProfile = {};
    }

    if (storeName) user.sellerProfile.storeName = storeName;
    if (storeDescription) user.sellerProfile.storeDescription = storeDescription;

    // Handle Serviceability updates
    const { location, deliverySettings } = req.body;
    if (location) {
      // Ensure structure: { type: 'Point', coordinates: [lng, lat], address: '...' }
      if (!user.sellerProfile.location) {
        user.sellerProfile.location = {};
      }
      user.sellerProfile.location = {
        type: 'Point',
        coordinates: location.coordinates || [0, 0],
        address: location.address || ''
      };
    }
    if (deliverySettings) {
      if (!user.sellerProfile.deliverySettings) {
        user.sellerProfile.deliverySettings = {};
      }
      user.sellerProfile.deliverySettings = {
        maxDeliveryRange: deliverySettings.maxDeliveryRange !== undefined ? deliverySettings.maxDeliveryRange : 0,
        serviceableCities: deliverySettings.serviceableCities || [],
        baseDeliveryFee: deliverySettings.baseDeliveryFee !== undefined ? deliverySettings.baseDeliveryFee : 0,
        pricePerKm: deliverySettings.pricePerKm !== undefined ? deliverySettings.pricePerKm : 0
      };
    }

    // Mark the sellerProfile as modified to ensure Mongoose saves it
    user.markModified('sellerProfile');

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          storeName: user.sellerProfile?.storeName,
          storeDescription: user.sellerProfile?.storeDescription,
          location: user.sellerProfile?.location,
          deliverySettings: user.sellerProfile?.deliverySettings
        }
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Update Buyer
const updateBuyer = async (req, res) => {
  try {
    const { name, city, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await Buyer.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    // Update profile fields
    if (name) user.name = name;

    // Ensure buyerProfile exists
    if (!user.buyerProfile) {
      user.buyerProfile = { defaultLocation: {} };
    }
    if (!user.buyerProfile.defaultLocation) {
      user.buyerProfile.defaultLocation = {};
    }

    // Update city
    if (city !== undefined) {
      user.buyerProfile.defaultLocation.city = city;
    }

    // Mark the buyerProfile as modified to ensure Mongoose saves it
    user.markModified('buyerProfile');

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          city: user.buyerProfile?.defaultLocation?.city
        }
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

module.exports = {
  registerBuyer,
  registerSeller,
  loginBuyer,
  loginSeller,
  logout,
  updateSeller,
  updateBuyer
};
