import { Document } from "mongoose";

export interface IStore extends IAdress{
    id: any;
    name: string;
    email: string;
    password: string;
    phone: string;
    cnpj: string;
    adress: IAdress;
}
