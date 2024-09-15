import User from '../model/user.model.js';
import bcryptjs from 'bcryptjs';



export const signup = async(req,res)=>{
    const {username, email,password} = req.body;
    
    if(!username || !email || !password || username === '' || password === ''
        || email === ''
    ){
        return res.status(400).json({message: "All fields are required"});
    }


    //hahs password
    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUser = new User({
        username:username,
        email:email,
        password:hashedPassword,
    });

    try{
        await newUser.save();
        res.json('Signup successful');

    } catch(err){
        res.status(500).json({message: err.message});
    }
};