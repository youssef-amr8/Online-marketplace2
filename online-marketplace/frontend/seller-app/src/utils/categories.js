// src/utils/categories.js - Synced with Buyer App

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "fa-laptop",
    subcategories: [
      {
        id: 101,
        name: "Mobiles & Tablets",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      },
      {
        id: 102,
        name: "Laptops & Computers",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      },
      {
        id: 103,
        name: "TVs & Home Entertainment",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      },
      {
        id: 104,
        name: "Cameras & Accessories",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      },
      {
        id: 105,
        name: "Smartwatches & Wearables",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      },
      {
        id: 106,
        name: "Headphones & Speakers",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
      },
      {
        id: 107,
        name: "Gaming Consoles & Accessories",
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 2,
    name: "Fashion",
    icon: "fa-tshirt",
    subcategories: [
      {
        id: 201,
        name: "Women's Clothing",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
      },
      {
        id: 202,
        name: "Women's Shoes & Sandals",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
      },
      {
        id: 203,
        name: "Women's Bags & Accessories",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
      },
      {
        id: 204,
        name: "Men's Clothing",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
      },
      {
        id: 205,
        name: "Men's Shoes & Sneakers",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
      },
      {
        id: 206,
        name: "Watches & Jewelry",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
      },
      {
        id: 207,
        name: "Kids & Baby Clothing",
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 3,
    name: "Beauty & Personal Care",
    icon: "fa-spa",
    subcategories: [
      {
        id: 301,
        name: "Skincare",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
      },
      {
        id: 302,
        name: "Makeup",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      },
      {
        id: 303,
        name: "Haircare",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      },
      {
        id: 304,
        name: "Fragrances",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
      },
      {
        id: 305,
        name: "Bath & Body",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 4,
    name: "Home & Kitchen",
    icon: "fa-home",
    subcategories: [
      {
        id: 401,
        name: "Furniture",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      },
      {
        id: 402,
        name: "Kitchen Appliances",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      },
      {
        id: 403,
        name: "Cookware & Dining",
        image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=300&fit=crop",
      },
      {
        id: 404,
        name: "Home Décor",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
      },
      {
        id: 405,
        name: "Storage & Organization",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 5,
    name: "Supermarket & Grocery",
    icon: "fa-shopping-basket",
    subcategories: [
      {
        id: 501,
        name: "Fresh Food",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      },
      {
        id: 502,
        name: "Snacks & Beverages",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      },
      {
        id: 503,
        name: "Pantry Staples",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      },
      {
        id: 504,
        name: "Cleaning & Household",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      },
      {
        id: 505,
        name: "Pet Supplies",
        image: "https://images.unsplash.com/photo-1558929996-da64ba858215?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 6,
    name: "Sports & Outdoors",
    icon: "fa-running",
    subcategories: [
      {
        id: 601,
        name: "Fitness Equipment",
        image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop",
      },
      {
        id: 602,
        name: "Sportswear",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      },
      {
        id: 603,
        name: "Camping & Hiking Gear",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop",
      },
      {
        id: 604,
        name: "Bicycles & Accessories",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 7,
    name: "Books & Stationery",
    icon: "fa-book",
    subcategories: [
      {
        id: 701,
        name: "Fiction Books",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
      },
      {
        id: 702,
        name: "Non-fiction Books",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop",
      },
      {
        id: 703,
        name: "Academic Books",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop",
      },
      {
        id: 704,
        name: "Office Supplies",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      },
      {
        id: 705,
        name: "Art & Craft Materials",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 8,
    name: "Toys & Games",
    icon: "fa-gamepad",
    subcategories: [
      {
        id: 801,
        name: "Action Figures",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
      },
      {
        id: 802,
        name: "Educational Toys",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      },
      {
        id: 803,
        name: "Board Games & Puzzles",
        image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop",
      },
      {
        id: 804,
        name: "Dolls & Stuffed Animals",
        image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 9,
    name: "Health & Medical",
    icon: "fa-heartbeat",
    subcategories: [
      {
        id: 901,
        name: "Supplements & Vitamins",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      },
      {
        id: 902,
        name: "Medical Devices",
        image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
      },
      {
        id: 903,
        name: "Personal Care Equipment",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop",
      },
    ],
  },
];

export default categories;
