import express from "express";
import AuthController from "../controllers/authController.js";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware.js"; // Importando os middlewares

const router = express.Router();

/**
 * Rota para registrar um novo usuário.
 * Endpoint: POST /auth/register
 */
router.post("/register", AuthController.register);

/**
 * Rota para login do usuário.
 * Endpoint: POST /auth/login
 */
router.post("/login", AuthController.login);

/**
 * Rota para validar um token JWT.
 * Endpoint: GET /auth/validateToken
 * Protegida: Requer um token JWT no cabeçalho Authorization
 */
router.get("/validateToken", authMiddleware, AuthController.validateToken);

/**
 * Rota para obter informações do usuário autenticado.
 * Endpoint: GET /auth/me
 * Protegida: Requer um token JWT no cabeçalho Authorization
 */
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.userId,
    name: req.userName,
    email: req.userEmail,
    role: req.userRole,
    disciplina: req.userDisciplina || "Nenhuma",
  });
});

/**
 * Rota para listar todos os usuários (Apenas Admins podem acessar).
 * Endpoint: GET /auth/users
 */
router.get("/users", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Retira a senha do retorno
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

export default router;
