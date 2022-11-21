import express from "express";
import { entrada, saida, extrato } from "../controllers/controllerOperacoes.js";

const router = express.Router()
router.post("/entrada", entrada);
router.post("/saida", saida);
router.get("/extrato", extrato);

export default router