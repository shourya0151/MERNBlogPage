import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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