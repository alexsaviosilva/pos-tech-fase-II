import User from "../models/User.js";
import bcrypt from "bcryptjs";

class ProfessoresController {
  // 🔍 Listar todos os professores
  static async listarProfessores(req, res) {
    try {
      console.log("📄 Buscando todos os professores...");
      const listaProfessores = await User.find({ role: "professor" }).select("-password");

      if (!listaProfessores.length) {
        return res.status(200).json({ message: "Nenhum professor encontrado." });
      }

      res.status(200).json(listaProfessores);
    } catch (erro) {
      console.error("🚨 Erro ao listar professores:", erro);
      res.status(500).json({ message: "Erro ao listar professores." });
    }
  }

  // 🔍 Listar um professor por ID
  static async listarProfessorPorId(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔍 Buscando professor com ID: ${id}`);

      const professor = await User.findById(id).select("-password");

      if (!professor || professor.role !== "professor") {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      res.status(200).json(professor);
    } catch (erro) {
      console.error("🚨 Erro ao buscar professor:", erro);
      res.status(500).json({ message: "Erro ao buscar professor." });
    }
  }

  // 🆕 Cadastrar um novo professor
  static async cadastrarProfessor(req, res) {
    try {
      let { name, email, password, role, disciplina } = req.body;

      if (!name || !email || !password || !disciplina) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      if (role !== "professor") {
        return res.status(403).json({ message: "Role inválida. Apenas professores podem ser cadastrados." });
      }

      email = email.trim().toLowerCase();

      // 🔎 Verifica se o professor já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      console.log("🔒 Hashing senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🆕 Criando o professor
      const novoProfessor = new User({ name, email, password: hashedPassword, role, disciplina });
      await novoProfessor.save();

      res.status(201).json({ message: "Professor cadastrado com sucesso!", professor: novoProfessor });
    } catch (erro) {
      console.error("🚨 Erro ao cadastrar professor:", erro);
      res.status(500).json({ message: "Erro ao cadastrar professor." });
    }
  }

  // 🔄 Atualizar dados de um professor
  static async atualizarProfessor(req, res) {
    try {
      const { id } = req.params;
      let { name, email, password, disciplina } = req.body;

      console.log(`🔄 Atualizando professor ID: ${id}`);

      const professor = await User.findById(id);
      if (!professor || professor.role !== "professor") {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      let updateData = { name, email, disciplina };
      if (password) {
        conso
