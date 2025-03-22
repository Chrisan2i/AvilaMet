const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  ranking: Number,
  km: Number,
  dificultad: String,
  tiempo: String,
  fotos: [String]
});

module.exports = mongoose.model('Destination', DestinationSchema);
