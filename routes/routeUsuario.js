import express from "express";
import { cadastro, login } from "../controllers/controllerUsuario.js";

const router = express.Router()
router.post("/cadastro", cadastro);
router.post("/", login);

export default router