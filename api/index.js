import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DBconnect from './connection/DBconnect.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js';
import cookieParser from 'cookie-parser';
import commentRoute from './routes/comment.route.js';
import path from 'path';
const app = express();

dotenv.config();

const __dirname = path.resolve();
// Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));


app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
    });

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