import express from "express"
import { config } from "dotenv";
import {connectDB} from "../src/config/db.js"
import rideRoutes from "./routes/rideRoutes.js";
import cookieParse from "cookie-parser";
import { connectRabbitMQ } from "./services/rabbitmq.js";

config();
connectDB();
connectRabbitMQ();


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParse());

app.use("/ride",rideRoutes);





app.listen(5003,()=>{
    console.log("the rider server is running in the port 5003");
})