import React, { useEffect, useState } from "react";
import {
    getDestinations,
    updateDestination,
    deleteDestination,
} from "../../api/destinations";

const ManageRoutes = () => {
    const [destinations, setDestinations] = useState([]);
    const [editingDestination, setEditingDestination] = useState(null);
    const [editForm, setEditForm] = useState(null);

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

                {/* Modo edición */}
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

                        {/* Botones de acción */}
                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-success" onClick={handleSaveChanges}>Guardar Cambios</button>
                            <button className="btn btn-secondary" onClick={() => setEditingDestination(null)}>Cancelar</button>
                        </div>
                    </div>
                ) : (
                    // Lista de destinos
                    destinations.length === 0 ? (
                        <h3 className="text-center">No hay destinos disponibles.</h3>
                    ) : (
                        destinations.map((destino) => (
                            <div key={destino.id} className="card mb-3 shadow">
                                <div className="row g-0">
                                    {/* Imagen del destino */}
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

                                    {/* Detalles del destino */}
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

                                            {/* Botones de Editar y Eliminar */}
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
