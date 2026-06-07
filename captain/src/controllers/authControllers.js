import {prisma} from "../config/bd.js"
import bcrypth from "bcryptjs"
import { generateToken } from "../utils/tokenganarate.js"
import express from "express"
import { blackListTokenSchema } from "../validators/authValidator.js";
import { validateRequest } from "../middlewares/requestValidator.js";


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



    


