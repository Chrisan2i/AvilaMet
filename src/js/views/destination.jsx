import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../api/users";
import { getDestinations } from "../../api/destinations";

const Destination = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const user = await getUserById(userId);
          setUserRole(user.rol || "Excursionista");
        } catch (error) {
          console.error("Error al obtener rol:", error);
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Error al cargar destinos:", error);
      }
    };

    fetchDestinos();
  }, []);

  const goToAddDestination = () => navigate("/adddestination");
  const goToGallery = () => navigate("/gallery");

  const goToReservations = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/reservation");
    } else {
      alert("Debes iniciar sesión para hacer una reservación.");
      navigate("/login");
    }
  };

  return (
    <div className="bg-light">
      {/* Header */}
      <div className="bg-light bg-custom-yellow">
        <header className="imagen pasos">
          <img
            src="https://res.cloudinary.com/danezqzag/image/upload/v1742239334/mountaineer-3791851_1280_yxd3cg.jpg"
            alt="Header"
            className="w-100"
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-custom-green2">
            <h1 className="display-4 fw-bold"
              style={{
                fontSize: "10rem",
                letterSpacing: '8px'
              }}>
              DESTINOS
            </h1>
          </div>
        </header>
      </div>

      {/* Contenedor principal */}
      <div className="descripcion">
        <div className="container-fluid p-4 bg-custom-yellow text-custom-paragraph">
          <p className="mb-0"
            style={{
              fontSize: "3rem",
              height: '100px',
              marginLeft: "120px",
              marginRight: "80px",
            }}>
            Los mejores destinos en Parque Nacional El Ávila
          </p>

          {/* BOTONES SOLO PARA ADMIN */}
          {userRole && userRole.toLowerCase() === "admin" && (
            <div>
              <button
                className="btn btn-success"
                onClick={goToAddDestination}
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  marginLeft: "350px",
                  marginRight: "20px",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
              >
                Agregar Destino +
              </button>

              <button
                className="btn btn-danger"
                onClick={() => navigate("/manage_routes")}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
              >
                Gestionar Destinos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LISTA DE DESTINOS DESDE FIRESTORE */}
      <div className="container-fluid p-4 bg-custom-yellow">
        {destinations.length === 0 ? (
          <h2 className="text-center text-custom-paragraph">No hay destinos disponibles.</h2>
        ) : (
          destinations.map((destino) => (
            <div key={destino.id} className="container-fluid p-4 bg-custom-yellow">
              {/* Título */}
              <h1 className="h2 mb-4 text-custom-green"
                style={{
                  fontSize: "6rem",
                  marginLeft: "50px",
                }}>
                {destino.nombre}
              </h1>

              {/* Sección superior: Estrellas, distancia, dificultad y tiempo */}
              <div className="d-flex gap-3 mb-3 text-custom-paragraph"
                style={{
                  fontSize: "3rem",
                  marginLeft: "50px",
                }}>
                <span> ★ {destino.ranking}</span>
                <span>|</span>
                <span> ↗ {destino.km} km</span>
                <span>|</span>
                <span> ⇑ {destino.dificultad}</span>
                <span>|</span>
                <span> 🕒 {destino.tiempo}</span>
              </div>

              {/* Sección de imágenes */}
              <div className="row align-items-start">
                {/* Columna para la imagen principal */}
                <div className="col-md-6">
                  <div className="position-relative">
                    {destino.fotos?.[0] && (
                      <img
                        src={destino.fotos[0]}
                        alt="Imagen principal"
                        className="img-fluid"
                        style={{
                          width: "400px",
                          height: "500px",
                          objectFit: "cover",
                          borderRadius: "15px",
                          marginLeft: "50px",
                        }}
                      />
                    )}
                    <button className="btn btn-primary position-absolute"
                      style={{
                        backgroundColor: "transparent",
                        border: "2px solid #fbfada",
                        color: "#fbfada",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        bottom: "20px",
                        left: "70px",
                        fontSize: "20px",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={goToGallery}
                    >
                      Ver más
                    </button>
                  </div>
                </div>

                {/* Columna para las imágenes 2 y 3 */}
                <div className="col-md-3 d-flex flex-column gap-3">
                  {destino.fotos?.[1] && (
                    <img
                      src={destino.fotos[1]}
                      alt="Imagen secundaria"
                      className="img-fluid"
                      style={{
                        width: "400px",
                        height: "240px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        marginLeft: "-250px",
                      }}
                    />
                  )}
                  {destino.fotos?.[2] && (
                    <img
                      src={destino.fotos[2]}
                      alt="Imagen secundaria"
                      className="img-fluid"
                      style={{
                        width: "400px",
                        height: "240px",
                        objectFit: "cover",
                        borderRadius: "15px",
                        marginLeft: "-250px",
                      }}
                    />
                  )}
                </div>

                {/* Columna para descripción y botón de reserva */}
                <div className="col-md-3 d-flex flex-column justify-content-between text-custom-paragraph">
                  <p
                    style={{
                      fontSize: "2.2rem",
                      lineHeight: "1.4",
                      marginLeft: "-200px",
                      marginRight: "100px",
                    }}>
                    {destino.descripcion}
                  </p>
                  <button className="btn btn-success align-self-center"
                    style={{
                      backgroundColor: "#09490e",
                      border: "2px solid #09490e",
                      color: "#fbfada",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "bold",
                      letterSpacing: "1px"
                    }}
                    onClick={goToReservations}
                  >
                    Reservar ahora
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Destination;