import { Schema } from "mongoose"

export interface IMotorcycle{
    brand: string;
    model: string;
    year: string;
    engineDisplacement: string;
    engineType: string;
    mileage: string;
    price: string;
    condition: string;
    color: string;
    description: string;
    images: Array<string>;
    store: Schema.Types.ObjectId;
}
