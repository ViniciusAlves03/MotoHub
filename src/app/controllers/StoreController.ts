import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Store from "../models/Store";
import { IStore } from "../models/interfaces/IStore";
import createUserToken from "../helpers/create-user-token";

class StoreController {
    static async register(req: Request, res: Response) {
        const { name, email, password, phone, cnpj, adress: { street, number, neighborhood, state, city, country } } = req.body

        if (!name) { return res.status(422).json("o nome é obrigatório") }
        if (!email) { return res.status(422).json("o email é obrigatório") }
        if (!password) { return res.status(422).json("a senha é obrigatória") }
        if (!phone) { return res.status(422).json("o número é obrigatório") }
        if (!cnpj) { return res.status(422).json("o CNPJ é obrigatório") }
        if (!street) { return res.status(422).json("a rua é obrigatória") }
        if (!number) { return res.status(422).json("o número é obrigatório") }
        if (!neighborhood) { return res.status(422).json("o bairro é obrigatório") }
        if (!state) { return res.status(422).json("o estado é obrigatório") }
        if (!city) { return res.status(422).json("a cidade é obrigatória") }
        if (!country) { return res.status(422).json("o país é obrigatório") }

        const storeExists = await Store.findOne({ email: email })

        if (storeExists) { return res.status(422).json("E-mail já cadastrado, utilize outro e-mail") }

        const passwordHash = await StoreController.hashPassword(password)

        const store = new Store({
            name,
            email,
            password: passwordHash,
            phone,
            cnpj,
            adress: {
                street,
                number,
                neighborhood,
                state,
                city,
                country
            }
        })

        try {
            const newStore = await store.save()

            await createUserToken(newStore, req, res)
        } catch (error) {
            return res.status(422).json("não foi possível registrar a loja!")
        }
    }

    static async login(req: Request, res: Response){
        const {email, password} = req.body

        if (!email) { return res.status(422).json("o email é obrigatório") }
        if (!password) { return res.status(422).json("a senha é obrigatória") }

        const store = await Store.findOne({email: email})

        if(!store){ return res.status(422).json("Loja não cadastrada")}

        const checkPassword = await StoreController.comparePassword(password, store.password)

        if (!checkPassword) { return res.status(422).json("Senha inválida") }

        await createUserToken(store, req, res)
    }

    static async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(12)
        return await bcrypt.hash(password, salt)
    }

    static async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword)
    }
}

export default StoreController
