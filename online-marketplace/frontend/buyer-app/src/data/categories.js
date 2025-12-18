// src/data/categories.js

export const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "📱",
    slug: "electronics",
    subcategories: [
      {
        id: 101,
        name: "Mobiles & Tablets",
        slug: "mobiles-tablets",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      },
      {
        id: 102,
        name: "Laptops & Computers",
        slug: "laptops-computers",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      },
      {
        id: 103,
        name: "TVs & Home Entertainment",
        slug: "tvs-entertainment",
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      },
      {
        id: 104,
        name: "Cameras & Accessories",
        slug: "cameras-accessories",
        image:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      },
      {
        id: 105,
        name: "Smartwatches & Wearables",
        slug: "smartwatches-wearables",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      },
      {
        id: 106,
        name: "Headphones & Speakers",
        slug: "headphones-speakers",
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop",
      },
      {
        id: 107,
        name: "Gaming Consoles & Accessories",
        slug: "gaming-consoles",
        image:
          "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👗",
    slug: "fashion",
    subcategories: [
      {
        id: 201,
        name: "Women's Fashion",
        slug: "womens-fashion",
        isParent: true,
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
        children: [
          {
            id: 2011,
            name: "Clothing",
            slug: "womens-clothing",
            image:
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
          },
          {
            id: 2012,
            name: "Shoes & Sandals",
            slug: "womens-shoes",
            image:
              "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
          },
          {
            id: 2013,
            name: "Bags & Accessories",
            slug: "womens-bags",
            image:
              "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
          },
          {
            id: 2014,
            name: "Jewelry & Watches",
            slug: "womens-jewelry",
            image:
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
          },
        ],
      },
      {
        id: 202,
        name: "Men's Fashion",
        slug: "mens-fashion",
        isParent: true,
        image:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
        children: [
          {
            id: 2021,
            name: "Clothing",
            slug: "mens-clothing",
            image:
              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
          },
          {
            id: 2022,
            name: "Shoes & Sneakers",
            slug: "mens-shoes",
            image:
              "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
          },
          {
            id: 2023,
            name: "Wallets & Belts",
            slug: "mens-accessories",
            image:
              "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop",
          },
          {
            id: 2024,
            name: "Watches & Accessories",
            slug: "mens-watches",
            image:
              "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
          },
        ],
      },
      {
        id: 203,
        name: "Kids & Baby",
        slug: "kids-baby",
        isParent: true,
        image:
          "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=300&fit=crop",
        children: [
          {
            id: 2031,
            name: "Baby Clothing",
            slug: "baby-clothing",
            image:
              "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=300&fit=crop",
          },
          {
            id: 2032,
            name: "Toys & Games",
            slug: "kids-toys",
            image:
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
          },
          {
            id: 2033,
            name: "School Bags & Accessories",
            slug: "school-bags",
            image:
              "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Beauty & Personal Care",
    icon: "💄",
    slug: "beauty-personal-care",
    subcategories: [
      {
        id: 301,
        name: "Skincare",
        slug: "skincare",
        image:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
      },
      {
        id: 302,
        name: "Makeup",
        slug: "makeup",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      },
      {
        id: 303,
        name: "Haircare",
        slug: "haircare",
        image:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      },
      {
        id: 304,
        name: "Fragrances",
        slug: "fragrances",
        image:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
      },
      {
        id: 305,
        name: "Bath & Body",
        slug: "bath-body",
        image:
          "https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?w=400&h=300&fit=crop",
      },
      {
        id: 306,
        name: "Health & Wellness",
        slug: "health-wellness",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 4,
    name: "Home & Kitchen",
    icon: "🏠",
    slug: "home-kitchen",
    subcategories: [
      {
        id: 401,
        name: "Furniture",
        slug: "furniture",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      },
      {
        id: 402,
        name: "Kitchen Appliances",
        slug: "kitchen-appliances",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      },
      {
        id: 403,
        name: "Cookware & Dining",
        slug: "cookware-dining",
        image:
          "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=300&fit=crop",
      },
      {
        id: 404,
        name: "Home Décor",
        slug: "home-decor",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop",
      },
      {
        id: 405,
        name: "Storage & Organization",
        slug: "storage-organization",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      },
      {
        id: 406,
        name: "Cleaning Supplies",
        slug: "cleaning-supplies",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 5,
    name: "Supermarket & Grocery",
    icon: "🛒",
    slug: "supermarket-grocery",
    subcategories: [
      {
        id: 501,
        name: "Fresh Food",
        slug: "fresh-food",
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      },
      {
        id: 502,
        name: "Snacks & Beverages",
        slug: "snacks-beverages",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      },
      {
        id: 503,
        name: "Pantry Staples",
        slug: "pantry-staples",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      },
      {
        id: 504,
        name: "Cleaning & Household Essentials",
        slug: "household-essentials",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      },
      {
        id: 505,
        name: "Pet Supplies",
        slug: "pet-supplies",
        image:
          "https://images.unsplash.com/photo-1558929996-da64ba858215?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 6,
    name: "Sports & Outdoors",
    icon: "⚽",
    slug: "sports-outdoors",
    subcategories: [
      {
        id: 601,
        name: "Fitness Equipment",
        slug: "fitness-equipment",
        image:
          "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=400&h=300&fit=crop",
      },
      {
        id: 602,
        name: "Sportswear",
        slug: "sportswear",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      },
      {
        id: 603,
        name: "Camping & Hiking Gear",
        slug: "camping-hiking",
        image:
          "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop",
      },
      {
        id: 604,
        name: "Bicycles & Accessories",
        slug: "bicycles-accessories",
        image:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 7,
    name: "Books & Stationery",
    icon: "📚",
    slug: "books-stationery",
    subcategories: [
      {
        id: 701,
        name: "Fiction Books",
        slug: "fiction-books",
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
      },
      {
        id: 702,
        name: "Non-fiction Books",
        slug: "nonfiction-books",
        image:
          "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop",
      },
      {
        id: 703,
        name: "Academic Books",
        slug: "academic-books",
        image:
          "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop",
      },
      {
        id: 704,
        name: "Office Supplies",
        slug: "office-supplies",
        image:
          "https://images.unsplash.com/photo-1586773860418-dc22f8b874bc?w=400&h=300&fit=crop",
      },
      {
        id: 705,
        name: "Art & Craft Materials",
        slug: "art-craft",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 8,
    name: "Toys & Games",
    icon: "🎮",
    slug: "toys-games",
    subcategories: [
      {
        id: 801,
        name: "Action Figures",
        slug: "action-figures",
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
      },
      {
        id: 802,
        name: "Educational Toys",
        slug: "educational-toys",
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      },
      {
        id: 803,
        name: "Board Games & Puzzles",
        slug: "board-games",
        image:
          "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop",
      },
      {
        id: 804,
        name: "Dolls & Stuffed Animals",
        slug: "dolls-stuffed",
        image:
          "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    id: 9,
    name: "Health & Medical",
    icon: "🏥",
    slug: "health-medical",
    subcategories: [
      {
        id: 901,
        name: "Supplements & Vitamins",
        slug: "supplements-vitamins",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      },
      {
        id: 902,
        name: "Medical Devices",
        slug: "medical-devices",
        image:
          "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
      },
      {
        id: 903,
        name: "Personal Care Equipment",
        slug: "personal-care-equipment",
        image:
          "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop",
      },
    ],
  },
];

export default categories;
