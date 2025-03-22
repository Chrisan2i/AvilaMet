import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDestination } from "../../api/destinations"; // ✅ tu función API adaptada

const AddDestination = () => {
    const navigate = useNavigate();
    const [newDestination, setNewDestination] = useState({
        nombre: "",
        descripcion: "",
        ranking: "",
        km: "",
        dificultad: "",
        tiempo: "",
        fotos: [""],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewDestination({ ...newDestination, [name]: value });
    };

    const handleAddPhotoField = () => {
        setNewDestination((prev) => ({
            ...prev,
            fotos: [...prev.fotos, ""],
        }));
    };

    const handlePhotoChange = (index, value) => {
        const updatedPhotos = [...newDestination.fotos];
        updatedPhotos[index] = value;
        setNewDestination({ ...newDestination, fotos: updatedPhotos });
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = newDestination.fotos.filter((_, i) => i !== index);
        setNewDestination({ ...newDestination, fotos: updatedPhotos });
    };

    const handleSaveDestination = async () => {
        try {
            await createDestination(newDestination);
            alert("Destino agregado correctamente ✅");
            navigate("/");
        } catch (error) {
            console.error("❌ Error al agregar destino:", error);
            alert("Hubo un error al guardar el destino.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Agregar Nuevo Destino</h2>

            {/* Contenedor de inputs */}
            <div className="d-flex align-items-center justify-content-center">
                <div>
                    {/* Inputs con estados */}
                    <input
                        className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                        style={{ flex: 1, marginRight: "20px" }}
                        value={newDestination.nombre}
                        onChange={handleChange}
                        name="nombre"
                        placeholder="Nombre del destino"
                    />
                    <input
                        className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                        style={{ flex: 1, marginRight: "20px" }}
                        value={newDestination.descripcion}
                        onChange={handleChange}
                        name="descripcion"
                        placeholder="Descripción"
                    />
                    <input
                        className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                        style={{ flex: 1, marginRight: "20px" }}
                        value={newDestination.ranking}
                        onChange={handleChange}
                        name="ranking"
                        type="number"
                        placeholder="Ranking (1-5)"
                    />
                    <input
                        className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                        style={{ flex: 1, marginRight: "20px" }}
                        value={newDestination.km}
                        onChange={handleChange}
                        name="km"
                        type="number"
                        placeholder="Kilómetros del trayecto"
                    />
                    <select
                        className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                        style={{ flex: 1, marginRight: "20px" }}
                        value={newDestination.dificultad}
                        onChange={handleChange}
                        name="dificultad"
                    >
                        <option value="">Seleccionar Dificultad</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Medio">Medio</option>
                        <option value="Difícil">Difícil</option>
                    </select>
                    <input
                        className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                        style={{ flex: 1, marginRight: "20px" }}
                        value={newDestination.tiempo}
                        onChange={handleChange}
                        name="tiempo"
                        placeholder="Tiempo estimado (ej: 1h 30min)"
                    />

                    {/* 🔥 Sección para agregar imágenes (URLs) */}
                    <h5 className="mt-4">Imágenes del Destino</h5>
                    {newDestination.fotos.map((foto, index) => (
                        <div key={index} className="d-flex align-items-center">
                            <input
                                className="d-flex flex-column inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                style={{ flex: 1, marginRight: "10px" }}
                                type="text"
                                value={foto}
                                onChange={(e) => handlePhotoChange(index, e.target.value)}
                                placeholder="URL de la imagen"
                            />
                            <button
                                className="btn btn-danger"
                                onClick={() => handleRemovePhoto(index)}
                                style={{ fontSize: "14px", padding: "5px 10px" }}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                    <button
                        className="btn btn-secondary mt-2"
                        onClick={handleAddPhotoField}
                        style={{ fontSize: "14px", padding: "5px 10px" }}
                    >
                        ➕ Agregar otra imagen
                    </button>

                    {/* Botones de acción */}
                    <div className="d-flex justify-content-between mt-3">
                        <button
                            className="btn bg-custom-green button-width text-custom-green2 placeholder-custom btn-hover"
                            onClick={handleSaveDestination}
                            style={{
                                backgroundColor: "#09490e",
                                border: "2px solid #09490e",
                                color: "#fbfada",
                                padding: "10px 20px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "20px",
                                fontWeight: "bold",
                                letterSpacing: "1px",
                                transition: "all 0.2s ease-in-out",
                                marginRight: "10px",
                            }}
                        >
                            Guardar Destino
                        </button>

                        <button
                            className="btn bg-custom-red button-width text-custom-green2 placeholder-custom btn-hover"
                            onClick={() => navigate("/")}
                            style={{
                                backgroundColor: "#d9534f",
                                border: "2px solid #d43f3a",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "20px",
                                fontWeight: "bold",
                                letterSpacing: "1px",
                                transition: "all 0.2s ease-in-out",
                            }}
                        >
                            Cancelar / Salir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDestination;
