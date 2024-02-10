import User from '../model/user.model.js';
import bcrypt from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const signup = async (req, res,next) => {
    const {username,email,password}=req.body;

    if(!username || !email || !password || username === "" || email === "" || password === ""){
      return  next(errorHandler(400,"All fields are required"));
    }

    if( password.length < 6){
        
      return  next(errorHandler(400,"Password must be at least 6 characters"));
    }

     try {
        
        const user = await User.findOne({email:email})
        if(user){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword=bcrypt.hashSync(password,10);
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        });
        await newUser.save();
        return res.status(201).json({message:"User created successfully"})

     } catch (error) {
        return next();
     }
}

export const signin = async (req, res,next) => {
    const {email ,password}=req.body;

    if(!email || !password || email === "" || password === ""){
      return  next(errorHandler(400,"All fields are required"));
    }

    try {
        const user = await User.findOne({
            email:email
        });
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token = jwt.sign ({id:user._id},process.env.JWT_SECRET);
        
        const {password:pass,...data}=user._doc;
        return res.status(200).cookie('accesstoken',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',

        }).json({message:'Logged in successfully',
        user:data,
      })
    
       }    catch (error) {
        return next();
    }
}

 