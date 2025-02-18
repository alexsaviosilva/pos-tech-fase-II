const Disciplina = require("../models/Disciplina");

// Buscar todas as disciplinas
exports.getDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().populate("professor", "name email");
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar disciplinas." });
  }
};

// Criar uma nova disciplina
exports.createDisciplina = async (req, res) => {
  try {
    const { name, codigo, cargaHoraria, professor } = req.body;

    if (!name || !codigo || !cargaHoraria || !professor) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const disciplina = new Disciplina({ name, codigo, cargaHoraria, professor });
    await disciplina.save();

    res.status(201).json(disciplina);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar disciplina." });
  }
};
