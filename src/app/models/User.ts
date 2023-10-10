import { mongoose } from "../db/conn"
import { Schema } from "mongoose"
import { IUser } from "./interfaces/IUser";

const User = mongoose.model<IUser>('User', new Schema({

            name: { type: String, required: true },
            email: { type: String, required: true },
            password: { type: String, required: true },
            phone: { type: String, required: true },

        }, { timestamps: true }
    )
)

export default User;
