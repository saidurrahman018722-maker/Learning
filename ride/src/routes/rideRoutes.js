import express from "express";
import {createRide} from "../controllers/rideController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { RideSchema } from "../validators/rideValidator.js";
import { rideUpdate } from "../controllers/rideUpdateController.js";
import { authCaptainMiddleware } from "../middlewares/captainAuthMiddleware.js";



const router = express.Router();



router.post("/create-ride",authMiddleware,validateRequest(RideSchema),createRide);


router.patch("/ride-accepted/:rideId",authCaptainMiddleware,rideUpdate)

export default router;