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
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            excursionId,
            nombre,
            apellido,
            email,
            telefono,
            fecha,
            ruta,
            guiaId
        } = req.body;

        // 1. Verificar si ya reservó esta excursión
        const yaExiste = await Reservation.findOne({ userId, excursionId });
        if (yaExiste) {
            return res.status(400).json({ error: "Ya tienes una reserva en esta excursión." });
        }

        // 2. Verificar que la excursión exista
        const excursion = await Excursion.findById(excursionId);
        if (!excursion) {
            return res.status(404).json({ error: "Excursión no encontrada." });
        }

        // 3. Validar cupos disponibles
        if ((excursion.reservadoPor?.length || 0) >= excursion.maxPersonas) {
            return res.status(400).json({ error: "No hay cupos disponibles en esta excursión." });
        }

        // 4. Crear reserva
        const nuevaReserva = new Reservation({
            userId,
            excursionId,
            nombre,
            apellido,
            email,
            telefono,
            fecha,
            ruta,
            guiaId,
        });
        const guardada = await nuevaReserva.save();

        // 5. Agregar userId a reservadoPor
        excursion.reservadoPor.push(userId);
        await excursion.save();

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
        const reserva = await Reservation.findById(req.params.id);
        if (!reserva) return res.status(404).json({ error: "Reserva no encontrada." });

        // Eliminar el userId del array reservadoPor
        await Excursion.findByIdAndUpdate(reserva.excursionId, {
            $pull: { reservadoPor: reserva.userId },
        });

        // Eliminar la reserva
        await Reservation.findByIdAndDelete(req.params.id);

        res.json({ message: "Reserva eliminada y excursión actualizada." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
