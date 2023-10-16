import { sign } from "jsonwebtoken"
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const createUserToken = async (user: any, req: Request, res: Response) => {

    const token = sign({
        name: user.name,
        id: user._id
    }, process.env.SECRET_JWT!)

    res.status(200).json({
        message: "Você está autenticado!",
        token: token,
        userId: user._id
    })
}

export default createUserToken
