import axios from "axios";

const API_URL = "http://localhost:5000/api/excursions";

// Obtener todas las excursiones
export const getExcursions = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

// Crear una nueva excursión
export const createExcursion = async (excursion) => {
	const res = await axios.post(API_URL, excursion);
	return res.data;
};

// Actualizar una excursión
export const updateExcursion = async (id, data) => {
	const res = await axios.put(`${API_URL}/${id}`, data);
	return res.data;
};

// Eliminar una excursión
export const deleteExcursion = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`);
	return res.data;
};
