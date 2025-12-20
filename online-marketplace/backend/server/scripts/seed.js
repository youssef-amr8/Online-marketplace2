// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Seller = require('../src/models/seller');
const Buyer = require('../src/models/buyer');
const Item = require('../src/models/item');
const Category = require('../src/models/category');

const mongoURL = process.env.DB_URI || 'mongodb://localhost:27017/marketPlace';

// Categories to create
const categories = [
  { name: "Mobiles & Tablets", slug: "mobiles-tablets" },
  { name: "Laptops & Computers", slug: "laptops-computers" },
  { name: "TVs & Entertainment", slug: "tvs-entertainment" },
  { name: "Cameras & Accessories", slug: "cameras-accessories" },
  { name: "Smartwatches & Wearables", slug: "smartwatches-wearables" },
  { name: "Headphones & Speakers", slug: "headphones-speakers" },
  { name: "Gaming Consoles", slug: "gaming-consoles" },
  { name: "Women's Clothing", slug: "womens-clothing" },
  { name: "Women's Shoes", slug: "womens-shoes" },
  { name: "Women's Bags", slug: "womens-bags" },
  { name: "Women's Jewelry", slug: "womens-jewelry" },
  { name: "Men's Clothing", slug: "mens-clothing" },
  { name: "Men's Shoes", slug: "mens-shoes" },
  { name: "Men's Accessories", slug: "mens-accessories" },
  { name: "Skincare", slug: "skincare" },
  { name: "Makeup", slug: "makeup" },
  { name: "Haircare", slug: "haircare" },
  { name: "Fragrances", slug: "fragrances" },
  { name: "Bath & Body", slug: "bath-body" },
  { name: "Health & Wellness", slug: "health-wellness" },
  { name: "Kids & Baby", slug: "baby-clothing" }
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Item.deleteMany({});
    await Seller.deleteMany({});
    await Buyer.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create categories
    console.log('📁 Creating categories...');
    await Category.insertMany(categories);
    console.log(`✅ Created ${categories.length} categories`);

    console.log('\n🎉 Database cleared and categories reset successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Sellers: 0`);
    console.log(`   - Buyers: 0`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: 0`);
    console.log('\n💡 The app is now fresh and ready for real users!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

seedDatabase();
