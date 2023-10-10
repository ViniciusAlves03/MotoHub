import { Router } from "express";
import UserController from "../controllers/UserController";

const UserRouter = Router();

UserRouter.get('/login', UserController.login)
UserRouter.post('/register', UserController.register)

export default UserRouter
