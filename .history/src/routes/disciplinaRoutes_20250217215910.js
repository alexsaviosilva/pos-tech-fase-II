const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getDisciplinas, createDisciplina } = require("../controllers/disciplinasController");

// Rota para listar disciplinas
router.get("/", authMiddleware, getDisciplinas);

// Rota para criar uma nova disciplina
router.post("/", authMiddleware, createDisciplina);

module.exports = router;
