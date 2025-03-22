const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String,
  ruta: String,
  fecha: String,
  guiaId: String,
  idReserva: String // ID generado en el momento de la reserva
});

module.exports = mongoose.model('Reservation', ReservationSchema);
