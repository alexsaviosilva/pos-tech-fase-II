const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Modelo de disciplina (ajuste conforme seu banco de dados)
const Disciplina = require("../models/Disciplina");

// Rota para buscar todas as disciplinas
router.get("/", authMiddleware, async (req, res) => {
  try {
    const disciplinas = await Disciplina.find();
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar disciplinas." });
  }
});

module.exports = router;
