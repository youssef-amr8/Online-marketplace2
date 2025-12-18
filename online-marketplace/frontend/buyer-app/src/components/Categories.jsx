// src/components/Categories.jsx
import React from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import "./Categories.css";

const Categories = () => {
  return (
    <div className="categories-section">
      <nav className="categories-navbar">
        <div className="categories-container">
          {categories.slice(0, 9).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-link"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Categories;
