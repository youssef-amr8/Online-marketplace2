import { useState } from "react";

function OrdersFilterBar({ onFilterChange, showDateSold = true }) {
  const [filters, setFilters] = useState({
    dateSold: "",
    datePublished: "",
    category: "",
    priceRange: "",
    sort: "",
  });
  const [showPanel, setShowPanel] = useState(false);
  const [activeFields, setActiveFields] = useState(new Set());

  const availableFields = [
    { key: "priceRange", label: "Price range" },
    { key: "category", label: "Category" },
    ...(showDateSold ? [{ key: "dateSold", label: "Date sold" }] : []),
    { key: "datePublished", label: "Date published" },
    { key: "sort", label: "Sort" },
  ];

  const emitFilters = (updatedFilters, fields = activeFields) => {
    const filtered = { ...updatedFilters };
    Object.keys(filtered).forEach((key) => {
      if (!fields.has(key)) {
        filtered[key] = "";
      }
    });
    onFilterChange(filtered);
  };

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    emitFilters(updated);
  };

  const toggleField = (fieldKey) => {
    const next = new Set(activeFields);
    if (next.has(fieldKey)) {
      next.delete(fieldKey);
    } else {
      next.add(fieldKey);
    }
    setActiveFields(next);
    emitFilters(filters, next);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => setShowPanel((s) => !s)}
          style={{
            padding: "12px 18px",
            background: "linear-gradient(135deg, #1a5d3a 0%, #0d3b2a 100%)",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(26, 93, 58, 0.25)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 20px rgba(26, 93, 58, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(26, 93, 58, 0.25)";
          }}
        >
          <i className="fas fa-filter"></i> Filter options
        </button>
      </div>

      {showPanel && (
        <div
          style={{
            marginTop: "16px",
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 12px 26px rgba(17, 24, 39, 0.12)",
            padding: "16px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ marginBottom: "10px", fontWeight: 600 }}>
            Choose which filters to use (multi-select)
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {availableFields.map((field) => (
              <label
                key={field.key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: activeFields.has(field.key)
                    ? "rgba(26, 93, 58, 0.12)"
                    : "#f4f6fb",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: activeFields.has(field.key)
                    ? "2px solid #1a5d3a"
                    : "1px solid #e5e7eb",
                  transition: "all 0.3s ease",
                }}
              >
                <input
                  type="checkbox"
                  checked={activeFields.has(field.key)}
                  onChange={() => toggleField(field.key)}
                  style={{ width: "16px", height: "16px" }}
                />
                <span>{field.label}</span>
              </label>
            ))}
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {activeFields.has("priceRange") && (
              <select
                onChange={(e) => handleChange("priceRange", e.target.value)}
                value={filters.priceRange}
              >
                <option value="">Price Filter</option>
                <option value="0-200">Less than 200</option>
                <option value="200-400">200 - 400</option>
                <option value="400-600">400 - 600</option>
                <option value="600+">Above 600</option>
              </select>
            )}

            {activeFields.has("category") && (
              <input
                type="text"
                placeholder="Category"
                onChange={(e) => handleChange("category", e.target.value)}
                value={filters.category}
              />
            )}

            {showDateSold && activeFields.has("dateSold") && (
              <input
                type="date"
                onChange={(e) => handleChange("dateSold", e.target.value)}
                value={filters.dateSold}
              />
            )}

            {activeFields.has("datePublished") && (
              <input
                type="date"
                onChange={(e) => handleChange("datePublished", e.target.value)}
                value={filters.datePublished}
              />
            )}

            {activeFields.has("sort") && (
              <select
                onChange={(e) => handleChange("sort", e.target.value)}
                value={filters.sort}
              >
                <option value="">Sort</option>
                <option value="high-low">Price High → Low</option>
                <option value="low-high">Price Low → High</option>
                <option value="recent">Most Recent</option>
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersFilterBar;
