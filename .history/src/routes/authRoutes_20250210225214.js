import express from "express";
import AuthController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * 📌 Rota para registrar um novo usuário.
 * ✅ Endpoint: POST /auth/register
 */
router.post("/register", (req, res, next) => {
    console.log(`📝 Recebendo requisição de registro para: ${req.body.email}`);
    next();
}, AuthController.register);

/**
 * 📌 Rota para login do usuário.
 * ✅ Endpoint: POST /auth/login
 */
router.post("/login", (req, res, next) => {
    console.log(`🔐 Tentativa de login para: ${req.body.email}`);
    next();
}, AuthController.login);

/**
 * 📌 Rota para validar um token JWT.
 * ✅ Endpoint: GET /auth/validateToken
 * 🔒 Protegida: Requer um token JWT no cabeçalho Authorization
 */
router.get("/validateToken", authMiddleware, AuthController.validateToken);

export default router;
