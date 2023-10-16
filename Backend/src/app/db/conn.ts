import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.DB_CONN_STRING

async function main() {
    if (mongoURI) {
        await mongoose.connect(mongoURI);
    }
}

main().catch((error: any) => { console.log(error) })

export { mongoose }
