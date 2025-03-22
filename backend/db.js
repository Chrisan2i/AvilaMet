const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://christiansanchez:V7juIzIPPPRPGbCk@avilametcluster.ggjnh.mongodb.net/AvilaMet');
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  }
};

module.exports = connectDB;