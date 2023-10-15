import { Request, Response } from "express";
import bcrypt from "bcrypt";
import getToken from "../helpers/get-token";
import getStoreByToken from "../helpers/get-store-by-token";
import Motorcycle from "../models/Motorcycle";
import { IStore } from "../models/interfaces/IStore";

class MotorcycleController {
    static async create(req: Request, res: Response) {
        const { brand, model, year, engineDisplacement, engineType, mileage, price, condition, color, description } = req.body

        const images = req.files as Express.Multer.File[]

        if (!brand) { return res.status(422).json("a marca é obrigatória") }
        if (!model) { return res.status(422).json("o modelo é obrigatório") }
        if (!year) { return res.status(422).json("o ano é obrigatório") }
        if (!engineDisplacement) { return res.status(422).json("a cilindrada do motor é obrigatória") }
        if (!engineType) { return res.status(422).json("o tipo do motor é obrigatório") }
        if (!mileage) { return res.status(422).json("a quilometragem é obrigatória") }
        if (!price) { return res.status(422).json("o preço é obrigatório") }
        if (!condition) { return res.status(422).json("a condição é obrigatória") }
        if (!color) { return res.status(422).json("a cor é obrigatória") }
        if (!description) { return res.status(422).json("a descrição é obrigatória") }
        if (!images || images.length === 0) { return res.status(422).json("as imagens são obrigatórias") }

        const token = getToken(req)
        const store = await getStoreByToken(token, res) as IStore

        const motorcycle = new Motorcycle({
            brand,
            model,
            year,
            engineDisplacement,
            engineType,
            mileage,
            price,
            condition,
            color,
            description,
            images: [],
            store: store.id
        })

        images.map((image) => {
            motorcycle.images.push(image.filename)
        })

        try {
            const newMotorcycle = await motorcycle.save()

            res.status(200).json({
                message: "A moto foi cadastrada",
                motorcycle
            })
        } catch (error) {
            res.status(500).json("A moto não foi cadastrada")
        }
    }
}

export default MotorcycleController
