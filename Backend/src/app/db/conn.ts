import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    if (process.env.DB_CONN_STRING
        ) {
        await mongoose.connect(process.env.DB_CONN_STRING
            );
    }
}

main().catch((error: any) => { console.log(error) })

export { mongoose }
