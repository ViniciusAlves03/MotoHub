import { Router } from "express";
import StoreController from "../controllers/StoreController";
import verifyToken from "../helpers/verify-token";
import { imageUpload } from "../helpers/image-upload";

const storeRouter = Router();

storeRouter.post('/register', imageUpload.single('image'), StoreController.register)
storeRouter.post('/login', StoreController.login)
storeRouter.get('/checkstore', StoreController.checkStore)
storeRouter.get('/:id', StoreController.getStoreById)
storeRouter.patch('/edit/:id', imageUpload.single('image'), verifyToken, StoreController.updateStore)

export default storeRouter
