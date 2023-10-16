import { Schema } from "mongoose"
import { mongoose } from "../db/conn"
import { IMotorcycle } from "./interfaces/IMotorcycle"

const Motorcycle = mongoose.model<IMotorcycle>('Motorcycle', new Schema({

            brand: { type: String, required: true },
            model: { type: String, required: true },
            year: { type: String, required: true },
            engineDisplacement: { type: String, required: true },
            engineType: { type: String, required: true },
            mileage: { type: String, required: true },
            price: { type: String, required: true },
            condition: { type: String, required: true },
            color: { type: String, required: true },
            description: { type: String, required: true },
            images: [{ type: String}],
            store: { type: Schema.Types.ObjectId, ref: "Store" }
        }, { timestamps: true }
    )
)

export default Motorcycle
