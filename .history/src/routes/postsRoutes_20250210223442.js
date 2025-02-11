import express from "express";
import PostController from "../controllers/postController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const routes = express.Router();

/**
 * Middleware de debug para tokens de autenticação
 */
const debugAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🛡️ Cabeçalho Authorization recebido:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido. Faça login novamente." });
  }
  next();
};

// Middleware global para verificar autenticação e permissões
const authProfessorMiddleware = [authMiddleware, roleMiddleware(["professor"]), debugAuthMiddleware];

/**
 * Rotas relacionadas às publicações (posts)
 */

// ✅ Rota para filtrar posts pelo _id do autor
routes.get("/publicacoes/autor/:autorId", (req, res, next) => {
  console.log(`🔍 Solicitando publicações do autor com ID: ${req.params.autorId}`);
  next();
}, PostController.listarPostsPorAutor);

// ✅ Rota para listar todas as publicações
routes.get("/publicacoes", (req, res, next) => {
  console.log("🔍 Solicitando lista de publicações...");
  next();
}, PostController.listarPost);

// ✅ Rota para buscar um post específico por ID
routes.get("/publicacoes/:id", (req, res, next) => {
  console.log(`🔍 Solicitando publicação com ID: ${req.params.id}`);
  next();
}, PostController.listarPostPorId);

// ✅ Criar uma nova publicação (apenas professores podem criar)
routes.post("/publicacoes", authProfessorMiddleware, (req, res, next) => {
  console.log("📝 Tentativa de criação de publicação. Dados recebidos:", req.body);
  next();
}, PostController.cadastrarPost);

// ✅ Atualizar uma publicação (apenas professores podem editar)
routes.put("/publicacoes/:id", authProfessorMiddleware, (req, res, next) => {
  console.log(`🔄 Tentativa de atualização da publicação com ID: ${req.params.id}`);
  next();
}, PostController.atualizarPost);

// ✅ Excluir uma publicação (apenas professores podem excluir)
routes.delete("/publicacoes/:id", authProfessorMiddleware, (req, res, next) => {
  console.log(`🗑️ Tentativa de exclusão da publicação com ID: ${req.params.id}`);
  next();
}, PostController.excluirPost);

export default routes;
