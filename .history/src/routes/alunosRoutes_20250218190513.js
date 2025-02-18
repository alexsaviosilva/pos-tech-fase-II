import express from "express";
import { cadastrarAluno } from "../controllers/AlunoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Rota para cadastrar aluno
router.post("/", authMiddleware, cadastrarAluno);

// 🔹 Rota para listar todos os alunos (opcional, útil para debug)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const alunos = await User.find({ role: "aluno" }).select("-password"); // 🔒 Não retorna a senha
    res.status(200).json(alunos);
  } catch (error) {
    console.error("❌ Erro ao buscar alunos:", error);
    res.status(500).json({ message: "Erro ao buscar alunos." });
  }
});

export default router;
