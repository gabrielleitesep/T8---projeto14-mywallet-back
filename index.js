import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import routeUsuario from "./routes/routeUsuario.js"
import routeOperacoes from "./routes/routeOperacoes.js"


dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.listen(5000, () => console.log("App rodando na porta 5000"))

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("My_Wallet");

} catch (err) {
    console.log(err);
}

export const usuariosC = db.collection("usuarios");
export const atividadeC = db.collection("atividade");
export const operacoesC = db.collection("operacoes")

app.use(routeUsuario)
app.use(routeOperacoes)