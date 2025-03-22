const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://christiansanchez:V7juIzIPPPRPGbCk@avilametcluster.ggjnh.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch((err) => console.error('❌ Error de conexión:', err));
