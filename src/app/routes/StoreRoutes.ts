import { Router } from "express";
import StoreController from "../controllers/StoreController";


const storeRouter = Router();

storeRouter.post('/register', StoreController.register)

export default storeRouter
