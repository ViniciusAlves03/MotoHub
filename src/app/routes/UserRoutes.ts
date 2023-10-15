import { Router } from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../helpers/verify-token";

const userRouter = Router();

userRouter.post('/login', UserController.login)
userRouter.post('/register', UserController.register)
userRouter.get('/checkuser', UserController.checkUser)
userRouter.get('/:id', UserController.getUserById)
userRouter.patch('/edit/:id', verifyToken, UserController.updateUser)

export default userRouter
