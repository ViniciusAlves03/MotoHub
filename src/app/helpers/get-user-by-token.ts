import { Response } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/User";

const getUserByToken = async (token: string, res: Response) => {

    let userId = null

    if (!token) {
        return res.status(401).json({ message: "Acesso negado!" })
    }

    const decoded = verify(token, 'usersecret')

    if (typeof decoded === 'object' && 'id' in decoded) {
        userId = decoded.id
    }

    const user = await User.findOne({ _id: userId })

    return user
}

export default getUserByToken
