const mongoose = require('mongoose');

const ExcursionSchema = new mongoose.Schema({
  nombre: String,
  fecha: String,
  dificultad: String,
  guia: String, // nombre del guía
  guiaId: String,
  reservadoPor: String // idReserva si fue reservada
});

module.exports = mongoose.model('Excursion', ExcursionSchema);
