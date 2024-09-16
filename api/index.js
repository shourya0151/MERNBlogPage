import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js'


dotenv.config();

(async()=> {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MongoDb is conneted');
    }).catch((err)=>{
        console.log(err);
    });
})();//USING IIFE 


const app = express();

//ALLOW JSON TO SEND IN RESPONSE
app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);


//middleware to handle error

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});