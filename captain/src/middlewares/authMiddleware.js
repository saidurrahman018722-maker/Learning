import jwt from "jsonwebtoken"
import { prisma } from "../config/db.js";

export const authMiddleware = async (req,res,next)=>{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    else if(req.cookies?.jwt){
        token =req.cookies.jwt;
    }
    if(!token){
        return res.status(401).json({
            message:"Unauthorized."
        })
    }

    const blackListedToken = await prisma.blackListToken.findUnique({
        where:{
            token:token
        }
    })
    if(blackListedToken){
        return res.status(401).json({
            message:"Unauthorized token."
        })
    }
    try {
        const captain = jwt.verify(token,process.env.JWT_SECRET);

        if(!captain){
            return res.status(401).json({
                message:"Unauthorized token."
            })
        }
        
        const captainExits =  await prisma.captain.findUnique({
            where:{
                id:captain.id
            }
        })
        if(!captainExits){
            return res.status(404).json({
                message:"user not found"
            })
        }

        req.captain = captainExits;
        next();
    } catch (error) {
        return res.status(401).json({
            message:error.message
        
        })
    
    }


}