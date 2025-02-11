import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const AuthController = {

  async register(req, res) {
    let { name, email, password, role, disciplina } = req.body;

    try {
      console.log("📌 Recebendo requisição para registro:", { email, role });

     
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

     
      email = email.trim().toLowerCase();

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Usuário já cadastrado" });
      }

      console.log("🔒 Gerando hash da senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ name, email, password: hashedPassword, role, disciplina });
      await user.save();

      console.log("✅ Usuário registrado com sucesso!");
      res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
      console.error("🚨 Erro no registro:", error);
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

 
  async login(req, res) {
    let { email, password } = req.body;

    try {
      console.log("📌 Tentando login com:", email);

      email = email.trim().toLowerCase();

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
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
      console.error("🚨 Erro no login:", error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  },

 
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
