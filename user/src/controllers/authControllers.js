import {prisma} from "../config/bd.js"
import bcrypth from "bcryptjs"
import { generateToken } from "../utils/tokenganarate.js"
import express from "express"
import { blackListTokenSchema } from "../validators/authValidator.js";
import { validateRequest } from "../middlewares/requestValidator.js";


const one = express.Router();

export const RegisterController = async (req,res)=>{

    const {name,email,password} =req.body;

    const userExits = await prisma.user.findUnique({
        where:{
            email:email
        }
    });
    if(userExits){
        return res.status(400).json({
            message: "the user already exits."
        })
    }

    const salt = await bcrypth.genSalt(10);
    const hashedPassword = await bcrypth.hash(password,salt);

    const user = await prisma.user.create({
        data:{

            name,
            email,
            password:hashedPassword
        
        }
    })
    const token = generateToken(user.id,res);

    return res.status(200).json({
        message:"user created successfully",
        data:{
            id:user.id,
            user
        },
        token

    })
}

    export const login = async (req,res)=>{
        const {email,password} = req.body;

        const userExits =  await prisma.user.findUnique({
            where:{
                email:email,
            }
        })
        if(!userExits){
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }
        const verifypassword = await bcrypth.compare(password,userExits.password);

        if(!verifypassword){
            return res.status(400).json({
                message:"Invalid email or password"
            })

        }
        const token = generateToken(userExits.id,res);

        return res.status(200).json({
            status : "sucess",
            data:{
                id:userExits.id,
                name:userExits.name,
                email:userExits.email,
                
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
                message:"the user is already logged out"
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
            message:"user logged out successfully"
        })
            

    }
    catch(error){
        return res.status(400).json({
            message:error.message
        })
    }
    } 


    


