import { Router } from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../helpers/verify-token";

const UserRouter = Router();

UserRouter.post('/login', UserController.login)
UserRouter.post('/register', UserController.register)
UserRouter.get('/checkuser', UserController.checkUser)
UserRouter.get('/:id', UserController.getUserById)
UserRouter.patch('/edit/:id', verifyToken, UserController.editUser)

export default UserRouter
