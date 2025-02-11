import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

/**
 * Rota para registrar um novo usuário.
 * Endpoint: /auth/register
 */
router.post("/register", AuthController.register);

/**
 * Rota para login do usuário.
 * Endpoint: /auth/login
 */
router.post("/login", AuthController.login);

export default router;
