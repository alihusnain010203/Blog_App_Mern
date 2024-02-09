import User from '../model/user.model.js';
import bcrypt from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
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

 