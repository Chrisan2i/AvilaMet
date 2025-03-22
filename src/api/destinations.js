import axios from "axios";

const API_URL = "http://localhost:5000/api/destinations"; // Cambia el dominio si haces deploy

// Obtener todos los destinos
export const getDestinations = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

// Crear nuevo destino
export const createDestination = async (data) => {
	const res = await axios.post(API_URL, data);
	return res.data;
};

// Editar destino
export const updateDestination = async (id, data) => {
	const res = await axios.put(`${API_URL}/${id}`, data);
	return res.data;
};

// Eliminar destino
export const deleteDestination = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`);
	return res.data;
};
