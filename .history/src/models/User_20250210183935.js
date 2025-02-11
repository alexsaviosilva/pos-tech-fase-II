import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
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
        return this.role === "professor";
      },
      validate: {
        validator: function (value) {
          return this.role !== "professor" || !!value; 
        },
        message: "Professores devem ter uma disciplina associada.",
      },
    },
  },
  { timestamps: true } 
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (error) {
    console.error("Erro ao hashear a senha:", error);
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password); 
  } catch (error) {
    console.error("Erro ao verificar a senha:", error);
    throw error;
  }
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; 
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
