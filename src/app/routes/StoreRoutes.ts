import { Router } from "express";
import StoreController from "../controllers/StoreController";
import verifyToken from "../helpers/verify-token";

const storeRouter = Router();

storeRouter.post('/register', StoreController.register)
storeRouter.post('/login', StoreController.login)
storeRouter.get('/checkstore', StoreController.checkStore)
storeRouter.get('/:id', StoreController.getStoreById)
storeRouter.patch('/edit/:id', verifyToken, StoreController.editStore)

export default storeRouter
