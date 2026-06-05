import express from "express"
import { login, logout, RegisterController } from "../controllers/authControllers.js";
import { validateRequest } from "../middlewares/requestValidator.js";
import { registerSchema } from "../validators/authValidator.js";


const router =express.Router();


router.post('/register',validateRequest(registerSchema),RegisterController);
 router.post('/login',login);
 router.post('/logout',logout);
// router.get('/profile',profileController);





export default router;