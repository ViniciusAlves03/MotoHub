import { Router } from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../helpers/verify-token";
import { imageUpload } from "../helpers/image-upload";

const userRouter = Router();

userRouter.post('/login', UserController.login)
userRouter.post('/register', UserController.register)
userRouter.get('/checkuser', UserController.checkUser)
userRouter.get('/mymotorcycles', verifyToken, UserController.getMyMotorcycles)
userRouter.get('/:id', UserController.getUserById)
userRouter.patch('/edit/:id', verifyToken, imageUpload.single('image'),  UserController.updateUser)

export default userRouter
