import express from "express";
import userRouter from "./routes/UserRoutes";
import storeRouter from "./routes/StoreRoutes";
import motorcycleRouter from "./routes/MotorcycleRoutes";

export class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
        this.server.use(express.static('src/app/public'));
        //this.server.use(cors({credentials: true, origin: 'http://localhost:3000'}))
    }

    private router() {
        this.server.use('/user', userRouter);
        this.server.use('/store', storeRouter);
        this.server.use('/motorcycle', motorcycleRouter);
    }
}
