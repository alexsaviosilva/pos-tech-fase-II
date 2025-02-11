import post from "../models/Post.js";
import User from "../models/User.js";

class PostController {
  // Método para listar posts de um autor específico
  static async listarPostsPorAutor(req, res) {
    try {
      const autorId = req.params.autorId;
      const posts = await post.find({ "autor": autorId });  // Filtrando diretamente pelo ID do autor


      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "Nenhum post encontrado para este autor." });
      }
    } catch (error) {
      console.error("Erro ao listar posts do autor:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async listarPost(req, res) {
    try {
      const listaPost = await post
        .find({})
        .populate("autor", "name disciplina") 
        .exec();

      if (listaPost.length === 0) {
        return res.status(200).json({ message: "Nenhuma publicação encontrada." });
      }

      res.status(200).json(listaPost);
    } catch (erro) {
      res.status(500).json({ message: `Erro ao listar publicações: ${erro.message}` });
    }
  }

  static async listarPostPorId(req, res) {
    const { id } = req.params;

    try {
      const postEncontrado = await post
        .findById(id)
        .populate("autor", "name disciplina") 
        .exec();

      if (!postEncontrado) {
        return res.status(404).json({ message: "Publicação não encontrada." });
      }

      res.status(200).json(postEncontrado);
    } catch (erro) {
      res.status(500).json({ message: `Erro ao buscar publicação por ID: ${erro.message}` });
    }
  }

  static async cadastrarPost(req, res) {
    const {titulo, descricao, autor, imagem} = req.body;

    try {
      const autorEncontrado = await User.findById(autor);
      if (!autorEncontrado) {
        return res.status(404).json({ message: "Autor não encontrado. Verifique o ID fornecido." });
      }

      const novaPublicacao = new post({
        titulo,
        descricao,
        autor: autorEncontrado._id,
        nomeAutor: autorEncontrado.nome,
        imagem,
        data: new Date(),
      });

      const postCriado = await novaPublicacao.save();

      res.status(201).json({
        message: "Publicação criada com sucesso!",
        post: postCriado,
      });
    } catch (erro) {
      res.status(500).json({ message: `Erro ao cadastrar publicação: ${erro.message}` });
    }
  }

  static async atualizarPost(req, res) {
    const { id } = req.params;
    const {titulo, descricao, autor, imagem} = req.body;

    try {
      if (autor) {
        const autorEncontrado = await User.findById(autor);
        if (!autorEncontrado) {
          return res.status(404).json({ message: "Autor não encontrado. Verifique o ID fornecido." });
        }
      }

      if (!categoria) {
        return res.status(400).json({ message: "O campo 'categoria' é obrigatório." });
      }

      const postAtualizado = await post.findByIdAndUpdate(
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
      res.status(500).json({ message: `Erro ao atualizar publicação: ${erro.message}` });
    }
  }

  static async excluirPost(req, res) {
    const { id } = req.params;

    try {
      const postExcluido = await post.findByIdAndDelete(id);

      if (!postExcluido) {
        return res.status(404).json({ message: "Publicação não encontrada para exclusão." });
      }

      res.status(200).json({ message: "Publicação excluída com sucesso!" });
    } catch (erro) {
      res.status(500).json({ message: `Erro ao excluir publicação: ${erro.message}` });
    }
  }
}

export default PostController;
