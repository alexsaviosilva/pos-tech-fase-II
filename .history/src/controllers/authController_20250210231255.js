import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const AuthController = {
  /**
   * Registrar um novo usuário
   */
  async register(req, res) {
    let { name, email, password, role, disciplina } = req.body;

    try {
      console.log("📌 Recebendo requisição para registro:", { email, role });

      // Validação básica de campos obrigatórios
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      // Formatação do e-mail
      email = email.trim().toLowerCase();

      // Verifica se o usuário já existe no banco de dados
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Usuário já cadastrado" });
      }

      console.log("🔒 Gerando hash da senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criando novo usuário
      const user = new User({ name, email, password: hashedPassword, role, disciplina });
      await user.save();

      console.log("✅ Usuário registrado com sucesso!");
      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("🚨 Erro no registro:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  /**
   * Login de usuário
   */
  async login(req, res) {
    let { email, password, role } = req.body;

    try {
      console.log("📌 Tentando login com:", email, "Role:", role);

      // Normalização do e-mail
      email = email.trim().toLowerCase();

      // Busca usuário pelo e-mail
      const user = await User.findOne({ email });
      if (!user) {
        console.log("⚠️ Usuário não encontrado:", email);
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Comparação de senha com bcrypt
      console.log("🔍 Comparando senha...");
      const isValid = await bcrypt.compare(password, user.password);
      console.log("🔑 Resultado da comparação:", isValid ? "Senha correta" : "Senha incorreta");

      if (!isValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Verifica se a role informada corresponde ao usuário encontrado
      if (role && user.role !== role) {
        return res.status(403).json({ message: "Tipo de usuário incorreto!" });
      }

      // Verifica se a variável de ambiente está definida
      if (!process.env.JWT_SECRET) {
        console.error("🚨 Erro: JWT_SECRET não definido nas variáveis de ambiente.");
        return res.status(500).json({ message: "Erro interno no servidor" });
      }

      // Gera um token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("✅ Login bem-sucedido!");
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

  /**
   * Validação do Token JWT
   */
  async validateToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido. Faça login." });
      }

      if (!process.env.JWT_SECRET) {
        console.error("🚨 Erro: JWT_SECRET não definido nas variáveis de ambiente.");
        return res.status(500).json({ message: "Erro interno no servidor" });
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
