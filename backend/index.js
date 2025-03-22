const express = require("express");
const connectDB = require("./db");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();
connectDB();

app.use(express.json());

app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/excursions', require('./routes/excursionRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
