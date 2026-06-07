import express from "express"
import proxy from "express-http-proxy";


const app = express();


app.use("/user",proxy("http://localhost:5001"))
app.use("/captain",proxy("http://localhost:5002"))
app.use("/ride",proxy("http://localhost:5003"))



app.listen(5000,()=>{
    console.log("the gateway server is running in the port 5000");
})