import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDestination } from "../../api/destinations";
import axios from "axios";

const AddDestination = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [newDestination, setNewDestination] = useState({
        nombre: "",
        descripcion: "",
        ranking: "",
        km: "",
        dificultad: "",
        tiempo: "",
        fotos: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewDestination({ ...newDestination, [name]: value });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + newDestination.fotos.length > 3) {
            alert("Solo puedes subir un máximo de 3 imágenes.");
            return;
        }

        setUploading(true);
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "mi_preset"); // 🔁 Reemplaza con tu preset
                const res = await axios.post(
                    "https://api.cloudinary.com/v1_1/dhlyuaknz/image/upload", // 🔁 Reemplaza con tu cloud name
                    formData
                );
                return res.data.secure_url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setNewDestination((prev) => ({
                ...prev,
                fotos: [...prev.fotos, ...uploadedUrls],
            }));
        } catch (error) {
            console.error("Error al subir imágenes:", error);
        }
        setUploading(false);
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

            <div className="d-flex align-items-center justify-content-center">
                <div>
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

                    {/* 🔥 NUEVA sección para subir imágenes a Cloudinary */}
                    <h5 className="mt-4">Imágenes del Destino</h5>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="form-control mb-2"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />

                    <div className="mt-2 d-flex flex-wrap gap-2">
                        {newDestination.fotos.map((foto, index) => (
                            <div key={index} className="position-relative">
                                <img
                                    src={foto}
                                    alt={`Imagen ${index + 1}`}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                    onClick={() => handleRemovePhoto(index)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>

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
