import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="back-button"
      style={{
        padding: "10px 18px",
        background: "linear-gradient(135deg, #1a5d3a 0%, #0d3b2a 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        marginBottom: "24px",
        fontSize: "14px",
        fontWeight: 600,
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
      <i className="fas fa-arrow-left"></i> Back
    </button>
  );
}

export default BackButton;
