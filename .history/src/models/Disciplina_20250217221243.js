import mongoose from "mongoose";

const DisciplinaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  codigo: { type: String, required: true, unique: true, trim: true },
  cargaHoraria: { type: Number, required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Disciplina = mongoose.model("Disciplina", DisciplinaSchema);

export default Disciplina; // Agora usando export default para ES Modules
