import { Router } from "express";
import MotorcycleController from "../controllers/MotorcycleController";
import { imageUpload } from "../helpers/image-upload";

const motorcycleRouter = Router()

motorcycleRouter.post('/create', imageUpload.array('images'), MotorcycleController.create)

export default motorcycleRouter
