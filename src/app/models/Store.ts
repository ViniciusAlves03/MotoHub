import { mongoose } from "../db/conn"
import { Schema } from "mongoose";
import { IStore } from "./interfaces/IStore";

const Store = mongoose.model<IStore>('Store', new Schema({

            name: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true },
            phone: { type: String, required: true },
            cnpj: { type: String, required: true },
            adress: {
                street: { type: String, required: true },
                number: { type: String, required: true },
                neighborhood: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                country: { type: String, required: true },
            }

        }, { timestamps: true }
    )
)

export default Store;
