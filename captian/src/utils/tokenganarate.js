import jwt from "jsonwebtoken"

export const generateToken = (userId,res)=>{
   const payload = {id:userId}
   const token = jwt.sign(payload,process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES || '7d',
   
   })

   res.cookie("jwt",token,{
    httpOnly:true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite:'strict',
    Age:(1000*60*60*24)*7
   })

   return token;

}