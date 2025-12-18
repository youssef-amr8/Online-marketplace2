// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Seller = require('../src/models/seller');
const Buyer = require('../src/models/buyer');
const Item = require('../src/models/item');
const Category = require('../src/models/category');

const mongoURL = process.env.DB_URI || 'mongodb://localhost:27017/marketPlace';

// Demo products data
const demoProducts = [
  // Electronics - Mobiles & Tablets
  {
    title: "iPhone 15 Pro Max",
    description: "Latest Apple iPhone with A17 Pro chip, 6.7-inch Super Retina XDR display, 256GB storage",
    category: "mobiles-tablets",
    price: 39999,
    deliveryTimeEstimate: 1,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop"],
    stock: 50
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Samsung flagship with Snapdragon 8 Gen 3, S Pen, and 200MP camera",
    category: "mobiles-tablets",
    price: 34999,
    deliveryTimeEstimate: 1,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop"],
    stock: 45
  },
  {
    title: "iPad Pro 12.9-inch",
    description: "Apple's most advanced iPad with M2 chip and Liquid Retina XDR display",
    category: "mobiles-tablets",
    price: 45999,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"],
    stock: 30
  },

  // Electronics - Laptops
  {
    title: "MacBook Pro 16-inch",
    description: "Apple M3 Pro chip, 16-inch Liquid Retina XDR display, 512GB SSD",
    category: "laptops-computers",
    price: 89999,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop"],
    stock: 25
  },
  {
    title: "Dell XPS 15",
    description: "Intel Core i9, 15.6-inch OLED display, NVIDIA RTX 4060, 1TB SSD",
    category: "laptops-computers",
    price: 64999,
    deliveryTimeEstimate: 3,
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop"],
    stock: 20
  },

  // Electronics - TVs
  {
    title: "Samsung 75-inch QLED 4K TV",
    description: "Quantum HDR, Smart TV with Alexa Built-in, 120Hz refresh rate",
    category: "tvs-entertainment",
    price: 79999,
    deliveryTimeEstimate: 5,
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop"],
    stock: 15
  },
  {
    title: "LG 65-inch OLED 4K TV",
    description: "OLED evo, α9 AI Processor 4K Gen6, Dolby Vision IQ",
    category: "tvs-entertainment",
    price: 89999,
    deliveryTimeEstimate: 5,
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop"],
    stock: 12
  },

  // Electronics - Headphones
  {
    title: "Sony WH-1000XM5",
    description: "Wireless Noise Cancelling Headphones, 30-hour battery life",
    category: "headphones-speakers",
    price: 12999,
    deliveryTimeEstimate: 1,
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop"],
    stock: 60
  },
  {
    title: "Apple AirPods Pro (2nd Gen)",
    description: "Active Noise Cancellation, Adaptive Transparency, USB-C charging",
    category: "headphones-speakers",
    price: 9999,
    deliveryTimeEstimate: 1,
    images: ["https://images.unsplash.com/photo-1593358167138-43cce00dadd5?w=400&h=400&fit=crop"],
    stock: 80
  },

  // Gaming
  {
    title: "PlayStation 5",
    description: "Ultra-high speed SSD, 4K gaming, DualSense wireless controller",
    category: "gaming-consoles",
    price: 24999,
    deliveryTimeEstimate: 3,
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop"],
    stock: 35
  },
  {
    title: "Xbox Series X",
    description: "4K gaming, 1TB SSD, 12 teraflops of processing power",
    category: "gaming-consoles",
    price: 22999,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1621259182978-fbf83132d5c2?w=400&h=400&fit=crop"],
    stock: 40
  },

  // Fashion - Women's
  {
    title: "Women's Summer Dress",
    description: "Floral print, cotton blend, midi length, perfect for casual outings",
    category: "womens-clothing",
    price: 1299,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=400&fit=crop"],
    stock: 100
  },
  {
    title: "Women's Leather Handbag",
    description: "Genuine leather, crossbody style, multiple compartments",
    category: "womens-bags",
    price: 3499,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"],
    stock: 50
  },

  // Fashion - Men's
  {
    title: "Men's Casual Shirt",
    description: "100% cotton, slim fit, regular collar, available in multiple colors",
    category: "mens-clothing",
    price: 899,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop"],
    stock: 120
  },
  {
    title: "Men's Leather Shoes",
    description: "Genuine leather, formal style, cushioned insole for comfort",
    category: "mens-shoes",
    price: 2999,
    deliveryTimeEstimate: 3,
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop"],
    stock: 70
  },

  // Beauty & Personal Care
  {
    title: "Vitamin C Serum",
    description: "Brightening serum with hyaluronic acid, 30ml, anti-aging formula",
    category: "skincare",
    price: 1299,
    deliveryTimeEstimate: 1,
    images: ["https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop"],
    stock: 90
  },
  {
    title: "Matte Lipstick Set (6 Shades)",
    description: "Long-lasting, vegan, cruelty-free, highly pigmented colors",
    category: "makeup",
    price: 1499,
    deliveryTimeEstimate: 1,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"],
    stock: 75
  },

  // Kids & Baby
  {
    title: "Baby Onesies Pack (3 Pieces)",
    description: "100% cotton, soft fabric, snap closures, sizes 0-12 months",
    category: "kids-baby",
    price: 699,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop"],
    stock: 150
  },
  {
    title: "Kids School Backpack",
    description: "Water-resistant, multiple compartments, ergonomic straps",
    category: "kids-baby",
    price: 1299,
    deliveryTimeEstimate: 2,
    images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop"],
    stock: 85
  }
];

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
  { name: "Kids & Baby", slug: "kids-baby" }
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(mongoURL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Item.deleteMany({});
    await Seller.deleteMany({ email: 'demo@seller.com' });
    await Buyer.deleteMany({ email: 'demo@buyer.com' });
    await Category.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create categories
    console.log('📁 Creating categories...');
    await Category.insertMany(categories);
    console.log(`✅ Created ${categories.length} categories`);

    // Create demo seller
    console.log('👤 Creating demo seller...');
    const hashedSellerPassword = await bcrypt.hash('demo123', 10);
    const seller = await Seller.create({
      name: 'Demo Seller',
      email: 'demo@seller.com',
      passwordHash: hashedSellerPassword,
      sellerProfile: {
        storeName: 'Demo Electronics & More',
        taxId: 'TAX123456'
      }
    });
    console.log('✅ Created demo seller:', seller.name);

    // Create demo buyer
    console.log('👤 Creating demo buyer...');
    const hashedBuyerPassword = await bcrypt.hash('demo123', 10);
    const buyer = await Buyer.create({
      name: 'Demo Buyer',
      email: 'demo@buyer.com',
      passwordHash: hashedBuyerPassword
    });
    console.log('✅ Created demo buyer:', buyer.name);

    // Create demo products
    console.log('📦 Creating demo products...');
    const productsWithSeller = demoProducts.map(product => ({
      ...product,
      sellerId: seller._id
    }));

    const items = await Item.insertMany(productsWithSeller);
    console.log(`✅ Created ${items.length} demo products`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Seller: ${seller.name} (email: ${seller.email}, password: demo123)`);
    console.log(`   - Buyer: ${buyer.name} (email: ${buyer.email}, password: demo123)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${items.length}`);
    console.log('\n💡 You can now login to the buyer app and browse products!');

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
