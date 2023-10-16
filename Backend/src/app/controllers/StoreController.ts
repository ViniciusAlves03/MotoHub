import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Store from "../models/Store";
import { IStore } from "../models/interfaces/IStore";
import createUserToken from "../helpers/create-user-token";
import getToken from "../helpers/get-token";
import getStoreByToken from "../helpers/get-store-by-token";
import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

class StoreController {
    static async register(req: Request, res: Response) {
        const { name, email, password, phone, cnpj, street, number, neighborhood, state, city, country } = req.body

        const image = req.file as Express.Multer.File

        if (!name) { return res.status(422).json({ message: "o nome é obrigatório" }) }
        if (!email) { return res.status(422).json({ message: "o email é obrigatório" }) }
        if (!password) { return res.status(422).json({ message: "a senha é obrigatória" }) }
        if (!phone) { return res.status(422).json({ message: "o número é obrigatório" }) }
        if (!cnpj) { return res.status(422).json({ message: "o CNPJ é obrigatório" }) }
        if (!street) { return res.status(422).json({ message: "a rua é obrigatória" }) }
        if (!number) { return res.status(422).json({ message: "o número é obrigatório" }) }
        if (!neighborhood) { return res.status(422).json({ message: "o bairro é obrigatório" }) }
        if (!state) { return res.status(422).json({ message: "o estado é obrigatório" }) }
        if (!city) { return res.status(422).json({ message: "a cidade é obrigatória" }) }
        if (!country) { return res.status(422).json({ message: "o país é obrigatório" }) }
        if (!image) { return res.status(422).json({ message: "a foto é obrigatória" }) }

        const storeExists = await Store.findOne({ email: email })

        if (storeExists) { return res.status(422).json({ message: "E-mail já cadastrado, utilize outro e-mail" }) }

        const passwordHash = await StoreController.hashPassword(password)

        const store = new Store({
            name,
            email,
            password: passwordHash,
            phone,
            cnpj,
            image: image.filename,
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
            return res.status(422).json({ message: "não foi possível registrar a loja!" })
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body

        if (!email) { return res.status(422).json({ message: "o email é obrigatório" }) }
        if (!password) { return res.status(422).json({ message: "a senha é obrigatória" }) }

        const store = await Store.findOne({ email: email })

        if (!store) { return res.status(422).json({ message: "Loja não cadastrada" }) }

        const checkPassword = await StoreController.comparePassword(password, store.password)

        if (!checkPassword) { return res.status(422).json({ message: "Senha inválida" }) }

        await createUserToken(store, req, res)
    }

    static async getStoreById(req: Request, res: Response) {
        const id = req.params.id

        const token = getToken(req)
        if (!token) { return res.status(422).json({ message: "Acesso negado" }) }

        const store = await Store.findById(id).select('-password')

        if (!store) { return res.status(422).json({ message: "Loja não encontrada" }) }

        res.status(200).json({ store })
    }

    static async updateStore(req: Request, res: Response) {
        const token = getToken(req)
        const store = await getStoreByToken(token, res) as IStore

        const { name, password, phone, cnpj, street, number, neighborhood, state, city, country } = req.body

        const image = req.file as Express.Multer.File

        const updatedStore: Partial<typeof store> = {}

        const updatedAdress = {
            street,
            number,
            neighborhood,
            state,
            city,
            country
        }

        const passwordHash = await StoreController.hashPassword(password)

        if (!name) { return res.status(422).json({ message: "o nome é obrigatório" }) }
        else { updatedStore.name = name }
        if (!password) { return res.status(422).json({ message: "a senha é obrigatória" }) }
        else { updatedStore.password = passwordHash }
        if (!phone) { return res.status(422).json({ message: "o número é obrigatório" }) }
        else { updatedStore.phone = phone }
        if (!cnpj) { return res.status(422).json({ message: "o CNPJ é obrigatório" }) }
        else { updatedStore.cnpj = cnpj }
        if (!street) { return res.status(422).json({ message: "a rua é obrigatória" }) }
        else { updatedAdress.street = street }
        if (!number) { return res.status(422).json({ message: "o número é obrigatório" }) }
        else { updatedAdress.number = number }
        if (!neighborhood) { return res.status(422).json({ message: "o bairro é obrigatório" }) }
        else { updatedAdress.neighborhood = neighborhood }
        if (!state) { return res.status(422).json({ message: "o estado é obrigatório" }) }
        else { updatedAdress.state = state }
        if (!city) { return res.status(422).json({ message: "a cidade é obrigatória" }) }
        else { updatedAdress.city = city }
        if (!country) { return res.status(422).json({ message: "o país é obrigatório" }) }
        else { updatedAdress.country = country }
        if (!image) { return res.status(422).json({ message: "a foto é obrigatória" }) }
        else { updatedStore.image = image.filename }

        updatedStore.adress = updatedAdress

        try {
            await Store.findOneAndUpdate(
                { _id: store.id },
                { $set: updatedStore },
                { new: true }
            )

            res.status(200).json({ message: "Loja atualizada com sucesso!" })
        } catch (error) {
            res.status(422).json({ message: "Loja não foi atualizada, aconteceu um erro inesperado!" })
        }
    }

    static async checkStore(req: Request, res: Response) {
        let currentStore = null

        try {
            if (req.headers.authorization) {
                const token = getToken(req)
                const decoded = verify(token, process.env.SECRET_JWT!)

                if (typeof decoded === 'object' && 'id' in decoded) {
                    currentStore = await Store.findById(decoded.id).select('-password').exec() || null;
                }
            }

            res.status(200).send(currentStore)
        } catch (error) {
            res.status(500).json({ message: "Token inválido!" })
        }
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
