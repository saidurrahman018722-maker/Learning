import express from "express"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js"
import {clearExpiredTokens} from "./src/utils/clearToken.js"
import { connectRabbitMQ } from "./src/services/rabbitmq.js";
import { rabbitMQinit } from "./src/controllers/authControllers.js";



config();
connectDB();
 await connectRabbitMQ();
 rabbitMQinit();
clearExpiredTokens();

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/auth',authRoutes);



app.listen(5002,()=>{
    console.log("the sever is running on the port 5002")
})