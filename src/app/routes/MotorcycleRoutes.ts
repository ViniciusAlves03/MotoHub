import { Router } from "express";
import MotorcycleController from "../controllers/MotorcycleController";
import { imageUpload } from "../helpers/image-upload";
import verifyToken from "../helpers/verify-token";

const motorcycleRouter = Router()

motorcycleRouter.post('/create', verifyToken, imageUpload.array('images'), MotorcycleController.create)
motorcycleRouter.get('/', MotorcycleController.getAllMotorcycles)
motorcycleRouter.get('/mymotorcycles', verifyToken, MotorcycleController.getAllStoreMotorcycles)
motorcycleRouter.get('/:id', MotorcycleController.getMotorcycleById)
motorcycleRouter.delete('/delete/:id', verifyToken, MotorcycleController.removeMotorcycleById)
motorcycleRouter.patch('/edit/:id', verifyToken, imageUpload.array('images'), MotorcycleController.updateMotorcycle)

export default motorcycleRouter
