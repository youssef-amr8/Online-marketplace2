import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCommentsByItemId } from "../utils/api";
import { getSellerItems, deleteItem, updateItem } from "../services/itemService";
import "./PageStyles.css";

function YourListings() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', description: '', category: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await getSellerItems(1, 100);
      const mappedProducts = result.items.map(item => ({
        id: item._id || item.id,
        name: item.title,
        stock: item.stock || 0,
        price: item.price,
        category: item.category || 'Uncategorized',
        sales: item.sales || 0,
        image: item.images?.[0] || 'https://via.placeholder.com/200',
        status: item.stock === 0 ? 'out_of_stock' : item.stock < 5 ? 'low_stock' : 'active',
        reviews: item.commentsCount || 0,
        rating: item.avgRating || 0
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteItem(productId);
        // Remove from local state
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(error.message || 'Failed to delete product. Please try again.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      category: product.category || ''
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await updateItem(editingProduct.id, editForm);
      await fetchProducts(); // Refresh products
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product. Please try again.');
    }
  };

  const handleViewComments = async (product) => {
    setSelectedProduct(product);
    setShowCommentsModal(true);
    setLoadingComments(true);
    setComments([]);

    try {
      // Fetch comments for this product
      // Note: product.id might need to be mapped to the actual MongoDB itemId
      const fetchedComments = await getCommentsByItemId(product.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#ffa41c' }}>★</span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#ddd' }}>☆</span>);
    }
    return stars;
  };

  const activeCount = products.filter(p => p.status === "active").length;
  const lowStockCount = products.filter(p => p.status === "low_stock").length;
  const outOfStockCount = products.filter(p => p.status === "out_of_stock").length;

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === "all" || product.status === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="seller-app">
      <Sidebar />
      <div className="page-container">
        <div className="page-header">
          <div className="header-content-left">
            <h1 className="page-title">
              <i className="fas fa-box"></i> Your Listings
            </h1>
            <p className="page-subtitle">Manage all your products in one place</p>
          </div>
          <Link to="/add-product" className="btn-primary-header">
            <i className="fas fa-plus"></i> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-row small">
          <div className="stat-card">
            <i className="fas fa-box"></i>
            <div className="stat-data">
              <span className="stat-num">{products.length}</span>
              <span className="stat-label">Total Products</span>
            </div>
          </div>
          <div className="stat-card completed">
            <i className="fas fa-check-circle"></i>
            <div className="stat-data">
              <span className="stat-num">{activeCount}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
          <div className="stat-card warning">
            <i className="fas fa-exclamation-triangle"></i>
            <div className="stat-data">
              <span className="stat-num">{lowStockCount}</span>
              <span className="stat-label">Low Stock</span>
            </div>
          </div>
          <div className="stat-card danger">
            <i className="fas fa-times-circle"></i>
            <div className="stat-data">
              <span className="stat-num">{outOfStockCount}</span>
              <span className="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="content-card filter-card">
          <div className="filter-row">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({products.length})
              </button>
              <button
                className={`filter-tab ${filter === "active" ? "active" : ""}`}
                onClick={() => setFilter("active")}
              >
                Active ({activeCount})
              </button>
              <button
                className={`filter-tab ${filter === "low_stock" ? "active" : ""}`}
                onClick={() => setFilter("low_stock")}
              >
                Low Stock ({lowStockCount})
              </button>
              <button
                className={`filter-tab ${filter === "out_of_stock" ? "active" : ""}`}
                onClick={() => setFilter("out_of_stock")}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
            <div className="filter-right">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="view-toggle">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="content-card">
          {isLoading ? (
            <div className="empty-state">
              <i className="fas fa-spinner fa-spin"></i>
              <h3>Loading products...</h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No products found</h3>
              <p>No products match your criteria.</p>
              <Link to="/add-product" className="btn-primary">
                <i className="fas fa-plus"></i> Add Your First Product
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="product-grid-enhanced">
              {filteredProducts.map((product) => (
                <div key={product.id} className={`product-card-enhanced ${product.status}`}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                    {product.status === "low_stock" && <span className="stock-badge warning">Low Stock</span>}
                    {product.status === "out_of_stock" && <span className="stock-badge danger">Out of Stock</span>}
                  </div>
                  <div className="product-content">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <div className="product-stats">
                      <span><i className="fas fa-box"></i> {product.stock}</span>
                      <span><i className="fas fa-star" style={{ color: '#ffa41c' }}></i> {product.rating.toFixed(1)} ({product.reviews})</span>
                    </div>
                    <div className="product-actions">
                      <button className="btn-comments" onClick={() => handleViewComments(product)}>
                        <i className="fas fa-comments"></i> Comments
                      </button>
                      <button className="btn-edit" onClick={() => handleEdit(product)}><i className="fas fa-edit"></i> Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sales</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell-with-img">
                          <img src={product.image} alt={product.name} />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td className="amount">${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div>{product.sales} Sales</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {product.reviews} Reviews ({product.rating.toFixed(1)} <span style={{ color: '#ffa41c' }}>★</span>)
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${product.status === "active" ? "completed" : product.status === "low_stock" ? "pending" : "cancelled"}`}>
                          {product.status.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn-small comments" onClick={() => handleViewComments(product)} title="View Comments">
                          <i className="fas fa-comments"></i>
                        </button>
                        <button className="action-btn-small edit" onClick={() => handleEdit(product)} title="Edit Product"><i className="fas fa-edit"></i></button>
                        <button className="action-btn-small delete" onClick={() => handleDelete(product.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="comments-modal-overlay" onClick={() => setShowCommentsModal(false)}>
          <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comments-modal-header">
              <h2>
                <i className="fas fa-comments"></i> Comments for {selectedProduct?.name}
              </h2>
              <button className="close-btn" onClick={() => setShowCommentsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="comments-modal-body">
              {loadingComments ? (
                <div className="loading-comments">
                  <i className="fas fa-spinner fa-spin"></i> Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="no-comments">
                  <i className="fas fa-comment-slash"></i>
                  <p>No comments yet for this product.</p>
                </div>
              ) : (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment._id || comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author-avatar">
                          {comment.buyerId?.name
                            ? comment.buyerId.name.charAt(0).toUpperCase()
                            : comment.buyerId?.email
                              ? comment.buyerId.email.charAt(0).toUpperCase()
                              : "U"}
                        </div>
                        <div className="comment-author-info">
                          <span className="comment-author-name">
                            {comment.buyerId?.name || comment.buyerId?.email || "Anonymous"}
                          </span>
                          <span className="comment-date">
                            {new Date(comment.createdAt || comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="comment-rating">
                          {renderStars(comment.rating || 5)}
                        </div>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content enhanced" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-edit"></i> Edit Product</h2>
              <button className="modal-close" onClick={() => setEditingProduct(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }} className="product-form">
              <div className="form-group">
                <label><i className="fas fa-tag"></i> Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row two-col">
                <div className="form-group">
                  <label><i className="fas fa-dollar-sign"></i> Price</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-box"></i> Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label><i className="fas fa-align-left"></i> Description</label>
                <textarea
                  placeholder="Describe your product..."
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setEditingProduct(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-save"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourListings;
