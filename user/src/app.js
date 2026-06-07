import express from "express"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import { connectDB } from "./config/bd.js";
import authRoutes from "./routes/authRoutes.js"
import {clearExpiredTokens} from "../src/utils/clearToken.js"
import { connectRabbitMQ } from "./services/rabbitmq.js";


config();
connectDB();
connectRabbitMQ();
clearExpiredTokens();

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/auth',authRoutes);



app.listen(5001,()=>{
    console.log("the sever is running on the port 5001")
})