import { Request, Response } from "express";
import getToken from "../helpers/get-token";
import getStoreByToken from "../helpers/get-store-by-token";
import Motorcycle from "../models/Motorcycle";
import { IStore } from "../models/interfaces/IStore";
import { ObjectId } from "mongodb";

class MotorcycleController {
    static async create(req: Request, res: Response) {
        const { brand, model, year, engineDisplacement, engineType, mileage, price, condition, color, description } = req.body

        const sold = false
        const newOwner = ''

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
            store: store.id,
            sold,
            newOwner
        })

        images.map((image) => {
            motorcycle.images.push(image.filename)
        })

        try {
            const newMotorcycle = await motorcycle.save()

            res.status(200).json({
                message: "A moto foi cadastrada",
                newMotorcycle
            })
        } catch (error) {
            res.status(500).json("A moto não foi cadastrada")
        }
    }

    static async getAllMotorcycles(req: Request, res: Response) {

        const motorcycles = await Motorcycle.find().sort('-createdAt')

        res.status(200).json({ motorcycles: motorcycles })
    }

    static async getAllStoreMotorcycles(req: Request, res: Response) {

        const token = getToken(req)
        const store = await getStoreByToken(token, res) as IStore

        const motorcycles = await Motorcycle.find({ 'store': store.id }).sort('-createdAt')

        res.status(200).json({ motorcycles })
    }

    static async getAllMotorcycleSales(req: Request, res: Response) {

        const token = getToken(req)
        const store = await getStoreByToken(token, res) as IStore

        const motorcycles = await Motorcycle.find({ 'sold': true })

        res.status(200).json({ motorcycles })
    }

    static async getMotorcycleById(req: Request, res: Response) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) { return res.status(422).json('ID inválido') }

        const motorcycle = await Motorcycle.findOne({ _id: id })

        if (!motorcycle) { return res.status(422).json("Moto não encontrada") }

        res.status(200).json({ motorcycle: motorcycle })
    }

    static async removeMotorcycleById(req: Request, res: Response) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) { return res.status(422).json('ID inválido') }

        const motorcycle = await Motorcycle.findOne({ _id: id })

        if (!motorcycle) { return res.status(422).json("Moto não encontrada") }

        const token = getToken(req)
        const store = await getStoreByToken(token, res) as IStore

        if (motorcycle.store.toString() !== store.id.toString()) { return res.status(422).json('Houve um problema em processar sua solicitação, tente novamente!') }

        await Motorcycle.findByIdAndRemove(id)

        res.status(200).json('Moto removida com sucesso!')
    }

    static async updatedMotorcycle(req: Request, res: Response) {

        const id = req.params.id

        const { brand, model, year, engineDisplacement, engineType, mileage, price, condition, color, description, sold, newOwner } = req.body

        const images = req.files as Express.Multer.File[]

        const motorcycle = await Motorcycle.findOne({ _id: id })

        if (!motorcycle) { return res.status(422).json("Moto não encontrada") }

        const token = getToken(req)
        const store = await getStoreByToken(token, res) as IStore

        if (motorcycle.store.toString() !== store.id.toString()) { return res.status(422).json('Houve um problema em processar sua solicitação, tente novamente!') }

        const updatedMotorcycle: Partial<typeof motorcycle> = {}

        if (!brand) { return res.status(422).json("a marca é obrigatória") }
        else { updatedMotorcycle.brand = brand }
        if (!model) { return res.status(422).json("o modelo é obrigatório") }
        else { updatedMotorcycle.model = model }
        if (!year) { return res.status(422).json("o ano é obrigatório") }
        else { updatedMotorcycle.year = year }
        if (!engineDisplacement) { return res.status(422).json("a cilindrada do motor é obrigatória") }
        else { updatedMotorcycle.engineDisplacement = engineDisplacement }
        if (!engineType) { return res.status(422).json("o tipo do motor é obrigatório") }
        else { updatedMotorcycle.engineType = engineType }
        if (!mileage) { return res.status(422).json("a quilometragem é obrigatória") }
        else { updatedMotorcycle.mileage = mileage }
        if (!price) { return res.status(422).json("o preço é obrigatório") }
        else { updatedMotorcycle.price = price }
        if (!condition) { return res.status(422).json("a condição é obrigatória") }
        else { updatedMotorcycle.condition = condition }
        if (!color) { return res.status(422).json("a cor é obrigatória") }
        else { updatedMotorcycle.color = color }
        if (!description) { return res.status(422).json("a descrição é obrigatória") }
        else { updatedMotorcycle.description = description }
        if (!images || images.length === 0) { return res.status(422).json("as imagens são obrigatórias") }
        else {
            images.map((image) => {
                motorcycle.images.push(image.filename)
            })
        }
        if (sold) { updatedMotorcycle.sold = sold }
        if (newOwner) { updatedMotorcycle.newOwner = newOwner }

        await Motorcycle.findByIdAndUpdate(id, updatedMotorcycle)

        res.status(200).json('Moto atualizada com sucesso!')
    }
}

export default MotorcycleController
