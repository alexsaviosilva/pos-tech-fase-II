import express from "express";
import AuthController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


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

export default router;
