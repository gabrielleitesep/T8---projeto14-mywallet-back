import { atividadeC, operacoesC, usuariosC } from "../index.js";
import joi from "joi"
import dayjs from "dayjs"

const entradaJOI = joi.object({
    description: joi.string().required().min(1),
    value: joi.number().required().min(1).max(Infinity),
})


const saidaJOI = joi.object({
    description: joi.string().required().min(1),
    value: joi.number().required().min(-Infinity).max(0),
})

export async function entrada(req, res) {

    const { description, value } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "")
    const validacao = entradaJOI.validate({ description, value }, { abortEarly: false })

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
        operacoesC.insertOne({ time: dayjs().format("DD/MM"), description, value, userId: atividade.userId, })
        return res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function saida(req, res) {

    const { description, value } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "")
    const validacao = saidaJOI.validate({ description, value }, { abortEarly: false })

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
        operacoesC.insertOne({ time: dayjs().format("DD/MM"), description, value, userId: atividade.userId, })
        return res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export async function extrato(req, res) {

    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const atividade = await atividadeC.findOne({ token });
        const usuario = await usuariosC.findOne({_id: atividade?.userId})
        if (!usuario) {
            return res.sendStatus(401);
        }

        const controleGastos = await operacoesC.find({ userId: usuario._id}).toArray()
        return res.send(controleGastos)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}