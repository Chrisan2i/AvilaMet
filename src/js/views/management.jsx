import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/destination.css";

const Management = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Debes iniciar sesión para acceder.");
      navigate("/login");
    }
  }, [navigate]);

  const goToManageGuides = () => navigate("/manage_guides");
  const goToManageExcursions = () => navigate("/manage_excursions");
  const goToManageRoutes = () => navigate("/manage_routes");

  return (
    <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#fef9c3", padding: "50px" }}>
      <p className="display-4 fw-bold text-custom-green"
        style={{
          fontSize: "3rem",
          lineHeight: "1.6",
          textAlign: "justify",
        }}>
        Selecciona una de las opciones a gestionar:
      </p>
      <div style={{ backgroundColor: "#31470b", padding: "20px", borderRadius: "10px", display: "inline-block" }}>
        <button
          className="btn btn-primary mb-3"
          style={{
            backgroundColor: "#fef9c3",
            border: "2px solid #31470b",
            color: "#31470b",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "1px",
            transition: "background-color 0.3s, transform 0.3s",
            marginBottom: "10px"
          }}
          onClick={goToManageGuides}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#e0e0a3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#fef9c3"}
        >
          Guías
        </button>

        <button
          className="btn btn-secondary mb-3"
          style={{
            backgroundColor: "#fef9c3",
            border: "2px solid #31470b",
            color: "#31470b",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "1px",
            transition: "background-color 0.3s, transform 0.3s",
            marginBottom: "10px",
            marginLeft: "10px"
          }}
          onClick={goToManageExcursions}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#e0e0a3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#fef9c3"}
        >
          Excursiones
        </button>

        <button
          className="btn btn-third"
          style={{
            backgroundColor: "#fef9c3",
            border: "2px solid #31470b",
            color: "#31470b",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "1px",
            transition: "background-color 0.3s, transform 0.3s",
            marginBottom: "10px",
            marginLeft: "10px"
          }}
          onClick={goToManageRoutes}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#e0e0a3"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#fef9c3"}
        >
          Destinos
        </button>
      </div>
    </div>
  );
}

export default Management;