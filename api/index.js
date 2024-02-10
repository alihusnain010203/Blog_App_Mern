import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DBconnect from './connection/DBconnect.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
const app = express();

dotenv.config();


// Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(cookieParser());

app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

app.use((err,req,res,next)=>{
    const statusCode= err.statusCode||500;
    const errorMessage= err.message||"Internal Server Error";

    res.status(statusCode).json({
        success:false,
        statusCode:statusCode,
        message:errorMessage

    }); 


})

DBconnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});