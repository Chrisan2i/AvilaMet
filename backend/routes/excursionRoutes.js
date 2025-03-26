const express = require('express');
const router = express.Router();
const Excursion = require('../models/Excursion');
const Reservation = require('../models/Reservation'); // 👈 importante

// Obtener todas las excursiones
router.get('/', async (req, res) => {
	try {
		const excursiones = await Excursion.find().lean();

		const disponibles = excursiones.filter(exc =>
			!exc.maxPersonas || (exc.reservadoPor?.length || 0) < exc.maxPersonas
		);

		res.json(disponibles);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Crear excursión
router.post('/', async (req, res) => {
	try {
		const nueva = new Excursion(req.body);
		const guardada = await nueva.save();
		res.status(201).json(guardada);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Actualizar excursión
router.put('/:id', async (req, res) => {
	try {
		const actualizada = await Excursion.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.json(actualizada);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Eliminar excursión y sus reservas asociadas
router.delete('/:id', async (req, res) => {
	try {
		const excursionId = req.params.id;

		// Eliminar todas las reservas asociadas
		await Reservation.deleteMany({ excursionId });

		// Eliminar la excursión
		await Excursion.findByIdAndDelete(excursionId);

		res.json({ message: "Excursión y sus reservas eliminadas correctamente." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
