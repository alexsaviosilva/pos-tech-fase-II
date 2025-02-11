import User from "../models/User.js";
import bcrypt from "bcryptjs";

class ProfessoresController {
  /**
   * Lista todos os professores cadastrados
   */
  static async listarProfessores(req, res) {
    try {
      console.log("📄 Buscando todos os professores...");
      const listaProfessores = await User.find({ role: "professor" }).select("-password");

      if (listaProfessores.length === 0) {
        return res.status(200).json({ message: "Nenhum professor encontrado." });
      }

      res.status(200).json(listaProfessores);
    } catch (erro) {
      console.error("🚨 Erro ao listar professores:", erro);
      res.status(500).json({ message: `Erro ao listar professores: ${erro.message}` });
    }
  }

  /**
   * Busca um professor por ID
   */
  static async listarProfessorPorId(req, res) {
    try {
      const id = req.params.id;
      console.log(`🔍 Buscando professor com ID: ${id}`);

      const professorEncontrado = await User.findById(id).select("-password");

      if (!professorEncontrado || professorEncontrado.role !== "professor") {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      res.status(200).json(professorEncontrado);
    } catch (erro) {
      console.error("🚨 Erro ao buscar professor:", erro);
      res.status(500).json({ message: `Erro ao buscar professor: ${erro.message}` });
    }
  }

  /**
   * Cadastra um novo professor
   */
  static async cadastrarProfessor(req, res) {
    try {
      let { name, email, password, role, disciplina } = req.body;

      if (!name || !email || !password || role !== "professor" || !disciplina) {
        return res.status(400).json({ message: "Campos obrigatórios não preenchidos ou role incorreto." });
      }

      email = email.trim().toLowerCase();

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Professor já cadastrado." });
      }

      console.log("🔒 Hashing senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      const novoProfessor = new User({ name, email, password: hashedPassword, role, disciplina });
      const professorCriado = await novoProfessor.save();

      res.status(201).json({ message: "Professor cadastrado com sucesso!", professor: professorCriado });
    } catch (erro) {
      console.error("🚨 Erro ao cadastrar professor:", erro);
      res.status(500).json({ message: `Erro ao cadastrar professor: ${erro.message}` });
    }
  }

  /**
   * Atualiza um professor existente
   */
  static async atualizarProfessor(req, res) {
    try {
      const id = req.params.id;
      let { name, email, password, disciplina } = req.body;

      console.log(`🔄 Atualizando professor ID: ${id}`);

      const professorEncontrado = await User.findById(id);
      if (!professorEncontrado || professorEncontrado.role !== "professor") {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      let updateData = { name, email, disciplina };
      if (password) {
        console.log("🔒 Atualizando senha...");
        updateData.password = await bcrypt.hash(password, 10);
      }

      const professorAtualizado = await User.findByIdAndUpdate(id, updateData, { new: true });

      res.status(200).json({ message: "Professor atualizado com sucesso!", professor: professorAtualizado });
    } catch (erro) {
      console.error("🚨 Erro ao atualizar professor:", erro);
      res.status(500).json({ message: `Erro ao atualizar professor: ${erro.message}` });
    }
  }

  /**
   * Exclui um professor por ID
   */
  static async excluirProfessor(req, res) {
    try {
      const id = req.params.id;
      console.log(`🗑️ Excluindo professor ID: ${id}`);

      const professorExcluido = await User.findByIdAndDelete(id);

      if (!professorExcluido || professorExcluido.role !== "professor") {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      res.status(200).json({ message: "Professor excluído com sucesso!" });
    } catch (erro) {
      console.error("🚨 Erro ao excluir professor:", erro);
      res.status(500).json({ message: `Erro ao excluir professor: ${erro.message}` });
    }
  }
}

export default ProfessoresController;
