const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURL = process.env.DB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/marketPlace';

        // Hide password in console logs for security
        const sanitizedURL = mongoURL.replace(/:([^@]+)@/, ':****@');
        console.log('🌱 Connecting to MongoDB...', sanitizedURL);

        await mongoose.connect(mongoURL);

        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
