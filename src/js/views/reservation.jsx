import React, { useState, useEffect } from "react";
import { getDestinations } from "../../api/destinations";
import { getExcursions, updateExcursion } from "../../api/excursions";
import { getUserById } from "../../api/users";
import { createReservation } from "../../api/reservations";

const Reservation = () => {
    const [reserva, setReserva] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fecha: "",
        ruta: "",
        guiaId: "",
    });
    const [usuario, setUsuario] = useState(null);
    const [destinos, setDestinos] = useState([]);
    const [excursiones, setExcursiones] = useState([]);
    const [excursionSeleccionada, setExcursionSeleccionada] = useState(null);

    useEffect(() => {
        const cargarUsuario = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            try {
                const user = await getUserById(userId);
                setUsuario(user);
                setReserva((prev) => ({
                    ...prev,
                    email: user.email || "",
                    telefono: user.telefono || "",
                    nombre: user.nombre || "",
                    apellido: user.apellido || "",
                }));
            } catch (err) {
                console.error("Error al obtener usuario:", err);
            }
        };

        cargarUsuario();
    }, []);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await getDestinations();
                setDestinos(data);
            } catch (error) {
                console.error("Error al obtener destinos:", error);
            }
        };

        fetchDestinations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReserva({ ...reserva, [name]: value });

        if (name === "ruta" && value) {
            buscarExcursiones(value);
            setExcursionSeleccionada(null);
        }
    };

    const buscarExcursiones = async (rutaSeleccionada) => {
        try {
            const todas = await getExcursions();
            const filtradas = todas
                .filter((ex) => ex.nombre === rutaSeleccionada && !ex.reservadoPor)
                .map((ex) => ({
                    ...ex,
                    guia: ex.guiaNombre || "Guía asignado",
                }));
            setExcursiones(filtradas);
        } catch (error) {
            console.error("Error al buscar excursiones:", error);
        }
    };

    const handleSeleccionarExcursion = (excursion) => {
        setExcursionSeleccionada(excursion);
        setReserva({
            ...reserva,
            ruta: excursion.nombre,
            guiaId: excursion.guiaId,
            fecha: excursion.fecha,
        });
    };

    const handleCancelarSeleccion = () => {
        setExcursionSeleccionada(null);
        setReserva({ ...reserva, ruta: "", guiaId: "", fecha: "" });
    };

    const handleReserva = async () => {
        try {
            if (!reserva.guiaId) throw new Error("El campo guía no puede estar vacío.");

            const reservaData = {
                nombre: reserva.nombre,
                apellido: reserva.apellido,
                email: reserva.email,
                telefono: reserva.telefono,
                ruta: reserva.ruta,
                fecha: reserva.fecha,
                guiaId: reserva.guiaId,
            };

            for (let key in reservaData) {
                if (!reservaData[key] && key !== "telefono") {
                    throw new Error(`El campo ${key} no puede estar vacío.`);
                }
            }

            const created = await createReservation(reservaData);

            if (excursionSeleccionada) {
                await updateExcursion(excursionSeleccionada._id || excursionSeleccionada.id, {
                    reservadoPor: created._id,
                });
            }

            alert("Reserva realizada con éxito.");
            setReserva({ nombre: "", apellido: "", email: "", telefono: "", fecha: "", ruta: "", guiaId: "" });
            setExcursionSeleccionada(null);
        } catch (error) {
            console.error("Error al realizar la reserva:", error);
            alert("Hubo un error al realizar la reserva: " + error.message);
        }
    };
    return (
        <>
            <div className="container-fluid p-4 text-center" style={{ backgroundColor: "#045c2c" }}>
                <h1 className="text-white fw-bold">RESERVAS</h1>
            </div>

            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-5">
                        <select className="form-select borde mt-3 p-2"
                            name="ruta"
                            value={reserva.ruta}
                            onChange={handleChange}
                            required>
                            <option value="">Seleccione una ruta</option>
                            {destinos.map((destino, index) => (
                                <option key={index} value={destino.nombre}>{destino.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {!excursionSeleccionada && excursiones.length > 0 && (
                    <div className="row mt-4 justify-content-center">
                        {excursiones.map(excursion => (
                            <div key={excursion.id} className="col-md-4 mb-4">
                                <div className="card shadow-lg p-3 text-center" style={{ borderRadius: "15px" }}>
                                    <h5 className="fw-bold">{excursion.nombre}</h5>
                                    <p className="text-muted">Guía: {excursion.guia}</p>
                                    <p className="text-muted">Fecha: {excursion.fecha}</p>
                                    <button className="btn btn-success mt-2" onClick={() => handleSeleccionarExcursion(excursion)}>
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {excursionSeleccionada && (
                    <div className="row mt-4 justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="card p-3 shadow-lg" style={{ borderRadius: "15px" }}>
                                <h4 className="fw-bold text-success">{excursionSeleccionada.nombre}</h4>
                                <p className="text-muted">Fecha: {excursionSeleccionada.fecha}</p>
                                <p className="text-muted">Guía: {excursionSeleccionada.guia}</p>
                                <button className="btn btn-danger mt-2" onClick={handleCancelarSeleccion}>
                                    Cancelar selección
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row mt-5 justify-content-center">
                    <div className="col-12 col-md-4 mb-5 p-4 border rounded shadow bg-light">
                        <button type="button" className="btn text-white w-100"
                            style={{ backgroundColor: "#045c2c", borderRadius: "10px", fontSize: "18px" }}
                            onClick={handleReserva}>
                            Confirmar Reserva
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reservation;
