const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  nombre_usuario: String,
  contraseña: String,
  rol: String, // "Excursionista" o "Guía" o "Admin"
  años_experiencia: Number,
  idiomas: [String],
  fecha_creacion: String,
  fotoPerfil: String // opcional
});

module.exports = mongoose.model('User', UserSchema);
