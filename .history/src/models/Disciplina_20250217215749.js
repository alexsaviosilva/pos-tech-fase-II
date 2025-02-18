const mongoose = require("mongoose");

const DisciplinaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  cargaHoraria: {
    type: Number,
    required: true,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Disciplina", DisciplinaSchema);
