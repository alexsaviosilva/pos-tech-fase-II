import express from "express";
import post from "./postsRoutes.js";
import auth from "./authRoutes.js";
import area from "./areaRoutes.js";
import professores from "./professoresRoutes.js"; 
import { serveSwagger, setupSwagger } from "../config/swagger.js";

const routes = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

 
  app.route("/").get((req, res) => {
    res.status(200).send({ message: "Challenge - 2: API Funcionando!" });
  });

  app.use("/posts", post);
  app.use("/auth", auth);
  app.use("/area", area);
  app.use("/professores", professores); 

  app.use("/api-docs", serveSwagger, setupSwagger);

  app.use((req, res, next) => {
    console.warn(`⚠️ Rota não encontrada: ${req.originalUrl}`);
    res.status(404).json({
      message: `Rota ${req.originalUrl} não encontrada.`,
    });
    next();
  });

  app.use((err, req, res, next) => {
    console.error("❌ Erro detectado:", err.message, err.stack);
    res.status(500).json({
      message: "Erro interno do servidor. Por favor, tente novamente.",
      error: err.message,
    });
  });
};

export default routes;
