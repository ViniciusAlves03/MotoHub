import { NextFunction, Request, Response } from "express";
import getToken from "./get-token";
import { verify } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.status(401).json("Acesso negado!")
    }

    const token = getToken(req)
    if (!token) { return res.status(401).json("Token inválido, acesso negado!") }

    try {
        verify(token, 'usersecret')
        next()
    } catch (error) {
        return res.status(401).json("Acesso negado!" )
    }
}

export default verifyToken
