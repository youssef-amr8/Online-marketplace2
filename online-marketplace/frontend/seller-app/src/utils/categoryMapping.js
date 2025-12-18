// Map category names to slugs for buyer app compatibility
export const categoryNameToSlug = {
  'Electronics': 'electronics',
  'Fashion': 'fashion',
  'Home & Kitchen': 'home-kitchen',
  'Beauty & Personal Care': 'beauty-personal-care',
  'Sports & Outdoors': 'sports-outdoors',
  'Toys & Games': 'toys-games',
  'Books': 'books',
  'Automotive': 'automotive',
  'Health & Household': 'health-household',
  'Pet Supplies': 'pet-supplies',
  'Baby Products': 'baby-products',
  'Office Products': 'office-products'
};

export const getCategorySlug = (categoryName) => {
  return categoryNameToSlug[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
};

