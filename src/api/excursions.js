// src/api/excursions.js

import axios from "axios";

const API_URL = "http://localhost:5000/api/excursions";

// ✅ Asegúrate de tener esta función definida y exportada
export const addExcursion = async (excursionData) => {
  const response = await axios.post(API_URL, excursionData);
  return response.data;
};

// También deberías tener algo como esto:
export const getExcursions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateExcursion = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteExcursion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
