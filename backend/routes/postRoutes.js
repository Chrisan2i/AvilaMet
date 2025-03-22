const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Obtener todos los posts
router.get("/", async (req, res) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Crear un post
router.post("/", async (req, res) => {
	try {
		const newPost = new Post(req.body);
		const saved = await newPost.save();
		res.status(201).json(saved);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Editar un post
router.put("/:id", async (req, res) => {
	try {
		const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Eliminar un post
router.delete("/:id", async (req, res) => {
	try {
		await Post.findByIdAndDelete(req.params.id);
		res.json({ message: "Post eliminado" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
