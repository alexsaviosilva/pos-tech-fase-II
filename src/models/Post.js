import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  titulo: { type: String, required: true },
  descricao: { type: String },
  data: { type: mongoose.Schema.Types.Date },
  autor: {type: mongoose.Schema.Types.ObjectId, ref: "autores"},
}, { versionKey: false });

const post = mongoose.model("posts", postSchema);

export default post;