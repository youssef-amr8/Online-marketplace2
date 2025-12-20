// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
import { categories } from "../data/categories";
import { useProducts } from "../context/ProductContext";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categorySlug, subcategorySlug, childSlug } = useParams();
  const location = useLocation();
  const { fetchProductsByCategory, searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [currentSubcategories, setCurrentSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const params = new URLSearchParams(location.search);
      const query = params.get("q");

      if (location.pathname === "/search" && query) {
        setIsLoading(true);
        setSearchQuery(query);
        setCategoryName(`Search Results for "${query}"`);
        setCurrentSubcategories([]);

        try {
          const results = await searchProducts(query);
          setProductsData(results || []);
        } catch (error) {
          console.error('Error searching products:', error);
          setProductsData([]);
        } finally {
          setIsLoading(false);
        }

      } else if (categorySlug) {
        window.scrollTo(0, 0);
        setSearchQuery("");

        // Find current category structure
        const category = categories.find((c) => c.slug === categorySlug);

        if (category) {
          setCategoryName(category.name);

          // Case 1: Deepest level (Child Category) - e.g. /category/fashion/womens-fashion/clothing
          if (childSlug && subcategorySlug) {
            const sub = category.subcategories.find((s) => s.slug === subcategorySlug);
            const child = sub?.children?.find((c) => c.slug === childSlug);

            if (child) {
              setCategoryName(child.name);
              setCurrentSubcategories([]); // No more levels

              setIsLoading(true);
              try {
                const results = await fetchProductsByCategory(childSlug);
                setProductsData(results || []);
              } catch (error) {
                console.error('Error fetching products:', error);
                setProductsData([]);
              } finally {
                setIsLoading(false);
              }
            }
          }
          // Case 2: Subcategory Level - e.g. /category/fashion/womens-fashion
          else if (subcategorySlug) {
            const sub = category.subcategories.find((s) => s.slug === subcategorySlug);

            if (sub) {
              setCategoryName(sub.name);

              // If this subcategory has children, show them instead of products
              if (sub.children && sub.children.length > 0) {
                setCurrentSubcategories(sub.children);
                setProductsData([]); // Clear products to force subcategory view
                setIsLoading(false);
              } else {
                // No children = Leaf node = Show products
                setCurrentSubcategories([]);
                setIsLoading(true);
                try {
                  const results = await fetchProductsByCategory(subcategorySlug);
                  setProductsData(results || []);
                } catch (error) {
                  console.error('Error fetching products:', error);
                  setProductsData([]);
                } finally {
                  setIsLoading(false);
                }
              }
            }
          }
          // Case 3: Top Level Category - e.g. /category/fashion
          else {
            // If this category has subcategories, show them instead of products
            if (category.subcategories && category.subcategories.length > 0) {
              setCurrentSubcategories(category.subcategories);
              setProductsData([]); // Clear products to force subcategory view
              setIsLoading(false);
            } else {
              // No subcategories = Leaf node = Show products
              setCurrentSubcategories([]);
              setIsLoading(true);
              try {
                const results = await fetchProductsByCategory(categorySlug);
                setProductsData(results || []);
              } catch (error) {
                console.error('Error fetching products:', error);
                setProductsData([]);
              } finally {
                setIsLoading(false);
              }
            }
          }
        }
      }
    };

    loadProducts();
  }, [categorySlug, subcategorySlug, childSlug, location.search, location.pathname, fetchProductsByCategory, searchProducts]);

  const shouldShowSubcategories = currentSubcategories.length > 0 && productsData.length === 0;

  // Get filtered and sorted products
  const getFilteredProducts = () => {
    let filtered = [...productsData];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Apply price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter(p => {
        const price = p.price;
        switch (priceFilter) {
          case "under50": return price < 50;
          case "50to100": return price >= 50 && price < 100;
          case "100to200": return price >= 100 && price < 200;
          case "200plus": return price >= 200;
          default: return true;
        }
      });
    }



    // Apply sorting
    switch (sortBy) {
      case "priceLowHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 4) - (a.rating || 4));
        break;
      default:
        break;
    }

    return filtered;
  };



  const filteredProducts = getFilteredProducts();

  return (
    <div className="category-page">
      <div className="breadcrumb">
        <Link to="/marketplace">Home</Link>
        <span>/</span>
        <span>{categoryName}</span>
      </div>

      {shouldShowSubcategories ? (
        <div className="subcategories-container">
          <h2 className="page-title">{categoryName}</h2>
          <div className="subcategories-grid">
            {currentSubcategories.map((sub) => (
              <Link
                key={sub.id}
                to={
                  location.pathname === '/search' ? '#' :
                    childSlug
                      ? `/category/${categorySlug}/${subcategorySlug}/${sub.slug}`
                      : subcategorySlug
                        ? `/category/${categorySlug}/${subcategorySlug}/${sub.slug}`
                        : `/category/${categorySlug}/${sub.slug}`
                }
                className="subcategory-card"
              >
                <div className="subcategory-card-image">
                  <img src={sub.image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={sub.name} />
                </div>
                <div className="subcategory-card-content">
                  <h3 className="subcategory-card-title">{sub.name}</h3>
                  <span className="subcategory-card-link">Shop Now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="category-content">
          {/* Sidebar Filters */}
          <div className="filters-sidebar">
            <h3>Filters</h3>

            <div className="filter-section">
              <h4>Price</h4>
              <div className="filter-list">
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "all"}
                    onChange={() => setPriceFilter("all")}
                  /> All Prices
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "under50"}
                    onChange={() => setPriceFilter("under50")}
                  /> Under $50
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "50to100"}
                    onChange={() => setPriceFilter("50to100")}
                  /> $50 to $100
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "100to200"}
                    onChange={() => setPriceFilter("100to200")}
                  /> $100 to $200
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === "200plus"}
                    onChange={() => setPriceFilter("200plus")}
                  /> $200 & Above
                </label>
              </div>
            </div>


          </div>

          {/* Products Section */}
          <div className="products-section">
            <div className="products-header">
              <h1>{categoryName}</h1>
              <div className="sort-options">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="rating">Avg. Customer Review</option>
                </select>
              </div>
            </div>

            {/* Local Search within Category */}
            {location.pathname !== '/search' && (
              <div className="category-search-bar">
                <input
                  type="text"
                  className="category-search-input"
                  placeholder={`Search in ${categoryName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            <div className="products-grid">
              {isLoading ? (
                <div className="no-products">
                  <p>Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <p>No products found matching your criteria.</p>
                  <button onClick={() => {
                    setSearchQuery("");
                    setPriceFilter("all");

                  }} className="amazon-btn amazon-btn-secondary">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
