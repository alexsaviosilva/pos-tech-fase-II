import jwt from "jsonwebtoken";
import User from "../models/User.js";

const AuthController = {
  // Registro de novo usuário
  async register(req, res) {
    const { name, email, password, role, disciplina } = req.body;

    try {
      // Verifica se o usuário já existe pelo email
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Usuário já cadastrado" });
      }

      // Cria um novo usuário
      const user = new User({ name, email, password, role, disciplina });
      await user.save();

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
      console.error("Erro no registro:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  // Login de usuário
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Verifica se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Verifica se a senha está correta
      const isValid = await user.isValidPassword(password);
      if (!isValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expira em 1 dia
      );

      // Retorna o token e os dados do usuário
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
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  // Método opcional para validar token (para endpoints protegidos)
  async validateToken(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho Authorization
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token
      res.status(200).json({ message: "Token válido", decoded });
    } catch (error) {
      console.error("Token inválido:", error);
      res.status(401).json({ message: "Token inválido" });
    }
  },
};

export default AuthController;
