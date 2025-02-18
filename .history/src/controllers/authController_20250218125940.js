import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
  }
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const AuthController = {
  // 📌 Registrar usuário
  async register(req, res) {
    try {
      const { name, email, password, role, disciplina } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // 🔍 Verifica se o usuário já existe
      if (await User.findOne({ email: normalizedEmail })) {
        return res.status(400).json({ message: "Usuário já cadastrado." });
      }

      // 🔒 Gera o hash da senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔹 Cria o novo usuário com a senha hash
      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        disciplina,
      });

      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("🚨 Erro no registro:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  // 📌 Login do usuário
  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail }).select("+password");

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      if (role && user.role !== role) {
        return res.status(403).json({ message: "Tipo de usuário incorreto!" });
      }

      const token = generateToken(user._id, user.role);
      res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("🚨 Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  },

  // 📌 Validação do Token
  async validateToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Token não fornecido. Faça login." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ message: "Token válido", decoded });
    } catch (error) {
      console.error("🚨 Token inválido:", error);
      res.status(401).json({ message: "Token inválido ou expirado." });
    }
  },
};

export default AuthController;
