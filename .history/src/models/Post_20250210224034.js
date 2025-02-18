import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, "A descrição é obrigatória"],
      trim: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "O autor é obrigatório"],
    },
    imagem: {
      type: String,
      validate: {
        validator: function (value) {
          return !value || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(value);
        },
        message: "A URL da imagem deve ser válida e terminar com .png, .jpg, .jpeg, .gif ou .svg",
      },
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
