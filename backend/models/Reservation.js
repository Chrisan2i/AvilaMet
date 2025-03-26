const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    ruta: String,
    fecha: String,
    guiaId: String,
    idReserva: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    excursionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Excursion', required: true },

    fechaReserva: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
