import { Response } from "express";
import { verify } from "jsonwebtoken";
import Store from "../models/Store";
import * as dotenv from "dotenv";

dotenv.config();

const getStoreByToken = async (token: string, res: Response) => {
    let storeId = null

    if (!token) { return res.status(401).json({ message: "Acesso negado!" }) }

    const decoded = verify(token, process.env.SECRET_JWT!)

    if (typeof decoded === 'object' && 'id' in decoded) {
        storeId = decoded.id
    }

    const store = await Store.findOne({_id: storeId})

    return store
}

export default getStoreByToken
