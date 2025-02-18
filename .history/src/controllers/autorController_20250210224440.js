import User from "../models/User.js";
import bcrypt from "bcryptjs";

class AutorController {
  static async listarAutores(req, res) {
    try {
      console.log("📄 Buscando todos os autores...");
      const listaAutores = await User.find({ role: "professor" }).select("-password");

      if (listaAutores.length === 0) {
        return res.status(200).json({ message: "Nenhum autor encontrado." });
      }

      res.status(200).json(listaAutores);
    } catch (erro) {
      console.error("🚨 Erro ao listar autores:", erro);
      res.status(500).json({ message: `Erro ao listar autores: ${erro.message}` });
    }
  }

  static async listarAutorPorId(req, res) {
    try {
      const id = req.params.id;
      console.log(`🔍 Buscando autor com ID: ${id}`);

      const autorEncontrado = await User.findById(id).select("-password");

      if (!autorEncontrado || autorEncontrado.role !== "professor") {
        return res.status(404).json({ message: "Autor não encontrado ou não é um professor." });
      }

      res.status(200).json(autorEncontrado);
    } catch (erro) {
      console.error("🚨 Erro ao buscar autor:", erro);
      res.status(500).json({ message: `Erro ao buscar autor: ${erro.message}` });
    }
  }

  static async cadastrarAutor(req, res) {
    try {
      let { name, email, password, role, disciplina } = req.body;

      if (!name || !email || !password || role !== "professor" || !disciplina) {
        return res.status(400).json({ message: "Campos obrigatórios não preenchidos ou role incorreto." });
      }

      email = email.trim().toLowerCase();

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Usuário já cadastrado" });
      }

      console.log("🔒 Hashing senha...");
      const hashedPassword = await bcrypt.hash(password, 10);

      const novoAutor = new User({ name, email, password: hashedPassword, role, disciplina });
      const autorCriado = await novoAutor.save();

      res.status(201).json({ message: "Autor criado com sucesso!", autor: autorCriado });
    } catch (erro) {
      console.error("🚨 Erro ao cadastrar autor:", erro);
      res.status(500).json({ message: `Erro ao cadastrar autor: ${erro.message}` });
    }
  }

  static async atualizarAutor(req, res) {
    try {
      const id = req.params.id;
      let { name, email, password, disciplina } = req.body;

      console.log(`🔄 Atualizando autor ID: ${id}`);

      const autorEncontrado = await User.findById(id);
      if (!autorEncontrado || autorEncontrado.role !== "professor") {
        return res.status(404).json({ message: "Autor não encontrado ou não é um professor." });
      }

      let updateData = { name, email, disciplina };
      if (password) {
        console.log("🔒 Atualizando senha...");
        updateData.password = await bcrypt.hash(password, 10);
      }

      const autorAtualizado = await User.findByIdAndUpdate(id, updateData, { new: true });

      res.status(200).json({ message: "Autor atualizado com sucesso!", autor: autorAtualizado });
    } catch (erro) {
      console.error("🚨 Erro ao atualizar autor:", erro);
      res.status(500).json({ message: `Erro ao atualizar autor: ${erro.message}` });
    }
  }

  static async excluirAutor(req, res) {
    try {
      const id = req.params.id;
      console.log(`🗑️ Excluindo autor ID: ${id}`);

      const autorExcluido = await User.findByIdAndDelete(id);

      if (!autorExcluido || autorExcluido.role !== "professor") {
        return res.status(404).json({ message: "Autor não encontrado ou não é um professor." });
      }

      res.status(200).json({ message: "Autor excluído com sucesso!" });
    } catch (erro) {
      console.error("🚨 Erro ao excluir autor:", erro);
      res.status(500).json({ message: `Erro ao excluir autor: ${erro.message}` });
    }
  }
}

export default AutorController;
