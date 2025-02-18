import express from "express";
import PostController from "../controllers/postController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const routes = express.Router();


const debugAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🛡️ Cabeçalho Authorization recebido:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido. Faça login novamente." });
  }
  next();
};

const authProfessorMiddleware = [authMiddleware, roleMiddleware(["professor"]), debugAuthMiddleware];



routes.get("/publicacoes/autor/:autorId", (req, res, next) => {
  console.log(`🔍 Solicitando publicações do autor com ID: ${req.params.autorId}`);
  next();
}, PostController.listarPostsPorAutor);

routes.get("/publicacoes", (req, res, next) => {
  console.log("🔍 Solicitando lista de publicações...");
  next();
}, PostController.listarPost);

routes.get("/publicacoes/:id", (req, res, next) => {
  console.log(`🔍 Solicitando publicação com ID: ${req.params.id}`);
  next();
}, PostController.listarPostPorId);

routes.post("/publicacoes", authProfessorMiddleware, (req, res, next) => {
  console.log("📝 Tentativa de criação de publicação. Dados recebidos:", req.body);
  next();
}, PostController.cadastrarPost);

routes.put("/publicacoes/:id", authProfessorMiddleware, (req, res, next) => {
  console.log(`🔄 Tentativa de atualização da publicação com ID: ${req.params.id}`);
  next();
}, PostController.atualizarPost);

routes.delete("/publicacoes/:id", authProfessorMiddleware, (req, res, next) => {
  console.log(`🗑️ Tentativa de exclusão da publicação com ID: ${req.params.id}`);
  next();
}, PostController.excluirPost);

export default routes;
