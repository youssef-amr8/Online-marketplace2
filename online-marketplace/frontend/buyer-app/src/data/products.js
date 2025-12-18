// src/data/products.js

export const products = {
  // ========== Electronics ==========
  "mobiles-tablets": [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      description:
        "Latest Apple iPhone with A17 Pro chip, 6.7-inch Super Retina XDR display",
      price: 39999,
      originalPrice: 45999,
      rating: 4.8,
      reviewCount: 1254,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      brand: "Apple",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      description:
        "Samsung flagship with Snapdragon 8 Gen 3, S Pen, and 200MP camera",
      price: 34999,
      originalPrice: 39999,
      rating: 4.7,
      reviewCount: 987,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      brand: "Samsung",
      inStock: true,
      delivery: "FREE delivery by Monday",
    },
    {
      id: 3,
      name: "Google Pixel 8 Pro",
      description:
        "Google's flagship with Tensor G3 chip and advanced AI camera features",
      price: 32999,
      originalPrice: 37999,
      rating: 4.6,
      reviewCount: 765,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      brand: "Google",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 4,
      name: "OnePlus 12",
      description:
        "Flagship killer with Snapdragon 8 Gen 3 and Hasselblad camera",
      price: 27999,
      originalPrice: 31999,
      rating: 4.5,
      reviewCount: 543,
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
      brand: "OnePlus",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 5,
      name: "iPad Pro 12.9-inch",
      description:
        "Apple's most advanced iPad with M2 chip and Liquid Retina XDR display",
      price: 45999,
      originalPrice: 51999,
      rating: 4.9,
      reviewCount: 876,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      brand: "Apple",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "laptops-computers": [
    {
      id: 101,
      name: "MacBook Pro 16-inch",
      description: "Apple M3 Pro chip, 16-inch Liquid Retina XDR display",
      price: 89999,
      originalPrice: 99999,
      rating: 4.9,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      brand: "Apple",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 102,
      name: "Dell XPS 15",
      description: "Intel Core i9, 15.6-inch OLED display, NVIDIA RTX 4060",
      price: 64999,
      originalPrice: 72999,
      rating: 4.7,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
      brand: "Dell",
      inStock: true,
      delivery: "FREE delivery in 2 days",
    },
    {
      id: 103,
      name: "HP Spectre x360",
      description: "2-in-1 laptop with OLED touchscreen, Intel Core i7",
      price: 54999,
      originalPrice: 61999,
      rating: 4.6,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
      brand: "HP",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 104,
      name: "Lenovo ThinkPad X1 Carbon",
      description: "Business laptop with Intel Core i7, 14-inch display",
      price: 58999,
      originalPrice: 65999,
      rating: 4.8,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
      brand: "Lenovo",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "tvs-entertainment": [
    {
      id: 201,
      name: "Samsung 75-inch QLED 4K TV",
      description: "Quantum HDR, Smart TV with Alexa Built-in",
      price: 79999,
      originalPrice: 89999,
      rating: 4.8,
      reviewCount: 543,
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
      brand: "Samsung",
      inStock: true,
      delivery: "FREE delivery in 3 days",
    },
    {
      id: 202,
      name: "LG 65-inch OLED 4K TV",
      description: "OLED evo, α9 AI Processor 4K Gen6",
      price: 89999,
      originalPrice: 99999,
      rating: 4.9,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
      brand: "LG",
      inStock: true,
      delivery: "FREE delivery in 3 days",
    },
  ],

  "cameras-accessories": [
    {
      id: 301,
      name: "Canon EOS R5",
      description: "Full-frame mirrorless camera, 45MP, 8K video",
      price: 119999,
      originalPrice: 139999,
      rating: 4.9,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
      brand: "Canon",
      inStock: true,
      delivery: "FREE delivery in 4 days",
    },
    {
      id: 302,
      name: "Sony Alpha 7 IV",
      description: "33MP full-frame mirrorless camera",
      price: 89999,
      originalPrice: 99999,
      rating: 4.8,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
      brand: "Sony",
      inStock: true,
      delivery: "FREE delivery in 3 days",
    },
  ],

  "smartwatches-wearables": [
    {
      id: 401,
      name: "Apple Watch Series 9",
      description: "GPS + Cellular, 45mm, Midnight Aluminum Case",
      price: 19999,
      originalPrice: 22999,
      rating: 4.8,
      reviewCount: 654,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      brand: "Apple",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 402,
      name: "Samsung Galaxy Watch 6",
      description: "44mm, Bluetooth, Fitness Tracker",
      price: 14999,
      originalPrice: 17999,
      rating: 4.7,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop",
      brand: "Samsung",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "headphones-speakers": [
    {
      id: 501,
      name: "Sony WH-1000XM5",
      description: "Wireless Noise Cancelling Headphones",
      price: 12999,
      originalPrice: 14999,
      rating: 4.9,
      reviewCount: 876,
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      brand: "Sony",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 502,
      name: "Apple AirPods Pro (2nd Gen)",
      description: "Active Noise Cancellation, Adaptive Transparency",
      price: 9999,
      originalPrice: 11999,
      rating: 4.8,
      reviewCount: 987,
      image:
        "https://images.unsplash.com/photo-1593358167138-43cce00dadd5?w=400&h=400&fit=crop",
      brand: "Apple",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "gaming-consoles": [
    {
      id: 601,
      name: "PlayStation 5",
      description: "Ultra-high speed SSD, 4K gaming",
      price: 24999,
      originalPrice: 27999,
      rating: 4.9,
      reviewCount: 765,
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
      brand: "Sony",
      inStock: true,
      delivery: "FREE delivery in 2 days",
    },
    {
      id: 602,
      name: "Xbox Series X",
      description: "4K gaming, 1TB SSD, 12 teraflops",
      price: 22999,
      originalPrice: 25999,
      rating: 4.8,
      reviewCount: 543,
      image:
        "https://images.unsplash.com/photo-1621259182978-fbf83132d5c2?w=400&h=400&fit=crop",
      brand: "Microsoft",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  // ========== Fashion ==========
  "womens-fashion": [
    {
      id: 701,
      name: "Women's Summer Dress",
      description: "Floral print, cotton blend, midi length",
      price: 1299,
      originalPrice: 1999,
      rating: 4.5,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=400&fit=crop",
      brand: "Zara",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 702,
      name: "Women's Leather Handbag",
      description: "Genuine leather, crossbody, multiple compartments",
      price: 2499,
      originalPrice: 3499,
      rating: 4.7,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      brand: "Michael Kors",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "mens-fashion": [
    {
      id: 801,
      name: "Men's Casual Shirt",
      description: "100% cotton, slim fit, regular collar",
      price: 899,
      originalPrice: 1299,
      rating: 4.4,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
      brand: "H&M",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 802,
      name: "Men's Leather Shoes",
      description: "Genuine leather, formal, cushioned insole",
      price: 1999,
      originalPrice: 2799,
      rating: 4.6,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      brand: "Clarks",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "kids-baby": [
    {
      id: 901,
      name: "Baby Onesies Pack (3 Pieces)",
      description: "100% cotton, soft fabric, snap closures",
      price: 699,
      originalPrice: 999,
      rating: 4.7,
      reviewCount: 154,
      image:
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop",
      brand: "Carter's",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 902,
      name: "Kids School Backpack",
      description: "Water-resistant, multiple compartments, ergonomic straps",
      price: 1299,
      originalPrice: 1799,
      rating: 4.5,
      reviewCount: 87,
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop",
      brand: "Wildcraft",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  // ========== Beauty & Personal Care ==========
  skincare: [
    {
      id: 1001,
      name: "Vitamin C Serum",
      description: "Brightening serum with hyaluronic acid, 30ml",
      price: 1299,
      originalPrice: 1799,
      rating: 4.8,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
      brand: "The Ordinary",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1002,
      name: "SPF 50+ Sunscreen",
      description: "Non-greasy, water-resistant, 50ml",
      price: 899,
      originalPrice: 1299,
      rating: 4.7,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
      brand: "Neutrogena",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  makeup: [
    {
      id: 1101,
      name: "Matte Lipstick Set (6 Shades)",
      description: "Long-lasting, vegan, cruelty-free",
      price: 1499,
      originalPrice: 2199,
      rating: 4.6,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
      brand: "Maybelline",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1102,
      name: "Foundation with SPF 30",
      description: "Full coverage, natural finish, 30ml",
      price: 1799,
      originalPrice: 2399,
      rating: 4.5,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
      brand: "L'Oreal",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  haircare: [
    {
      id: 1201,
      name: "Anti-Dandruff Shampoo",
      description: "With ketoconazole, 200ml",
      price: 499,
      originalPrice: 699,
      rating: 4.4,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
      brand: "Head & Shoulders",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1202,
      name: "Hair Growth Serum",
      description: "With biotin and keratin, 60ml",
      price: 999,
      originalPrice: 1499,
      rating: 4.3,
      reviewCount: 154,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
      brand: "Biotin",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  fragrances: [
    {
      id: 1301,
      name: "Men's Eau de Toilette",
      description: "Woody fragrance, 100ml",
      price: 2999,
      originalPrice: 3999,
      rating: 4.7,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
      brand: "Davidoff",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1302,
      name: "Women's Perfume",
      description: "Floral scent, 50ml",
      price: 3499,
      originalPrice: 4499,
      rating: 4.8,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
      brand: "Chanel",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "bath-body": [
    {
      id: 1401,
      name: "Body Wash Gift Set",
      description: "3 scents, 250ml each, with loofah",
      price: 1299,
      originalPrice: 1799,
      rating: 4.6,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?w=400&h=400&fit=crop",
      brand: "Dove",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1402,
      name: "Luxury Bath Bombs (6 Pieces)",
      description: "Essential oils, moisturizing, various scents",
      price: 899,
      originalPrice: 1299,
      rating: 4.7,
      reviewCount: 154,
      image:
        "https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?w=400&h=400&fit=crop",
      brand: "Lush",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "health-wellness": [
    {
      id: 1501,
      name: "Digital Thermometer",
      description: "Fast reading, fever alarm, memory function",
      price: 499,
      originalPrice: 799,
      rating: 4.5,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      brand: "Omron",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1502,
      name: "Vitamin D3 Supplements",
      description: "60 capsules, 2000 IU per capsule",
      price: 699,
      originalPrice: 999,
      rating: 4.6,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      brand: "Nature Made",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],
  // ========== Fashion - Children ==========
  "womens-clothing": [
    {
      id: 1601,
      name: "Women's Summer Dress",
      description: "Floral print, cotton blend, midi length",
      price: 1299,
      originalPrice: 1999,
      rating: 4.5,
      reviewCount: 432,
      image:
        "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=400&fit=crop",
      brand: "Zara",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1602,
      name: "Women's Blouse",
      description: "Silk material, elegant design, perfect for office",
      price: 899,
      originalPrice: 1299,
      rating: 4.3,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
      brand: "Mango",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1603,
      name: "Women's Jeans",
      description: "High-waisted, skinny fit, stretch denim",
      price: 1599,
      originalPrice: 2199,
      rating: 4.6,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
      brand: "Levi's",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "womens-shoes": [
    {
      id: 1701,
      name: "Women's High Heels",
      description: "Leather, 3-inch heel, comfortable padding",
      price: 2499,
      originalPrice: 3299,
      rating: 4.4,
      reviewCount: 187,
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",
      brand: "Steve Madden",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1702,
      name: "Women's Sneakers",
      description: "Running shoes, breathable mesh, memory foam",
      price: 1799,
      originalPrice: 2399,
      rating: 4.7,
      reviewCount: 256,
      image:
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      brand: "Nike",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "womens-bags": [
    {
      id: 1801,
      name: "Women's Leather Handbag",
      description: "Genuine leather, crossbody, multiple compartments",
      price: 3499,
      originalPrice: 4499,
      rating: 4.7,
      reviewCount: 287,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      brand: "Michael Kors",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1802,
      name: "Women's Tote Bag",
      description: "Canvas material, spacious, laptop compartment",
      price: 1299,
      originalPrice: 1799,
      rating: 4.5,
      reviewCount: 143,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      brand: "H&M",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "womens-jewelry": [
    {
      id: 1901,
      name: "Gold Plated Necklace",
      description: "18K gold plating, pendant included",
      price: 899,
      originalPrice: 1299,
      rating: 4.6,
      reviewCount: 98,
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
      brand: "Pandora",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 1902,
      name: "Silver Earrings",
      description: "Sterling silver, hypoallergenic",
      price: 599,
      originalPrice: 899,
      rating: 4.4,
      reviewCount: 76,
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
      brand: "Swarovski",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  // ========== Men's Fashion Children ==========
  "mens-clothing": [
    {
      id: 2001,
      name: "Men's Casual Shirt",
      description: "100% cotton, slim fit, regular collar",
      price: 899,
      originalPrice: 1299,
      rating: 4.4,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
      brand: "H&M",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2002,
      name: "Men's T-Shirt Pack (3)",
      description: "Cotton blend, crew neck, assorted colors",
      price: 1299,
      originalPrice: 1899,
      rating: 4.5,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      brand: "Puma",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2003,
      name: "Men's Formal Suit",
      description: "Wool blend, 2-piece, various sizes",
      price: 8999,
      originalPrice: 11999,
      rating: 4.8,
      reviewCount: 87,
      image:
        "https://images.unsplash.com/photo-1594938354285-6a8c5c339d6f?w=400&h=400&fit=crop",
      brand: "Raymond",
      inStock: true,
      delivery: "FREE delivery in 3 days",
    },
  ],

  "mens-shoes": [
    {
      id: 2101,
      name: "Men's Leather Shoes",
      description: "Genuine leather, formal, cushioned insole",
      price: 2999,
      originalPrice: 3999,
      rating: 4.6,
      reviewCount: 198,
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      brand: "Clarks",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2102,
      name: "Men's Running Shoes",
      description: "Breathable mesh, shock absorption",
      price: 3499,
      originalPrice: 4499,
      rating: 4.7,
      reviewCount: 265,
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      brand: "Adidas",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "mens-accessories": [
    {
      id: 2201,
      name: "Men's Leather Wallet",
      description: "Genuine leather, multiple card slots",
      price: 1299,
      originalPrice: 1899,
      rating: 4.5,
      reviewCount: 143,
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
      brand: "Tommy Hilfiger",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2202,
      name: "Men's Belt",
      description: "Leather, adjustable, buckle included",
      price: 899,
      originalPrice: 1299,
      rating: 4.3,
      reviewCount: 98,
      image:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
      brand: "Allen Solly",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "mens-watches": [
    {
      id: 2301,
      name: "Men's Analog Watch",
      description: "Stainless steel, water resistant",
      price: 4499,
      originalPrice: 5999,
      rating: 4.7,
      reviewCount: 187,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop",
      brand: "Fossil",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2302,
      name: "Men's Smart Watch",
      description: "Fitness tracking, notifications, heart rate monitor",
      price: 5999,
      originalPrice: 7999,
      rating: 4.6,
      reviewCount: 232,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop",
      brand: "Garmin",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  // ========== Kids & Baby Children ==========
  "baby-clothing": [
    {
      id: 2401,
      name: "Baby Onesies Pack (3 Pieces)",
      description: "100% cotton, soft fabric, snap closures",
      price: 699,
      originalPrice: 999,
      rating: 4.7,
      reviewCount: 154,
      image:
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop",
      brand: "Carter's",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2402,
      name: "Baby Romper Set",
      description: "Cotton, cute designs, easy to wear",
      price: 899,
      originalPrice: 1299,
      rating: 4.6,
      reviewCount: 87,
      image:
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop",
      brand: "Mothercare",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "kids-toys": [
    {
      id: 2501,
      name: "Educational Building Blocks",
      description: "100 pieces, various shapes and colors",
      price: 1299,
      originalPrice: 1799,
      rating: 4.8,
      reviewCount: 143,
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
      brand: "Lego",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2502,
      name: "Remote Control Car",
      description: "2.4GHz, rechargeable battery, LED lights",
      price: 1999,
      originalPrice: 2799,
      rating: 4.5,
      reviewCount: 98,
      image:
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
      brand: "Hot Wheels",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],

  "school-bags": [
    {
      id: 2601,
      name: "Kids School Backpack",
      description: "Water-resistant, multiple compartments, ergonomic straps",
      price: 1299,
      originalPrice: 1799,
      rating: 4.5,
      reviewCount: 87,
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop",
      brand: "Wildcraft",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
    {
      id: 2602,
      name: "Kids Lunch Box Set",
      description: "Insulated, BPA free, includes water bottle",
      price: 899,
      originalPrice: 1299,
      rating: 4.4,
      reviewCount: 65,
      image:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop",
      brand: "Tupperware",
      inStock: true,
      delivery: "FREE delivery tomorrow",
    },
  ],
};

export const getProductsByCategory = (categorySlug) => {
  return products[categorySlug] || [];
};

export default products;
