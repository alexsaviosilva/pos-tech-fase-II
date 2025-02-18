import express from "express";
import { getDisciplinas, createDisciplina } from "../controllers/disciplinasController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDisciplinas);
router.post("/", authMiddleware, createDisciplina);

export default router;
