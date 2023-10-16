import { NextFunction, Request, Response } from "express";
import getToken from "./get-token";
import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Acesso negado!" })
    }

    const token = getToken(req)
    if (!token) { return res.status(401).json({ message: "Token inválido, acesso negado!" }) }

    try {
        verify(token, process.env.SECRET_JWT!)
        next()
    } catch (error) {
        return res.status(401).json({ message: "Acesso negado!" })
    }
}

export default verifyToken
