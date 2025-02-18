import express from "express";
import AuthController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/register", (req, res, next) => {
    console.log("📝 Recebendo requisição de registro:", req.body);
    next();
}, AuthController.register);


router.post("/login", (req, res, next) => {
    console.log("🔐 Recebendo tentativa de login:", req.body.email);
    next();
}, AuthController.login);


router.get("/validateToken", authMiddleware, (req, res, next) => {
    console.log("🔍 Validando token...");
    next();
}, AuthController.validateToken);

export default router;
