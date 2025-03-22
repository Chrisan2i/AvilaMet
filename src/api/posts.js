import axios from "axios";
const API_URL = "http://localhost:5000/api/posts";

export const getPosts = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

export const createPost = async (data) => {
	const res = await axios.post(API_URL, data);
	return res.data;
};

// ✅ Agrega esta función si no la tienes
export const getPostsByUserId = async (userId) => {
	const res = await axios.get(API_URL);
	return res.data.filter((post) => post.userId === userId);
};

export const updatePost = async (id, data) => {
	const res = await axios.put(`${API_URL}/${id}`, data);
	return res.data;
};

export const deletePostById = async (id) => {
	const res = await axios.delete(`${API_URL}/${id}`);
	return res.data;
};
