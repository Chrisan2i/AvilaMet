import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getReservations,
    deleteReservation,
    updateReservation,
} from "../../api/reservations";
import { updateExcursion } from "../../api/excursions";

const ManageReservations = () => {
    const [reservas, setReservas] = useState([]);
    const [editingReservation, setEditingReservation] = useState(null);
    const [editingDate, setEditingDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            const data = await getReservations();
            setReservas(data);
        } catch (error) {
            console.error("Error al obtener reservas:", error);
        }
    };

    const handleChangeDate = async (id, newDate) => {
        try {
            await updateReservation(id, { fecha: newDate });
            fetchReservas();
            alert("Fecha de la reserva actualizada exitosamente");
        } catch (error) {
            console.error("Error al actualizar fecha:", error);
        }
    };

    const handleDeleteReservation = async (id) => {
        try {
            await deleteReservation(id);
            setReservas((prev) => prev.filter((r) => r._id !== id && r.id !== id));
            alert("Reserva eliminada exitosamente");
        } catch (error) {
            console.error("Error al eliminar la reserva:", error);
        }
    };

    const handleRemoveReservationFromExcursion = async (excursionId) => {
        try {
            await updateExcursion(excursionId, {
                reservadoPor: "",
                fechaReserva: ""
            });
            alert("Reserva eliminada de la excursión exitosamente");
            fetchReservas();
        } catch (error) {
            console.error("Error al quitar reserva de excursión:", error);
        }
    };

    return (
        <div style={{ backgroundColor: "#fef9c3", minHeight: "100vh", padding: "20px" }}>
            <div className="container mt-4">
                <h2 className="display-4 fw-bold text-custom-green" style={{ fontSize: "3rem", letterSpacing: '2px' }}>
                    Gestionar Reservas
                </h2>

                {/* Mostrar lista de reservas */}
                {reservas.length === 0 ? (
                    <h3 className="text-center">No hay reservas disponibles.</h3>
                ) : (
                    reservas.map((reservation) => (
                        <div key={reservation.id} className="card mb-3 shadow">
                            <div className="row g-0">
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h3 className="card-title">Reserva para: {reservation.ruta}</h3>
                                        <p className="card-text"><strong>Fecha de la reserva:</strong> {reservation.fecha}</p>

                                        {/* Información de la reserva */}
                                        <p className="card-text">
                                            <strong>Reservada por:</strong> {reservation.nombre || "Desconocido"}<br />
                                            <strong>Email:</strong> {reservation.email || "No disponible"}<br />
                                            <strong>Teléfono:</strong> {reservation.telefono || "No disponible"}
                                        </p>

                                        {/* Botones de acción */}
                                        <button className="btn btn-warning me-2" onClick={() => { setEditingReservation(reservation); setEditingDate(reservation.fecha); }}>
                                            ✏️ Editar Fecha
                                        </button>

                                        <button className="btn btn-danger" onClick={() => handleDeleteReservation(reservation.id)}>
                                            ❌ Eliminar Reserva
                                        </button>

                                        <button className="btn btn-warning ms-2" onClick={() => handleRemoveReservationFromExcursion(reservation.id)}>
                                            ❌ Quitar Reserva de Excursión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Formulario para editar la fecha de la reserva */}
                {editingReservation && (
                    <div className="mt-4">
                        <h4>Editar fecha de la reserva para: {editingReservation.ruta}</h4>
                        <input
                            type="date"
                            value={editingDate}
                            onChange={(e) => setEditingDate(e.target.value)}
                            className="form-control"
                        />
                        <button
                            className="btn btn-success mt-2"
                            onClick={() => handleChangeDate(editingReservation.id, editingDate)}
                        >
                            Guardar Cambios
                        </button>
                        <button
                            className="btn btn-secondary mt-2 ms-2"
                            onClick={() => setEditingReservation(null)}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageReservations;
