import { prisma } from "../config/db.js";
import { publishToQueue } from "../services/rabbitmq.js";


export const createRide = async (req,res)=>{
    const {pickup,destination} = req.body;

    const ride = await prisma.ride.create({
        data:{
            userId:req.user.data.id,
            pickup,
            destination
        
        }
    })
     publishToQueue('create-ride',ride);
    res.status(200).json({
        data:{
            ride
        }
    })
}


