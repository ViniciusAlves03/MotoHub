import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import User from "../models/User";

class UserController {
    static async register(req: Request, res: Response) {
        const { name, email, password, phone } = req.body

        if (!name) { return res.status(422).json("o nome é obrigatório") }
        if (!email) { return res.status(422).json("o email é obrigatório") } //realizar validação de e-mail depois
        if (!password) { return res.status(422).json("a senha é obrigatória") }
        if (!phone) { return res.status(422).json("o número é obrigatório") }

        const userExists = await User.findOne({ email: email })

        if (userExists) { return res.status(422).json("E-mail já cadastrado, utilize outro e-mail") }

        const passwordHash = await UserController.hashPassword(password)

        const user = new User({ name, email, phone, password: passwordHash })

        try {
            const newUser = await user.save()

        } catch (error) {
            return res.status(422).json(error)
        }
    }

    static async login(req: Request, res: Response) {

        const { email, password } = req.body

        if (!email) { return res.status(422).json("o email é obrigatório") }
        if (!password) { return res.status(422).json("a senha é obrigatória") }

        const user = await User.findOne({ email: email })

        if (!user) { return res.status(422).json("Usuário não cadastrado") }

        const checkPassword = await UserController.comparePassword(password, user.password)

        if (!checkPassword) { return res.status(422).json("Senha inválida")}
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
