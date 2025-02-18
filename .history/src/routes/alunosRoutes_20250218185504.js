import express from "express";
import User from "../models/User.js"; 
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const novoAluno = new User({
      name,
      email,
      password,
      role: "aluno",
      disciplina: null, // 🔹 Garante que alunos sempre tenham disciplina = null
    });

    await novoAluno.save();
    res.status(201).json({ message: "Aluno cadastrado com sucesso!", aluno: novoAluno });
  } catch (error) {
    console.error("❌ Erro ao cadastrar aluno:", error);
    res.status(500).json({ message: "Erro ao cadastrar aluno." });
  }
});

export default router;
