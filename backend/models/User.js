const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	nombre: String,
	apellido: String,
	email: String,
	telefono: String,
	nombre_usuario: String,
	contraseña: String,
	rol: { type: String, default: "Excursionista" },
	fecha_creacion: Date,
	fotoPerfil: String,
	
	idiomas: {
	  type: [String],
	  required: function () {
		return this.rol === "Guía";
	  }
	},
  
	años_experiencia: {
	  type: Number,
	  required: function () {
		return this.rol === "Guía";
	  }
	}
  });
  

// 👇 ESTA LÍNEA ES CLAVE
module.exports = mongoose.model("User", userSchema); // ✅ usa colección "users"
