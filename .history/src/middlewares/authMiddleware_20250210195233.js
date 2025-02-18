import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar o token no header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido. Faça login." });
    }

    // Decodificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Armazena o ID do usuário no objeto req

    // Buscar usuário no banco de dados
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado. Token inválido." });
    }

    // Armazena dados relevantes do usuário no objeto req
    req.userRole = user.role;
    req.userName = user.name;
    req.userDisciplina = user.disciplina;

    next(); // Passa para o próximo middleware
  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};


// Middleware para validar a role do usuário
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Acesso negado. Role não autorizada." });
    }
    next();
  };
};

export { authMiddleware, roleMiddleware };
