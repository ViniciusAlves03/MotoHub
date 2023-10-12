import { Request } from "express";

const getToken = (req: Request) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) { throw new Error("Autorização Negada!") }

    const token = authHeader.split(" ")[1];

    return token;
}

export default getToken
