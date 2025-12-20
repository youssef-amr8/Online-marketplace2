const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./src/routes'); // adjust if your routes folder is different
require('dotenv').config();

const app = express();

// ====================
// 1️⃣ CORS CONFIG
// ====================
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:5175', 'http://localhost:5173', 'http://192.168.1.39:3001', 'http://192.168.1.39:3002', 'http://192.168.1.39:3003'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // For dev, allow all origins - change this in production
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ====================
// 2️⃣ MIDDLEWARES
// ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ====================
// 3️⃣ ROUTES
// ====================
app.use('/api', routes);

// ====================
// 4️⃣ ERROR HANDLING
// ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ====================
// 5️⃣ DATABASE CONNECTION
// ====================
const connectDB = require('./src/config/db');
connectDB();

// ====================
// 6️⃣ START SERVER
// ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
