const mongoose = require('mongoose');

// Suppress Mongoose 7 deprecation warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const mongoURL = process.env.DB_URI || process.env.MONGO_URL || 'mongodb+srv://mireillemaherkhanna_db_user:mireille@cluster0.jmugj1z.mongodb.net/?appName=Cluster0';

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
