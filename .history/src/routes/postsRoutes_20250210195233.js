import express from "express";
import PostController from "../controllers/postController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js";

const routes = express.Router();

/**
 * Middleware para debug do Token de Autenticação
 * Mostra o cabeçalho Authorization recebido
 */
const debugAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🛡️ Cabeçalho Authorization recebido:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido. Faça login novamente." });
  }
  next();
};

/**
 * Rotas relacionadas às publicações (posts)
 */

// Rota para filtrar posts pelo _id do autor
routes.get(
  "/publicacoes/autor/:autorId",
  async (req, res, next) => {
    console.log(`🔍 Solicitando publicações do autor com ID: ${req.params.autorId}`);
    next();
  },
  PostController.listarPostsPorAutor
);

routes.get(
  "/publicacoes",
  async (req, res, next) => {
    console.log("🔍 Solicitando lista de publicações...");
    next();
  },
  PostController.listarPost
);

routes.get(
  "/publicacoes/:id",
  async (req, res, next) => {
    console.log(`🔍 Solicitando publicação com ID: ${req.params.id}`);
    next();
  },
  PostController.listarPostPorId
);

routes.post(
  "/publicacoes",
  authMiddleware,
  roleMiddleware(["professor"]),
  debugAuthMiddleware,
  async (req, res, next) => {
    console.log("📝 Tentativa de criação de publicação. Dados recebidos:", req.body);
    next();
  },
  PostController.cadastrarPost
);

routes.put(
  "/publicacoes/:id",
  authMiddleware,
  roleMiddleware(["professor"]),
  debugAuthMiddleware,
  async (req, res, next) => {
    console.log(`🔄 Tentativa de atualização da publicação com ID: ${req.params.id}`);
    next();
  },
  PostController.atualizarPost
);

routes.delete(
  "/publicacoes/:id",
  authMiddleware,
  roleMiddleware(["professor"]),
  debugAuthMiddleware,
  async (req, res, next) => {
    console.log(`🗑️ Tentativa de exclusão da publicação com ID: ${req.params.id}`);
    next();
  },
  PostController.excluirPost
);

export default routes;
