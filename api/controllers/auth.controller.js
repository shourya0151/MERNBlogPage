import User from '../model/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';



export const signup = async(req,res,next)=>{
    const {username,email,password} = req.body;
    
    if(!username || 
        !email || !password 
        || username === '' 
        || password === ''
        || email === '')
    {
        next(errorHandler(400,"All fields are required"));
    }


    //hashed password
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
        next(err);
    }
};


export const signin = async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password 
        || email === '' 
        || password === ''
        )
    {
        next(errorHandler(400,"All fields are required"));
    }

    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            next(errorHandler(404,"User not found"));
        }
        
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(400,'Inavlid userName or password'));
        }

        const token = jwt.sign({ id: validUser.__id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        //separate the password before sending it back
        const {password:pass , ...rest} = validUser._doc;
        //console.log(validUser._doc);

        res
            .status(200)
            .cookie("access_token",token,{
                httpOnly: true,
            })
            .json(rest);
    }catch(err){
        next(err);
    }
};