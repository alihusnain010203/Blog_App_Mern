import e from 'express';
import express from 'express';
import { google, signin, signup } from '../controller/auth.controller.js';


const router = express.Router();

// Signup
router.post('/signup',signup);

// Sign In
router.post('/signin',signin);

// Sign Out

router.get('/signout',(req,res)=>{
    res.clearCookie('access_token');
    res.json({
        message:'Signout Successful'
    });
});



// Google

router.post('/google',google);

export default router;