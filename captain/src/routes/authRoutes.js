import express from "express"
import { login, logout, RegisterController,profile,waitForNewRides } from "../controllers/authControllers.js";
import { validateRequest } from "../middlewares/requestValidator.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";




const router =express.Router();


router.post('/register',validateRequest(registerSchema),RegisterController);
 router.post('/login',validateRequest(loginSchema),login);
 router.post('/logout',logout);
 router.get('/profile',authMiddleware,profile);
 router.get('/waitForNewRides',authMiddleware,waitForNewRides);

 










export default router;