const mongoose = require('mongoose');

const ExcursionSchema = new mongoose.Schema({
  nombre: String,
  fecha: String,
  dificultad: String,
  guia: String,
  guiaId: String,
  reservadoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxPersonas: Number 
});


module.exports = mongoose.model('Excursion', ExcursionSchema);
