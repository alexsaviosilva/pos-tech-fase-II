import express from "express";
import post from "./postsRoutes.js";
import auth from "./authRoutes.js";
import area from "./areaRoutes.js";
import { serveSwagger, setupSwagger } from "../config/swagger.js";

const routes = (app) => {
  // Rota principal (verificação da API)
  app.route("/").get((req, res) => {
    res.status(200).send({ message: "Challenge - 2: API Funcionando!" });
  });

  // Middleware para processar JSON
  app.use(express.json());

  // Definição de rotas
  app.use("/posts", post); // Rotas para Publicações
  app.use("/auth", auth); // Rotas para Autenticação
  app.use("/area", area); // Rotas para Área

  // Swagger Documentation
  app.use("/api-docs", serveSwagger, setupSwagger);

  // Middleware de tratamento de rotas não encontradas
  app.use((req, res, next) => {
    res.status(404).json({
      message: `Rota ${req.originalUrl} não encontrada.`,
    });
  });

  // Middleware de tratamento global de erros
  app.use((err, req, res, next) => {
    console.error("Erro detectado:", err.message);
    res.status(500).json({
      message: "Erro interno do servidor. Por favor, tente novamente.",
      error: err.message,
    });
  });
};

export default routes;
