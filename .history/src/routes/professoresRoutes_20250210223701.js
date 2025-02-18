import express from "express";
import AutorController from "../controllers/autorController.js";

const router = express.Router();


const logRequest = (req, res, next) => {
  console.log(`📌 Acessando: ${req.method} ${req.originalUrl}`);
  next();
};


router.get("/", logRequest, AutorController.listarAutores);
router.get("/:id", logRequest, AutorController.listarAutorPorId);
router.post("/", logRequest, AutorController.cadastrarAutor);
router.put("/:id", logRequest, AutorController.atualizarAutor);
router.delete("/:id", logRequest, AutorController.excluirAutor);

export default router;
