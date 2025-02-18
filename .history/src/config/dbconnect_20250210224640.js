import mongoose from "mongoose";

async function conectaBanco() {
  try {
    const dbUri = process.env.DB_CONNECTION_STRING;
    
    if (!dbUri) {
      throw new Error("⚠️ A variável de ambiente DB_CONNECTION_STRING não está definida!");
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conexão com MongoDB estabelecida com sucesso!");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error.message);
    process.exit(1); 
  }
}

export default conectaBanco;
