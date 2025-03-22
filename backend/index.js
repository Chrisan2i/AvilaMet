const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // Importa la función connectDB
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// Conecta a la base de datos
connectDB(); // Llama a la función connectDB

app.use(cors());
app.use(express.json());

app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/excursions', require('./routes/excursionRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send('El backend está funcionando correctamente');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});