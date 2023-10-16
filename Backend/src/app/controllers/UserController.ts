import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import { verify } from 'jsonwebtoken';
import User from "../models/User";
import createUserToken from '../helpers/create-user-token';
import getToken from '../helpers/get-token';
import getUserByToken from '../helpers/get-user-by-token';
import { IUser } from '../models/interfaces/IUser';
import Motorcycle from '../models/Motorcycle';
import * as dotenv from "dotenv";

dotenv.config();

class UserController {
    static async register(req: Request, res: Response) {
        const { name, email, password, phone } = req.body

        if (!name) { return res.status(422).json({ message: "o nome é obrigatório" }) }
        if (!email) { return res.status(422).json({ message: "o email é obrigatório" }) }
        if (!password) { return res.status(422).json({ message: "a senha é obrigatória" }) }
        if (!phone) { return res.status(422).json({ message: "o número é obrigatório" }) }

        const userNameExists = await User.findOne({ name: name })
        if (userNameExists) { return res.status(422).json({ message: "Nome de usuário já cadastrado, utilize outro nome" }) }

        const userEmailExists = await User.findOne({ email: email })
        if (userEmailExists) { return res.status(422).json({ message: "E-mail já cadastrado, utilize outro e-mail" }) }

        const passwordHash = await UserController.hashPassword(password)

        const user = new User({ name, email, phone, password: passwordHash, image: null })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            return res.status(422).json({ message: "não foi possível registrar o usuário!" })
        }
    }

    static async login(req: Request, res: Response) {

        const { email, password } = req.body

        if (!email) { return res.status(422).json({ message: "o email é obrigatório" }) }
        if (!password) { return res.status(422).json({ message: "a senha é obrigatória" }) }

        const user = await User.findOne({ email: email })

        if (!user) { return res.status(422).json({ message: "Usuário não cadastrado" }) }

        const checkPassword = await UserController.comparePassword(password, user.password)

        if (!checkPassword) { return res.status(422).json({ message: "Senha inválida" }) }

        await createUserToken(user, req, res)
    }

    static async getUserById(req: Request, res: Response) {
        const id = req.params.id

        const token = getToken(req)
        if (!token) { return res.status(422).json({ message: "Acesso negado!" }) }

        const user = await User.findById(id).select('-password')

        if (!user) { return res.status(422).json({ message: "Usuário não encontrado!" }) }

        res.status(200).json({ user })
    }

    static async updateUser(req: Request, res: Response) {

        const token = getToken(req)
        const user = await getUserByToken(token, res) as IUser

        const { name, phone, password } = req.body

        const image = req.file as Express.Multer.File

        if (!name) { return res.status(422).json({ message: "O nome é obrigatório" }) }
        user.name = name

        const userNameExists = await User.findOne({ name: name })
        if (userNameExists) { return res.status(422).json({ message: "Nome de usuário já cadastrado, utilize outro nome" }) }

        if (!phone) { return res.status(422).json({ message: "O telefone é obrigatório" }) }
        user.phone = phone

        if (!password) { return res.status(422).json({ message: "A senha é obrigatória" }) }
        user.password = password

        if (image) { user.image = image.filename }

        try {
            await User.findOneAndUpdate(
                { _id: user.id },
                { $set: user },
                { new: true }
            );

            res.status(200).json({ message: "Usuário atualizado com sucesso!" })
        } catch (error) {
            res.status(422).json({ message: "Usuário não foi atualizado, aconteceu um erro inesperado!" })
        }
    }

    static async checkUser(req: Request, res: Response) {

        let currentUser = null;

        try {
            if (req.headers.authorization) {
                const token = getToken(req)
                const decoded = verify(token, process.env.SECRET_JWT!)

                if (typeof decoded === 'object' && 'id' in decoded) {
                    currentUser = await User.findById(decoded.id).select('-password').exec() || null;
                }
            }

            res.status(200).send(currentUser)
        } catch (error) {
            res.status(500).json({ message: "Token inválido" })
        }
    }

    static async getMyMotorcycles(req: Request, res: Response) {

        const token = getToken(req)
        const user = await getUserByToken(token, res) as IUser

        const motorcycles = await Motorcycle.find({
            $or: [
                { 'newOwner': user.email },
                { 'newOwner': user.id },
                { 'newOwner': user.name }
            ]
        }).sort('-createdAt');

        res.status(200).json({ motorcycles })
    }

    static async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(12)
        return await bcrypt.hash(password, salt)
    }

    static async comparePassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword)
    }
}

export default UserController
