import express from "express";
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/professor-area', authMiddleware, roleMiddleware(['professor']), (req, res) => {
    res.json({ 
        message: `Bem-vindo, ${req.userName}`, 
        disciplina: req.userDisciplina 
    });
});

router.get('/aluno-area', authMiddleware, roleMiddleware(['aluno']), (req, res) => {
    res.json({ message: `Bem-vindo, ${req.userName}` });
});

router.get('/geral', authMiddleware, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.userName}` });
});

export default router;
