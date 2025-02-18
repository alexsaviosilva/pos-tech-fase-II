import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API - Blog Documentation",
      version: "1.0.0",
      description: "API para meu projeto de Blog com Node.js/Express.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDocs);
