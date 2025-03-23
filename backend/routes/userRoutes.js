const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🧹 Eliminando usuario con ID:", id); // <-- Esto lo ves en consola
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar usuario", error: err.message });
    }
});


  

// ✅ GET user by ID (lo que tienes tú)
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		console.log("🟡 ID recibido:", id);

		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ message: "ID inválido" });
		}

		const user = await User.findOne({ _id: new ObjectId(id) });

		if (!user) {
			console.log("❌ Usuario no encontrado");
			return res.status(404).json(null);
		}

		console.log("✅ Usuario encontrado:", user);
		res.json(user);
	} catch (err) {
		console.error("Error buscando usuario:", err);
		res.status(500).json({ message: err.message });
	}
});

// POST new user
router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

		if (!updatedUser) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		res.json(updatedUser);
	} catch (err) {
		console.error("Error actualizando usuario:", err);
		res.status(500).json({ message: err.message });
	}
});


module.exports = router;
