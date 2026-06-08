
import {prisma} from "../config/db.js"
import axios from "axios"




export const authCaptainMiddleware = async (req,res,next)=>{
     let token;
    try{
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
    const captain = await axios.get(`${process.env.BASE}/auth/profile`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    req.captain =captain.data;
    next();


    }
    catch(error){
        console.error("Axios Auth Error:", error.message);
        
        // If the User server sent back a specific error status, pass it along. Otherwise, default to 401.
        const statusCode = error.response?.status || 401;
        
        return res.status(statusCode).json({ 
            message: "Authentication failed or User server is unreachable." 
        });
    }
    
}
