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
      console.error("Erro de conexão com o banco de dados!", error_problem);
    });

    conexao.once("open", () => {
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
    });

    routes(app); 
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}

startServer(); 

export default app;
