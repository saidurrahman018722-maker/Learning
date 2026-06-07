import axios from "axios";


export const authMiddleware = async (req,res,next)=>{
    try{
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
    const response = await axios.get(`${process.env.Base_URL}/auth/profile`,{
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    req.user =response.data;

    next();
}catch (error) {
        // 5. If Axios fails (404, 401, etc.), catch it safely here instead of crashing!
        console.error("Axios Auth Error:", error.message);
        
        // If the User server sent back a specific error status, pass it along. Otherwise, default to 401.
        const statusCode = error.response?.status || 401;
        
        return res.status(statusCode).json({ 
            message: "Authentication failed or User server is unreachable." 
        });
    }
};
