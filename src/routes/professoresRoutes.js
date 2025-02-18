import express from "express";
import ProfessoresController from "../controllers/professoresController.js";

const router = express.Router();

const logRequest = (req, res, next) => {
  console.log(`📌 Acessando: ${req.method} ${req.originalUrl}`);
  next();
};

router.get("/", logRequest, ProfessoresController.listarProfessores);
router.get("/:id", logRequest, ProfessoresController.listarProfessorPorId);
router.post("/", logRequest, ProfessoresController.cadastrarProfessor);
router.put("/:id", logRequest, ProfessoresController.atualizarProfessor);
router.delete("/:id", logRequest, ProfessoresController.excluirProfessor);

export default router;
