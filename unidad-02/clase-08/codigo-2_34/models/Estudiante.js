const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  carrera: { type: String, required: true }
});

module.exports = mongoose.model('Estudiante', estudianteSchema);
