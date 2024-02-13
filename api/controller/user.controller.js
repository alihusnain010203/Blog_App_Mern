import User from "../model/user.model.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
    
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    
    if (req.body.password) {
     if(req.body.password !== ''){
       if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    } else {
      delete req.body.password; // Skip password update if it is an empty string
    }
    }
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, 'Username must be between 7 and 20 characters')
        );
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
    }
    if(req.body.email){
      const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            return next(errorHandler(400, 'Email already exists'));
        }
    }
    if(req.body.username){
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            return next(errorHandler(400, 'Username already exists'));
        }
    }
    try {
      const findUser = await User.findById(req.params.id);
      if (!findUser) {
        return next(errorHandler(404, 'User not found'));
      }
      if(req.body.password==''){
        req.body.password = findUser.password;
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            DPurl: req.body.DPurl,
            password: req.body.password,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    if (req.user.id !== userId) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
      await User.findByIdAndDelete(userId);
      res.status(200).json('User has been deleted');
    }
    catch (error) {
      next(error);
    }
    
  };