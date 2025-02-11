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

      // Valida se todos os campos necessários foram enviados
      if (!name || !email || !password || !role) {
        console.log("⚠️ Campos obrigatórios faltando!");
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      // Remove espaços e converte email para minúsculas
      email = email.trim().toLowerCase();

      // Verifica se o usuário já existe pelo email
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log("⚠️ Usuário já existe:", email);
        return res.status(400).json({ message: "Usuário já cadastrado" });
      }

      // Criptografa a senha antes de salvar
      console.log("🔒 Criptografando senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criando novo usuário
      console.log("✅ Criando novo usuário...");
      const user = new User({
        name,
        email,
        password: hashedPassword, // Salva a senha criptografada
        role,
        disciplina,
      });

      await user.save();
      console.log("🎉 Usuário salvo com sucesso!");

      res.status(201).json({
        message: "Usuário registrado com sucesso",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  /**
   * Login de usuário
   */
  async login(req, res) {
    let { email, password } = req.body;

    try {
      console.log("📌 Tentando login com:", email);

      // Valida se os campos foram enviados
      if (!email || !password) {
        console.log("⚠️ Campos obrigatórios faltando!");
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      // Remove espaços e converte email para minúsculas antes de buscar no banco
      email = email.trim().toLowerCase();

      // Verifica se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        console.log("⚠️ Usuário não encontrado:", email);
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      console.log("🔍 Comparando senha...");
      const isValid = await bcrypt.compare(password, user.password);
      console.log("🔑 Resultado da comparação:", isValid ? "Senha correta" : "Senha incorreta");

      if (!isValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "seuSegredoJWT",
        { expiresIn: "1d" } // Token expira em 1 dia
      );

      console.log("✅ Login bem-sucedido!");

      res.status(200).json({
        message: "Login bem-sucedido",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("❌ Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  /**
   * Validar Token JWT (para proteger rotas)
   */
  async validateToken(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "seuSegredoJWT"); // Decodifica o token
      res.status(200).json({ message: "Token válido", decoded });
    } catch (error) {
      console.error("❌ Token inválido:", error);
      res.status(401).json({ message: "Token inválido" });
    }
  },
};

export default AuthController;
