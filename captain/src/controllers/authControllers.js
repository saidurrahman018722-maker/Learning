import {prisma} from "../config/bd.js"
import bcrypth from "bcryptjs"
import { generateToken } from "../utils/tokenganarate.js"
import express from "express"
import { blackListTokenSchema } from "../validators/authValidator.js";
import { validateRequest } from "../middlewares/requestValidator.js";
import { consumeToQueue } from "../services/rabbitmq.js"
import { EventEmitter } from 'events';

// Create the global event bus for your rides
export const rideEventEmitter = new EventEmitter();
// ... your other imports


const one = express.Router();

export const RegisterController = async (req,res)=>{

    const {name,email,password} =req.body;

    const captainExits = await prisma.captain.findUnique({
        where:{
            email:email
        }
    });
    if(captainExits){
        return res.status(400).json({
            message: "the Captain already exits."
        })
    }

    const salt = await bcrypth.genSalt(10);
    const hashedPassword = await bcrypth.hash(password,salt);

    const captain = await prisma.captain.create({
        data:{

            name,
            email,
            password:hashedPassword
        
        }
    })
    const token = generateToken(captain.id,res);

    return res.status(200).json({
        message:"captain created successfully",
        data:{
            id:captain.id,
            captain
        },
        token

    })
}

    export const login = async (req,res)=>{
        const {email,password} = req.body;

        const captainExits =  await prisma.captain.findUnique({
            where:{
                email:email,
            }
        })
        if(!captainExits){
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }
        const verifypassword = await bcrypth.compare(password,captainExits.password);

        if(!verifypassword){
            return res.status(400).json({
                message:"Invalid email or password"
            })

        }
        const token = generateToken(captainExits.id,res);

        return res.status(200).json({
            status : "sucess",
            data:{
                id:captainExits.id,
                name:captainExits.name,
                email:captainExits.email,
                
            },
            token

        })


    }

    export const logout = async (req,res)=>{
        let token;
        try{
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

            token = req.headers.authorization.split(" ")[1];
        }
        else if(req.cookies?.jwt){
            token =req.cookies.jwt;
        }

        if(!token){
            return res.status(200).json({
                message:"the Captain is already logged out"
            })
        }

        one.use(validateRequest(blackListTokenSchema));

        await prisma.blackListToken.create({
            data:{
                token
            }

        })

        res.clearCookie("jwt",{
            httpOnly:true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite:'strict',

        })

        return res.status(200).json({
            message:"Captain logged out successfully"
        })
            

    }
    catch(error){
        return res.status(400).json({
            message:error.message
        })
    }
    } 


        export const profile = async (req,res)=>{
        try {
            
            return res.status(200).json({
                data:{
                    id:req.captain.id,
                    name:req.captain.name,
                    email:req.captain.email
                }
            })
        } catch (error) {
            return res.status(400).json({
                message:"no profile"
            })
        }
    } 

        export const waitForNewRides = async (req, res) => {
            // 1. Set a 30-second timeout. If no ride comes in, close the connection cleanly.
            const timeout = setTimeout(() => {
                // Stop listening to prevent memory leaks
                rideEventEmitter.removeAllListeners('new-ride-available'); 
                
                // 204 No Content tells the frontend "Nothing yet, try asking again"
                return res.status(204).end(); 
            }, 30000);

            // 2. Pause the request here. Wait for RabbitMQ to trigger this exact event.
            rideEventEmitter.once('new-ride-available', (newRideData) => {
                
                // We got a ride! Cancel the timeout so it doesn't fire later.
                clearTimeout(timeout);
                
                // Send the ride data to the Captain's app instantly
                return res.status(200).json({
                    success: true,
                    message: "A new ride is available!",
                    ride: newRideData 
                });
            });
            };

    
         export const rabbitMQinit = ()=>{
            consumeToQueue('create-ride',(data)=>{
            console.log(data);
            rideEventEmitter.emit('new-ride-available', data);
    })
         }



    


