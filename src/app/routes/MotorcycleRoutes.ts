import { Router } from "express";
import MotorcycleController from "../controllers/MotorcycleController";
import { imageUpload } from "../helpers/image-upload";
import verifyToken from "../helpers/verify-token";

const motorcycleRouter = Router()

motorcycleRouter.post('/create', verifyToken, imageUpload.array('images'), MotorcycleController.create)
motorcycleRouter.get('/', MotorcycleController.getAllMotorcycles)
motorcycleRouter.get('/mymotorcycles', verifyToken, MotorcycleController.getAllStoreMotorcycles)

export default motorcycleRouter
