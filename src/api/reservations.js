import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";

// Obtener todas las reservas
export const getReservations = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

// Crear una reserva
export const createReservation = async (reservation) => {
	const res = await axios.post(API_URL, reservation);
	return res.data;
};

// Actualizar una reserva (ej. cambiar fecha)
export const updateReservation = async (id, data) => {
	const res = await axios.put(`${API_URL}/${id}`, data);
	return res.data;
};

// Eliminar una reserva
export const deleteReservation = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`);
	return res.data;
};
