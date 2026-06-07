import express from "express"
import { login, logout, RegisterController,profile } from "../controllers/authControllers.js";
import { validateRequest } from "../middlewares/requestValidator.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router =express.Router();


router.post('/register',validateRequest(registerSchema),RegisterController);
 router.post('/login',validateRequest(loginSchema),login);
 router.post('/logout',logout);
 router.get('/profile',authMiddleware,profile);





export default router;