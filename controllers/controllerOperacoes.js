import { atividadeC, operacoesC } from "../index.js";
import joi from "joi"

const operacaoJOI = joi.object({
    description: joi.string().required().min(1),
    value: joi.number().required().min(1),
})

export async function entrada(req, res) {

    const { description, value } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "")
    const validacao = operacaoJOI.validate({ description, value }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    }

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const atividade = await atividadeC.findOne({ token });

        if (!atividade) {
            return res.sendStatus(401);
        }
        operacoesC.insertOne({ description, value, userId: atividade.userId, })
        return res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function saida(req, res) {

    const { description, value } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "")
    const validacao = operacaoJOI.validate({ description, value }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    }

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const atividade = await atividadeC.findOne({ token });

        if (!atividade) {
            return res.sendStatus(401);
        }
        operacoesC.insertOne({ description, value, userId: atividade.userId, })
        return res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}