import express from "express";
import AutorController from "../controllers/autorController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autores
 *   description: Gerenciamento de autores
 */

/**
 * @swagger
 * /autores:
 *   get:
 *     summary: Lista todos os autores
 *     tags: [Autores]
 *     description: Retorna uma lista de todos os autores cadastrados.
 *     responses:
 *       200:
 *         description: Lista de autores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID do autor
 *                   nome:
 *                     type: string
 *                     description: Nome do autor
 *                   materia:
 *                     type: string
 *                     description: Matéria do autor
 */
router.get("/", AutorController.listarAutores);

/**
 * @swagger
 * /autores/{id}:
 *   get:
 *     summary: Obtém um autor pelo ID
 *     tags: [Autores]
 *     description: Retorna os detalhes de um autor específico pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do autor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do autor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID do autor
 *                 nome:
 *                   type: string
 *                   description: Nome do autor
 *                 materia:
 *                   type: string
 *                   description: Matéria do autor
 *       404:
 *         description: Autor não encontrado
 */
router.get("/:id", AutorController.listarAutorPorId);

/**
 * @swagger
 * /autores:
 *   post:
 *     summary: Cadastra um novo autor
 *     tags: [Autores]
 *     description: Adiciona um novo autor com nome e matéria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do autor
 *               materia:
 *                 type: string
 *                 description: Matéria associada ao autor
 *     responses:
 *       201:
 *         description: Autor cadastrado com sucesso
 *       400:
 *         description: Erro de validação no body
 */
router.post("/", AutorController.cadastrarAutor);

/**
 * @swagger
 * /autores/{id}:
 *   put:
 *     summary: Atualiza um autor pelo ID
 *     tags: [Autores]
 *     description: Atualiza as informações de um autor específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do autor
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do autor
 *               materia:
 *                 type: string
 *                 description: Matéria do autor
 *     responses:
 *       200:
 *         description: Autor atualizado com sucesso
 *       404:
 *         description: Autor não encontrado
 */
router.put("/:id", AutorController.atualizarAutor);

/**
 * @swagger
 * /autores/{id}:
 *   delete:
 *     summary: Exclui um autor pelo ID
 *     tags: [Autores]
 *     description: Remove um autor específico da lista.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do autor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Autor excluído com sucesso
 *       404:
 *         description: Autor não encontrado
 */
router.delete("/:id", AutorController.excluirAutor);

export default router;