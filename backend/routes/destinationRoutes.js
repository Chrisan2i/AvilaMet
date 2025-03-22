const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// 👉 GET /api/destinations - obtener todos
router.get('/', async (req, res) => {
	try {
		const destinos = await Destination.find();
		res.json(destinos);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// 👉 POST /api/destinations - crear uno nuevo
router.post('/', async (req, res) => {
	try {
		const nuevo = new Destination(req.body);
		const guardado = await nuevo.save();
		res.status(201).json(guardado);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// 👉 PUT /api/destinations/:id - editar destino
router.put('/:id', async (req, res) => {
	try {
		const actualizado = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(actualizado);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// 👉 DELETE /api/destinations/:id - eliminar destino
router.delete('/:id', async (req, res) => {
	try {
		await Destination.findByIdAndDelete(req.params.id);
		res.json({ message: 'Destino eliminado' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;

