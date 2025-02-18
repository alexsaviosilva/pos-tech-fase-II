import User from "../models/User.js";
import bcrypt from "bcryptjs";

class ProfessoresController {
  // 🆕 Cadastrar um novo professor
  static async cadastrarProfessor(req, res) {
    try {
      let { name, email, password, disciplina } = req.body;

      if (!name || !email || !password || !disciplina) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      email = email.trim().toLowerCase();

      // 🔎 Verifica se o professor já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      console.log("🔒 Hashing senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criando o professor com `role: "professor"`
      const novoProfessor = new User({
        name,
        email,
        password: hashedPassword,
        role: "professor", // 🔥 Garantindo que a role seja "professor"
        disciplina
      });

      await novoProfessor.save();

      return res.status(201).json({
        message: "Professor cadastrado com sucesso!",
        professor: novoProfessor
      });
    } catch (erro) {
      console.error("🚨 Erro ao cadastrar professor:", erro);
      return res.status(500).json({ message: "Erro ao cadastrar professor." });
    }
  }
}

export default ProfessoresController;
