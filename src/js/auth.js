// src/js/auth.js

// Verifica si hay un usuario autenticado (por ID)
export const isAuthenticated = () => {
	const userId = localStorage.getItem("userId");
	return !!userId; // retorna true si existe
};

// Cierra sesión eliminando el userId y redirigiendo
export const logout = () => {
	localStorage.removeItem("userId");
	window.location.href = "/login";
};
