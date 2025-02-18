import express from "express";
import cors from "cors"; 
import bodyParser from "body-parser"; 
import conectaBanco from "./config/dbconnect.js"; 
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function startServer() {
  try {
    const conexao = await conectaBanco(); 
    conexao.on("error", (error_problem) => {
      console.error("❌ Erro de conexão com o banco de dados!", error_problem);
      process.exit(1); // Encerra a aplicação se o banco não conectar
    });

    conexao.once("open", () => {
      console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");

      // Só carrega as rotas depois da conexão estar estabelecida
      routes(app);
    });

  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao banco
  }
}

startServer();

export default app;
