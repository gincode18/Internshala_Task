import mongoose from "mongoose"
import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(express.json());

const connect = async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("mongodb connected");
    }catch(err){
        console.log('Failed to connect to MongoDB', err)
    }
}

app.listen(8800,()=>{
    connect();
    console.log("connected to server !")
});


app.use("/api/auth", authRoutes);

app.use((err,req,res,next) =>{
    const status = err.status || 500;
    const message = err.message || "something went wrong";
  
    return res.status(status).json({
      success:false,
      status,
      message,
    }); 
  });