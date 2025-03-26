import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getReservations,
    deleteReservation,
    updateReservation,
} from "../../api/reservations";
import {
    getExcursions,
    updateExcursion,
} from "../../api/excursions";

const ManageReservations = () => {
    const [reservas, setReservas] = useState([]);
    const [excursiones, setExcursiones] = useState([]);
    const [editingReservation, setEditingReservation] = useState(null);
    const [editingDate, setEditingDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getReservations();
            const excursionesData = await getExcursions();
            setReservas(data);
            setExcursiones(excursionesData);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const handleChangeDate = async (id, newDate) => {
        try {
            await updateReservation(id, { fecha: newDate });
            fetchData();
            alert("Fecha de la reserva actualizada exitosamente");
        } catch (error) {
            console.error("Error al actualizar fecha:", error);
        }
    };

    const handleDeleteReservation = async (reservationId) => {
        try {
            const reserva = reservas.find((r) => r._id === reservationId || r.id === reservationId);
            if (!reserva) return;

            const excursion = excursiones.find((ex) => ex._id === reserva.excursionId);
            if (excursion) {
                const nuevoReservadoPor = (excursion.reservadoPor || []).filter(id => id !== reserva.userId);
                await updateExcursion(excursion._id, { reservadoPor: nuevoReservadoPor });
            }

            await deleteReservation(reservationId);
            setReservas((prev) => prev.filter((r) => r._id !== reservationId && r.id !== reservationId));
            alert("Reserva eliminada exitosamente");
        } catch (error) {
            console.error("Error al eliminar la reserva:", error);
        }
    };

    const handleRemoveReservationFromExcursion = async (reservationId) => {
        try {
            const reserva = reservas.find((r) => r._id === reservationId || r.id === reservationId);
            if (!reserva) return;

            const excursion = excursiones.find((ex) => ex._id === reserva.excursionId);
            if (!excursion) return;

            const nuevoReservadoPor = (excursion.reservadoPor || []).filter(id => id !== reserva.userId);
            await updateExcursion(excursion._id, { reservadoPor: nuevoReservadoPor });

            alert("Reserva eliminada de la excursión exitosamente");
            fetchData();
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

                {reservas.length === 0 ? (
                    <h3 className="text-center">No hay reservas disponibles.</h3>
                ) : (
                    reservas.map((reservation) => (
                        <div key={reservation._id || reservation.id} className="card mb-3 shadow">
                            <div className="row g-0">
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h3 className="card-title">Reserva para: {reservation.ruta}</h3>
                                        <p className="card-text"><strong>Fecha de la reserva:</strong> {reservation.fecha}</p>
                                        <p className="card-text">
                                            <strong>Reservada por:</strong> {reservation.nombre || "Desconocido"}<br />
                                            <strong>Email:</strong> {reservation.email || "No disponible"}<br />
                                            <strong>Teléfono:</strong> {reservation.telefono || "No disponible"}
                                        </p>

                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => {
                                                setEditingReservation(reservation);
                                                setEditingDate(reservation.fecha);
                                            }}
                                        >
                                            ✏️ Editar Fecha
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteReservation(reservation._id || reservation.id)}
                                        >
                                            ❌ Eliminar Reserva
                                        </button>

                                        <button
                                            className="btn btn-warning ms-2"
                                            onClick={() => handleRemoveReservationFromExcursion(reservation._id || reservation.id)}
                                        >
                                            ❌ Quitar Reserva de Excursión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

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
                            onClick={() => handleChangeDate(editingReservation._id || editingReservation.id, editingDate)}
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
