import express from "express"
import { login, logout, RegisterController,profile } from "../controllers/authControllers.js";
import { validateRequest } from "../middlewares/requestValidator.js";
import { registerSchema } from "../validators/authValidator.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { rideAccepted } from "../controllers/rideAcceptedController.js";

const router =express.Router();


router.post('/register',validateRequest(registerSchema),RegisterController);
 router.post('/login',login);
 router.post('/logout',logout);
 router.get('/profile',authMiddleware,profile);
 router.get('/rideInfo',authMiddleware,rideAccepted);





export default router;