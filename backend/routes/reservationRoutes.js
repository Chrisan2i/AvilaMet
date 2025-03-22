const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// Obtener todas las reservas
router.get('/', async (req, res) => {
	try {
		const reservas = await Reservation.find();
		res.json(reservas);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Crear una nueva reserva
router.post('/', async (req, res) => {
	try {
		const nuevaReserva = new Reservation(req.body);
		const guardada = await nuevaReserva.save();
		res.status(201).json(guardada);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Actualizar reserva (ej. fecha)
router.put('/:id', async (req, res) => {
	try {
		const actualizada = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(actualizada);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Eliminar reserva
router.delete('/:id', async (req, res) => {
	try {
		await Reservation.findByIdAndDelete(req.params.id);
		res.json({ message: "Reserva eliminada" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
