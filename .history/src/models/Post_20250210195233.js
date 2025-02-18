// Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
  },
  descricao: {
    type: String,
    required: [true, 'A descrição é obrigatória'],
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: [true, 'O autor é obrigatório'],
  },
  data: {
    type: Date,
    default: Date.now,
  },
  imagem: {
    type: String,
  },
});

const Post = mongoose.model('Post', postSchema);
export default Post; // Verifique se está exportando corretamente o modelo
