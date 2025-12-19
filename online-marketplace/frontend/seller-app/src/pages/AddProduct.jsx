import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import categories from "../utils/categories";
import { getCategorySlug } from "../utils/categoryMapping";
import { createItem } from "../services/itemService";
import "./PageStyles.css";

function AddProduct() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const selectedCategory = categories.find((c) => c.name === category);
  const subcategoriesList = selectedCategory?.subcategories || [];

  const openForm = (sub) => {
    setActiveSubcategory(sub);
    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !price || !stock) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const itemData = {
        name: productName,
        category: activeSubcategory ? activeSubcategory.slug : selectedCategory.slug,
        price: parseFloat(price),
        stock: parseInt(stock),
        description: description || '',
        image: image
      };

      const response = await createItem(itemData);

      if (response && response.data) {
        const newProduct = {
          id: response.data._id || response.data.id,
          category,
          subcategory: activeSubcategory?.name || '',
          image: response.data.images?.[0] || imagePreview || activeSubcategory?.image || '',
          name: response.data.title || productName,
          price: response.data.price,
          stock: response.data.stock,
          description: response.data.description,
        };

        setAddedProducts([newProduct, ...addedProducts]);
        setActiveSubcategory(null);
        // Reset form
        setProductName('');
        setPrice('');
        setStock('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        alert('Product added successfully! It will appear in Your Listings.');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add product. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seller-app">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <div className="header-content-left">
            <h1 className="page-title">
              <i className="fas fa-plus-circle"></i> Add Product
            </h1>
            <p className="page-subtitle">Select a category and add your products</p>
          </div>
          {addedProducts.length > 0 && (
            <div className="header-stats">
              <div className="header-stat success">
                <span className="num">{addedProducts.length}</span>
                <span className="label">Products Added</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${category ? "completed" : "active"}`}>
            <span className="step-num">1</span>
            <span className="step-text">Pick a Category</span>
          </div>
          <div className={`step ${category && !activeSubcategory ? "active" : activeSubcategory ? "completed" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-text">Pick a Type</span>
          </div>
          <div className={`step ${activeSubcategory ? "active" : ""}`}>
            <span className="step-num">3</span>
            <span className="step-text">Fill Details</span>
          </div>
        </div>

        {/* Category Selection */}
        <div className="content-card">
          <h2 className="section-title">
            <i className="fas fa-th-large"></i> What are you selling?
          </h2>
          <p className="section-hint">Pick the category that best describes your product</p>
          <div className="category-grid">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                className={`category-card ${category === c.name ? "selected" : ""}`}
              >
                <i className={`fas ${c.icon}`}></i>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Selection */}
        {category && (
          <div className="content-card">
            <h2 className="section-title">
              <i className="fas fa-list"></i> What type of {category.split(' ')[0].toLowerCase()}?
            </h2>
            <p className="section-hint">Click on the type that matches your product</p>
            <div className="subcategory-grid">
              {subcategoriesList.map((sub) => (
                <div
                  key={sub.name}
                  onClick={() => openForm(sub)}
                  className="subcategory-card"
                >
                  <img src={sub.image} alt={sub.name} />
                  <span>{sub.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Form */}
        {activeSubcategory && (
          <div className="modal-overlay" onClick={() => setActiveSubcategory(null)}>
            <div className="modal-content enhanced" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2><i className="fas fa-plus-circle"></i> Add Product</h2>
                <button className="modal-close" onClick={() => setActiveSubcategory(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-subtitle">
                <span className="breadcrumb">{category} / {activeSubcategory.name}</span>
              </div>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label><i className="fas fa-tag"></i> Product Name</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label><i className="fas fa-dollar-sign"></i> Price</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-box"></i> Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label><i className="fas fa-align-left"></i> Description (Optional)</label>
                  <textarea
                    placeholder="Describe your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-image"></i> Product Image</label>
                  <div className="image-upload">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <label className="upload-area">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Click to upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setActiveSubcategory(null)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    <i className="fas fa-plus"></i> {isSubmitting ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Added Products */}
        {addedProducts.length > 0 && (
          <div className="content-card">
            <div className="card-header-row">
              <h2 className="section-title">
                <i className="fas fa-check-circle"></i> Recently Added
              </h2>
              <Link to="/your-listings" className="view-all-link">
                View All Listings <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="product-grid-enhanced">
              {addedProducts.map((p) => (
                <div key={p.id} className="product-card-enhanced">
                  <div className="product-image-container">
                    <img src={p.image} alt={p.name} />
                    <span className="stock-badge success">Just Added</span>
                  </div>
                  <div className="product-content">
                    <span className="product-category">{p.category} / {p.subcategory}</span>
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-price">${p.price}</p>
                    <span className="product-stock"><i className="fas fa-box"></i> {p.stock} in stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProduct;
