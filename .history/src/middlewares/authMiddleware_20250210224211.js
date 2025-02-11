import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido. Faça login." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "seuSegredoJWT");
    req.userId = decoded.id;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado. Token inválido." });
    }

    req.userRole = user.role;
    req.userName = user.name;
    req.userDisciplina = user.disciplina;

    next();
  } catch (error) {
    console.error("🚨 Erro na autenticação:", error.message);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Acesso negado. Apenas usuários com as seguintes permissões podem acessar: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

export { authMiddleware, roleMiddleware };
