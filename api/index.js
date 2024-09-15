import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';


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

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

app.use('/api/user',userRoutes);