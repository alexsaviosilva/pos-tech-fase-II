import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Por favor, insira um email válido.",
      ],
    },
    password: {
      type: String,
      required: [true, "A senha é obrigatória."],
      minlength: [6, "A senha deve ter pelo menos 6 caracteres."],
    },
    role: {
      type: String,
      enum: ["admin", "professor", "aluno"],
      default: "aluno",
    },
    disciplina: {
      type: String,
      required: function () {
        return this.role === "professor"; // Apenas professores precisam de disciplina
      },
      validate: {
        validator: function (value) {
          if (this.role === "professor" && !value) {
            return false; // Professor sem disciplina → erro
          }
          if (this.role === "aluno" && value) {
            return false; // Aluno com disciplina → erro
          }
          return true;
        },
        message: function () {
          return this.role === "professor"
            ? "Professores devem ter uma disciplina associada."
            : "Alunos não podem ter disciplina.";
        },
      },
      default: null, // 🔹 Garante que alunos tenham disciplina = null
    },
  },
  { timestamps: true }
);

// 🔒 Hash da senha antes de salvar no banco
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("❌ Erro ao hashear a senha:", error);
    next(error);
  }
});

// 🔑 Método para verificar a senha
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("❌ Erro ao verificar a senha:", error);
    throw error;
  }
};

// 🔹 Remove a senha antes de retornar os dados do usuário
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
