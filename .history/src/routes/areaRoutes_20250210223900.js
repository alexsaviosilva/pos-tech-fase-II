import express from "express";
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/professor-area', authMiddleware, roleMiddleware(['professor']), (req, res) => {
    console.log(`👨‍🏫 Acesso à área do professor por: ${req.userName}`);

    if (!req.userName || !req.userDisciplina) {
        return res.status(400).json({ message: "Erro ao recuperar dados do usuário" });
    }

    res.json({ 
        message: `Bem-vindo, ${req.userName}`, 
        disciplina: req.userDisciplina 
    });
});

router.get('/aluno-area', authMiddleware, roleMiddleware(['aluno']), (req, res) => {
    console.log(`🎓 Acesso à área do aluno por: ${req.userName}`);

    if (!req.userName) {
        return res.status(400).json({ message: "Erro ao recuperar dados do usuário" });
    }

    res.json({ message: `Bem-vindo, ${req.userName}` });
});


router.get('/geral', authMiddleware, (req, res) => {
    console.log(`🔓 Acesso à área geral por: ${req.userName}`);

    if (!req.userName) {
        return res.status(400).json({ message: "Erro ao recuperar dados do usuário" });
    }

    res.json({ message: `Bem-vindo, ${req.userName}` });
});

export default router;
