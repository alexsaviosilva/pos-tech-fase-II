import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const AuthController = {
  // 📌 Registrar usuário
  async register(req, res) {
    try {
      let { name, email, password, role, disciplina } = req.body;

      console.log("📌 Recebendo requisição para registro:", { email, role });

      if (!name || !email || !password || !role) {
        console.log("⚠️ Dados incompletos no registro.");
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      email = email.trim().toLowerCase();

      // 🔍 Verifica se o usuário já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log("⚠️ Usuário já cadastrado:", email);
        return res.status(400).json({ message: "Usuário já cadastrado." });
      }

      // 🔒 Gera o hash da senha antes de salvar
      console.log("🔒 Gerando hash da senha...");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("🔑 Hash gerado antes de salvar:", hashedPassword);

      // 🔹 Cria o novo usuário com a senha hash
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

  // 📌 Login do usuário
  async login(req, res) {
    try {
      let { email, password, role } = req.body;

      console.log("📌 Tentando login com:", email, "Role:", role);

      if (!email || !password) {
        console.log("⚠️ Campos vazios no login.");
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
      }

      email = email.trim().toLowerCase();

      // 🔍 Buscar usuário no banco incluindo a senha
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        console.log("⚠️ Usuário não encontrado:", email);
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      console.log("🔍 Usuário encontrado:", {
        email: user.email,
        role: user.role,
        hashSalvo: user.password, 
      });

      // 🔑 Comparação da senha digitada com a armazenada
      console.log("🔒 Senha digitada pelo usuário:", password);
      console.log("🔑 Hash armazenado no banco:", user.password);

      const isValid = await bcrypt.compare(password, user.password);

      console.log("🔍 Resultado da comparação:", isValid ? "✅ Senha correta" : "❌ Senha incorreta");

      if (!isValid) {
        console.log("❌ Erro: Senha incorreta para o usuário", email);
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // 🔹 Verifica se a role está correta
      if (role && user.role !== role) {
        console.log("⚠️ Role incorreta:", { roleDigitada: role, roleCadastrada: user.role });
        return res.status(403).json({ message: "Tipo de usuário incorreto!" });
      }

      if (!process.env.JWT_SECRET) {
        console.error("🚨 Erro: JWT_SECRET não definido nas variáveis de ambiente.");
        return res.status(500).json({ message: "Erro interno no servidor." });
      }

      // 🔑 Gerar token JWT
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

  // 📌 Validação do Token
  async validateToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        console.log("⚠️ Token não fornecido.");
        return res.status(401).json({ message: "Token não fornecido. Faça login." });
      }

      if (!process.env.JWT_SECRET) {
        console.error("🚨 Erro: JWT_SECRET não definido nas variáveis de ambiente.");
        return res.status(500).json({ message: "Erro interno no servidor." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Token válido:", decoded);
      res.status(200).json({ message: "Token válido", decoded });
    } catch (error) {
      console.error("🚨 Token inválido:", error);
      res.status(401).json({ message: "Token inválido ou expirado." });
    }
  },
};

export default AuthController;