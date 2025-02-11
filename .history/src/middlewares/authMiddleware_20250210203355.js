import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido. Faça login." });
    }

    // Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "seuSegredoJWT");
    req.userId = decoded.id;

    // Busca o usuário no banco de dados
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado. Token inválido." });
    }

    // Adiciona os dados do usuário na requisição
    req.userRole = user.role;
    req.userName = user.name;
    req.userDisciplina = user.disciplina;

    next();
  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

// Middleware de autorização baseado em roles
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Acesso negado. Role não autorizada." });
    }
    next();
  };
};

// Exportação correta
export { authMiddleware, roleMiddleware };
