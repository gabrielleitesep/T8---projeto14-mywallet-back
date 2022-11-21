import { usuariosC, atividadeC } from "../index.js";
import joi from "joi"
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

const cadastroJOI = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
})

const loginJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
})

export async function cadastro(req, res) {

    const { name, email, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 5);
    const validacao = cadastroJOI.validate({ name, email, password }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    }

    try {
        await usuariosC.insertOne({ name, email, password: hashPassword });
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
    }
}

export async function login(req, res) {

    const { email, password } = req.body;
    const token = uuidV4();
    const validacao = loginJOI.validate({ email, password }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    }

    try {
        const existente = await usuariosC.findOne({ email });
        if (!existente) {
            return res.sendStatus(401);
        }

        const encriptada = bcrypt.compareSync(password, existente.password);
        if (!encriptada) {
            return res.sendStatus(401);
        }

        await atividadeC.insertOne({ token, userId: existente._id });

        res.send({ token });
    } catch (err) {
        res.sendStatus(500);
        console.log(err)
    }
}