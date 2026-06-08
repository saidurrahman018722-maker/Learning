import { publishToQueue } from "../services/rabbitmq.js";
import {prisma} from "../config/db.js"


export const rideUpdate = async (req,res)=>{
    const {rideId} = req.params;

    const rideInfo = await prisma.ride.update({
        where:{
            id:rideId
        },
        data:{
            status:"ACCPETED"
        }
    })
    res.status(200).json({
        message:"ride accepted",
        data:{
        rideId:rideId,
        userId:rideInfo.userId,
        captainId:req.captain.data.id,
        captainName:req.captain.data.name,
        pickup:rideInfo.pickup,
        destination:rideInfo.destination,
        status:rideInfo.status
            
        }
    })
    publishToQueue('ride-accepted',{
        message:"ride accepted",
        rideId:rideId,
        userId:rideInfo.userId,
        captainId:req.captain.data.id,
        captainName:req.captain.data.name,
        pickup:rideInfo.pickup,
        destination:rideInfo.destination,
        status:rideInfo.status
    });

}
