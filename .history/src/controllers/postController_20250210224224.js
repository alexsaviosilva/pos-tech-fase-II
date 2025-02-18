import Post from "../models/Post.js";
import User from "../models/User.js";

class PostController {
  // Método para listar posts de um autor específico
  static async listarPostsPorAutor(req, res) {
    try {
      const autorId = req.params.autorId;
      console.log(`🔍 Buscando publicações do autor ${autorId}...`);

      const posts = await Post.find({ autor: autorId }).populate("autor", "name disciplina");

      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "Nenhum post encontrado para este autor." });
      }
    } catch (error) {
      console.error("🚨 Erro ao listar posts do autor:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  // Listar todas as publicações
  static async listarPost(req, res) {
    try {
      console.log("📄 Buscando todas as publicações...");

      const listaPost = await Post.find({}).populate("autor", "name disciplina");

      if (listaPost.length === 0) {
        return res.status(200).json({ message: "Nenhuma publicação encontrada." });
      }

      res.status(200).json(listaPost);
    } catch (erro) {
      console.error("🚨 Erro ao listar publicações:", erro);
      res.status(500).json({ message: `Erro ao listar publicações: ${erro.message}` });
    }
  }

  // Buscar publicação por ID
  static async listarPostPorId(req, res) {
    const { id } = req.params;

    try {
      console.log(`🔎 Buscando publicação com ID: ${id}...`);

      const postEncontrado = await Post.findById(id).populate("autor", "name disciplina");

      if (!postEncontrado) {
        return res.status(404).json({ message: "Publicação não encontrada." });
      }

      res.status(200).json(postEncontrado);
    } catch (erro) {
      console.error("🚨 Erro ao buscar publicação:", erro);
      res.status(500).json({ message: `Erro ao buscar publicação por ID: ${erro.message}` });
    }
  }

  // Criar uma nova publicação
  static async cadastrarPost(req, res) {
    const { titulo, descricao, autor, imagem } = req.body;

    try {
      console.log("📝 Criando nova publicação...");

      const autorEncontrado = await User.findById(autor);
      if (!autorEncontrado) {
        return res.status(404).json({ message: "Autor não encontrado. Verifique o ID fornecido." });
      }

      const novaPublicacao = new Post({
        titulo,
        descricao,
        autor: autorEncontrado._id,
        imagem,
      });

      const postCriado = await novaPublicacao.save();

      res.status(201).json({
        message: "Publicação criada com sucesso!",
        post: postCriado,
      });
    } catch (erro) {
      console.error("🚨 Erro ao cadastrar publicação:", erro);
      res.status(500).json({ message: `Erro ao cadastrar publicação: ${erro.message}` });
    }
  }

  // Atualizar uma publicação existente
  static async atualizarPost(req, res) {
    const { id } = req.params;
    const { titulo, descricao, autor, imagem } = req.body;

    try {
      console.log(`🔄 Atualizando publicação ID: ${id}`);

      if (autor) {
        const autorEncontrado = await User.findById(autor);
        if (!autorEncontrado) {
          return res.status(404).json({ message: "Autor não encontrado. Verifique o ID fornecido." });
        }
      }

      const postAtualizado = await Post.findByIdAndUpdate(
        id,
        { titulo, descricao, autor, imagem },
        { new: true, runValidators: true }
      );

      if (!postAtualizado) {
        return res.status(404).json({ message: "Publicação não encontrada para atualização." });
      }

      res.status(200).json({
        message: "Publicação atualizada com sucesso!",
        post: postAtualizado,
      });
    } catch (erro) {
      console.error("🚨 Erro ao atualizar publicação:", erro);
      res.status(500).json({ message: `Erro ao atualizar publicação: ${erro.message}` });
    }
  }

  // Excluir uma publicação
  static async excluirPost(req, res) {
    const { id } = req.params;

    try {
      console.log(`🗑️ Excluindo publicação ID: ${id}`);

      const postExcluido = await Post.findByIdAndDelete(id);

      if (!postExcluido) {
        return res.status(404).json({ message: "Publicação não encontrada para exclusão." });
      }

      res.status(200).json({ message: "Publicação excluída com sucesso!" });
    } catch (erro) {
      console.error("🚨 Erro ao excluir publicação:", erro);
      res.status(500).json({ message: `Erro ao excluir publicação: ${erro.message}` });
    }
  }
}

export default PostController;
