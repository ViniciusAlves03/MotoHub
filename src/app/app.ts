import express from "express";
import UserRouter from "./routes/UserRoutes";

export class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
        //this.server.use(cors({credentials: true, origin: 'http://localhost:3000'}))
    }

    private router() {
        this.server.use('/user', UserRouter);
    }
}
