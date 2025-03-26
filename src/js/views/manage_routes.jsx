import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    getDestinations,
    updateDestination,
    deleteDestination,
} from "../../api/destinations";

const ManageRoutes = () => {
    const [destinations, setDestinations] = useState([]);
    const [editingDestination, setEditingDestination] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await getDestinations();
                setDestinations(data);
            } catch (error) {
                console.error("❌ Error al obtener destinos:", error);
            }
        };

        fetchDestinations();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este destino?");
        if (confirmDelete) {
            try {
                await deleteDestination(id);
                setDestinations(destinations.filter(dest => dest._id !== id && dest.id !== id));
                alert("Destino eliminado correctamente ✅");
            } catch (error) {
                console.error("❌ Error al eliminar el destino:", error);
            }
        }
    };

    const handleEdit = (destino) => {
        setEditingDestination(destino._id || destino.id);
        setEditForm({ ...destino });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + (editForm.fotos?.length || 0) > 3) {
            alert("Solo se permiten máximo 3 imágenes.");
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "mi_preset"); // 🔁 Reemplaza con tu preset
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dhlyuaknz/image/upload", // 🔁 Reemplaza con tu cloud name
                    formData
                );
                return response.data.secure_url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setEditForm({
                ...editForm,
                fotos: [...(editForm.fotos || []), ...uploadedUrls]
            });
        } catch (error) {
            console.error("Error al subir imagen:", error);
        }

        setUploading(false);
    };

    const handleRemoveImage = (indexToRemove) => {
        setEditForm({
            ...editForm,
            fotos: editForm.fotos.filter((_, i) => i !== indexToRemove)
        });
    };

    const handleSaveChanges = async () => {
        try {
            await updateDestination(editingDestination, editForm);
            setDestinations(destinations.map(dest =>
                (dest._id === editingDestination || dest.id === editingDestination) ? editForm : dest
            ));
            setEditingDestination(null);
            alert("Destino actualizado correctamente ✅");
        } catch (error) {
            console.error("❌ Error al actualizar destino:", error);
        }
    };

    return (
        <div style={{ backgroundColor: "#fef9c3", minHeight: "100vh", padding: "20px" }}>
            <div className="container mt-4">
                <h2 className="display-4 fw-bold text-custom-green"
                    style={{ fontSize: "3rem", letterSpacing: '2px' }}
                >Gestionar Destinos</h2>

                {editingDestination ? (
                    <div className="card p-4 shadow">
                        <h3 className="text-center">Editar Destino</h3>
                        <input
                            className="form-control mb-2"
                            value={editForm.nombre}
                            onChange={handleEditChange}
                            name="nombre"
                            placeholder="Nombre del destino"
                        />
                        <textarea
                            className="form-control mb-2"
                            value={editForm.descripcion}
                            onChange={handleEditChange}
                            name="descripcion"
                            placeholder="Descripción"
                        />
                        <input
                            className="form-control mb-2"
                            type="number"
                            value={editForm.ranking}
                            onChange={handleEditChange}
                            name="ranking"
                            placeholder="Ranking (1-5)"
                        />
                        <input
                            className="form-control mb-2"
                            type="number"
                            value={editForm.km}
                            onChange={handleEditChange}
                            name="km"
                            placeholder="Kilómetros del trayecto"
                        />
                        <select
                            className="form-control mb-2"
                            value={editForm.dificultad}
                            onChange={handleEditChange}
                            name="dificultad"
                        >
                            <option value="Fácil">Fácil</option>
                            <option value="Medio">Medio</option>
                            <option value="Difícil">Difícil</option>
                        </select>
                        <input
                            className="form-control mb-2"
                            value={editForm.tiempo}
                            onChange={handleEditChange}
                            name="tiempo"
                            placeholder="Tiempo estimado (ej: 1h 30min)"
                        />

                        {/* Carga y previsualización de imágenes */}
                        <div className="mb-2">
                            <label className="form-label">Imágenes (máx 3):</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="form-control"
                                onChange={handleImageChange}
                                disabled={uploading}
                            />
                            <div className="mt-2 d-flex flex-wrap gap-2">
                                {editForm.fotos?.map((foto, index) => (
                                    <div key={index} className="position-relative">
                                        <img
                                            src={foto}
                                            alt={`Imagen ${index + 1}`}
                                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-success" onClick={handleSaveChanges}>Guardar Cambios</button>
                            <button className="btn btn-secondary" onClick={() => setEditingDestination(null)}>Cancelar</button>
                        </div>
                    </div>
                ) : (
                    destinations.length === 0 ? (
                        <h3 className="text-center">No hay destinos disponibles.</h3>
                    ) : (
                        destinations.map((destino) => (
                            <div key={destino.id} className="card mb-3 shadow">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        {destino.fotos?.length > 0 && (
                                            <img
                                                src={destino.fotos[0]}
                                                alt={`Imagen de ${destino.nombre}`}
                                                className="img-fluid rounded-start"
                                                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                            />
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h3 className="card-title">{destino.nombre}</h3>
                                            <p className="card-text">{destino.descripcion}</p>
                                            <p className="card-text">
                                                <strong>Ranking:</strong> ★ {destino.ranking} |
                                                <strong> Distancia:</strong> {destino.km} km |
                                                <strong> Dificultad:</strong> {destino.dificultad} |
                                                <strong> Tiempo:</strong> {destino.tiempo}
                                            </p>
                                            <button
                                                className="btn btn-warning me-2"
                                                onClick={() => handleEdit(destino)}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(destino.id)}
                                            >
                                                ❌ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default ManageRoutes;
