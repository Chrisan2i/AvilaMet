import React, { useEffect, useState } from "react";
import {
    getExcursions,
    addExcursion,
    updateExcursion,
    deleteExcursion,
} from "../../api/excursions";
import { getDestinations } from "../../api/destinations";
import { getUsers } from "../../api/users";

const ManageExcursions = () => {
    const [excursions, setExcursions] = useState([]);
    const [filteredExcursions, setFilteredExcursions] = useState([]);
    const [filterStatus, setFilterStatus] = useState("todos");

    const [editExcursion, setEditExcursion] = useState({});
    const [editExcursionId, setEditExcursionId] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newExcursion, setNewExcursion] = useState({});

    const [destinations, setDestinations] = useState([]);
    const [guides, setGuides] = useState([]);

    // 🟢 Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [excData, destData] = await Promise.all([
                    getExcursions(),
                    getDestinations(),
                ]);
                setExcursions(excData);
                setFilteredExcursions(excData);
                setDestinations(destData);
            } catch (error) {
                console.error("❌ Error al cargar datos:", error);
            }
        };

        const fetchGuides = async () => {
            try {
                const users = await getUsers();
                const onlyGuides = users.filter(user => user.rol === "Guía");
                console.log("✅ Guías cargados:", onlyGuides);
                setGuides(onlyGuides);
            } catch (error) {
                console.error("❌ Error al obtener los guías:", error);
            }
        };

        fetchData();
        fetchGuides();
    }, []);

    // 🔁 Filtrar excursiones por estado
    useEffect(() => {
        if (filterStatus === "todos") {
            setFilteredExcursions(excursions);
        } else {
            const filtered = excursions.filter(exc =>
                filterStatus === "reservada"
                    ? exc.reservadoPor
                    : !exc.reservadoPor
            );
            setFilteredExcursions(filtered);
        }
    }, [filterStatus, excursions]);

    // 🔄 Input de formularios
    const handleInputChange = (e, setter) => {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value }));
    };

    const handleDestinationChange = (e) => {
        setEditExcursion(prev => ({ ...prev, destinoId: e.target.value }));
    };

    // ➕ Agregar excursión
    const handleAddExcursion = async (e) => {
        e.preventDefault();
        try {
            await addExcursion(newExcursion);
            const updated = await getExcursions();
            setExcursions(updated);
            setNewExcursion({});
            setShowAddForm(false);
            alert("Excursión agregada ✅");
        } catch (error) {
            console.error("❌ Error al agregar excursión:", error);
        }
    };

    // 📝 Editar excursión
    const handleEdit = (excursion) => {
        setEditExcursion({ ...excursion });
        setEditExcursionId(excursion._id || excursion.id);
        setShowAddForm(false);
    };

    const handleUpdateExcursion = async (e) => {
        e.preventDefault();
        if (!editExcursionId) return;

        try {
            await updateExcursion(editExcursionId, editExcursion);
            const updated = await getExcursions();
            setExcursions(updated);
            setEditExcursionId(null);
            setEditExcursion({});
            alert("Excursión actualizada ✅");
        } catch (error) {
            console.error("❌ Error al actualizar excursión:", error);
        }
    };

    // 🗑️ Eliminar
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Eliminar esta excursión?");
        if (!confirmDelete) return;

        try {
            await deleteExcursion(id);
            const updated = await getExcursions();
            setExcursions(updated);
            alert("Excursión eliminada ✅");
        } catch (error) {
            console.error("❌ Error al eliminar excursión:", error);
        }
    };

    return (
        <div style={{ width: "100%", backgroundColor: "#fef9c3", padding: "30px", textAlign: "center" }}>
            <div style={{ backgroundColor: "#31470b", padding: "20px", borderRadius: "10px", display: "inline-block", width: "80%", margin: "auto" }}>
                <h2 className="display-4 fw-bold text-custom-green2"
                    style={{ fontSize: "3rem", letterSpacing: '2px', color: "#fef9c3" }}>
                    Gestión de Excursiones
                </h2>

                <div style={{ marginBottom: "20px" }}>
                    <select onChange={(e) => setFilterStatus(e.target.value)} style={{ fontSize: "1.2rem", padding: "10px", backgroundColor: "#fef9c3", color: "#31470b", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        <option value="todos">Todos</option>
                        <option value="reservada">Reservadas</option>
                        <option value="noReservada">No Reservadas</option>
                    </select>
                </div>

                <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {filteredExcursions.map(excursion => (
                        <div key={excursion._id} style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            margin: "10px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            width: "300px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                        }}>
                            <h3 style={{ marginBottom: "10px", fontSize: "1.5rem", color: "#31470b" }}>{excursion.nombre}</h3>
                            <p><strong>Descripción:</strong> {excursion.descripcion}</p>
                            <p><strong>Fecha:</strong> {excursion.fecha}</p>
                            <p><strong>Guía:</strong> {guides.find(g => g._id === excursion.guiaId)?.nombre || "No asignado"}</p>
                            <p><strong>Estado:</strong> {excursion.reservadoPor ? `Reservada, ID Reserva: ${excursion.reservadoPor}` : "No reservada"}</p>
                            <button onClick={() => handleEdit(excursion)} style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginRight: "10px",
                            }}>
                                Editar
                            </button>
                            <button onClick={() => handleDelete(excursion._id)} style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button
                        className="fw-bold text-custom-green2"
                        onClick={() => { setShowAddForm(!showAddForm); setEditExcursionId(null); }}
                        style={{
                            fontSize: "1.2rem",
                            padding: "10px 20px",
                            backgroundColor: "#fef9c3",
                            color: "#31470b",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px",
                        }}>
                        {showAddForm ? "Cancelar" : "Agregar Excursión"}
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddExcursion} style={{
                        marginTop: "20px",
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                        maxWidth: "400px",
                        margin: "auto",
                    }}>
                        <input type="text" name="nombre" placeholder="Nombre de la ruta" value={newExcursion.nombre} onChange={(e) => handleInputChange(e, setNewExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <textarea name="descripcion" placeholder="Descripción de la ruta" value={newExcursion.descripcion} onChange={(e) => handleInputChange(e, setNewExcursion)} style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="date" name="fecha" value={newExcursion.fecha} onChange={(e) => handleInputChange(e, setNewExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="text" name="dificultad" placeholder="Dificultad" value={newExcursion.dificultad} onChange={(e) => handleInputChange(e, setNewExcursion)} style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <select name="destinoId" value={newExcursion.destinoId} onChange={(e) => handleInputChange(e, setNewExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }}>
                            <option value="">Seleccione un destino</option>
                            {destinations.map(destino => (
                                <option key={destino._id || destino.id} value={destino._id || destino.id}>{destino.nombre}</option>
                            ))}
                        </select>

                        <select name="guiaId" value={newExcursion.guiaId} onChange={(e) => handleInputChange(e, setNewExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }}>
                            <option value="">Seleccione un guía</option>
                            {guides.map(guia => (
                                <option key={guia._id} value={guia._id}>{guia.nombre} - {guia.años_experiencia} años</option>
                            ))}
                        </select>

                        <button type="submit" style={{
                            marginTop: "10px",
                            padding: "10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}>
                            Guardar Excursión
                        </button>
                    </form>
                )}

                {editExcursionId && (
                    <form onSubmit={handleUpdateExcursion} style={{
                        marginTop: "20px",
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                        maxWidth: "400px",
                        margin: "auto",
                    }}>
                        <input type="text" name="nombre" placeholder="Nombre de la ruta" value={editExcursion.nombre} onChange={(e) => handleInputChange(e, setEditExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <textarea name="descripcion" placeholder="Descripción de la ruta" value={editExcursion.descripcion} onChange={(e) => handleInputChange(e, setEditExcursion)} style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="date" name="fecha" value={editExcursion.fecha} onChange={(e) => handleInputChange(e, setEditExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="text" name="dificultad" placeholder="Dificultad" value={editExcursion.dificultad} onChange={(e) => handleInputChange(e, setEditExcursion)} style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <select name="destinoId" value={editExcursion.destinoId} onChange={(e) => handleInputChange(e, setEditExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }}>
                            <option value="">Seleccione un destino</option>
                            {destinations.map(destino => (
                                <option key={destino._id || destino.id} value={destino._id || destino.id}>{destino.nombre}</option>
                            ))}
                        </select>

                        <select name="guiaId" value={editExcursion.guiaId} onChange={(e) => handleInputChange(e, setEditExcursion)} required style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }}>
                            <option value="">Seleccione un guía</option>
                            {guides.map(guia => (
                                <option key={guia._id} value={guia._id}>{guia.nombre} - {guia.años_experiencia} años</option>
                            ))}
                        </select>

                        <button type="submit" style={{
                            marginTop: "10px",
                            padding: "10px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}>
                            Actualizar Excursión
                        </button>

                        <button type="button" onClick={() => { setEditExcursionId(null); setEditExcursion({}); }} style={{
                            marginTop: "10px",
                            padding: "10px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}>
                            Cancelar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ManageExcursions;