import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getDisciplinas, createDisciplina } from "../controllers/disciplinasController.js";


const router = express.Router();

router.get("/", authMiddleware, getDisciplinas);
router.post("/", authMiddleware, createDisciplina);

export default router;
